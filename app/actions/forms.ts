"use server";

import { randomUUID } from "node:crypto";
import { getAvailableSlots } from "@/lib/booking";
import { clinicConfig } from "@/lib/config";
import { emptyActionState, type ActionState } from "@/lib/form-state";
import { enqueueDeliveryJob, processDeliveryJob } from "@/lib/server/delivery-queue";
import { logInfo, logWarn } from "@/lib/server/logger";
import { checkRateLimit } from "@/lib/server/request-guard";
import {
  createBookingRecord,
  createEnquiryRecord,
  getReservedSlots,
} from "@/lib/server/submissions-store";
import {
  bookingSchema,
  chatbotSchema,
  enquirySchema,
  type BookingValues,
  type ChatbotValues,
  type EnquiryValues,
} from "@/lib/validations";

function buildFieldErrors<TValues>(
  issues: Array<{ path: PropertyKey[]; message: string }>,
): Partial<Record<keyof TValues, string>> {
  return issues.reduce<Partial<Record<keyof TValues, string>>>((acc, issue) => {
    const field = issue.path[0] as keyof TValues | undefined;

    if (field && !acc[field]) {
      acc[field] = issue.message;
    }

    return acc;
  }, {});
}

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function submitBookingAction(
  _previousState: ActionState<BookingValues>,
  formData: FormData,
): Promise<ActionState<BookingValues>> {
  const requestId = randomUUID();

  if (getString(formData, "website")) {
    logWarn("booking honeypot triggered", { requestId });

    return {
      status: "success",
      message: clinicConfig.booking.successDescription,
      fieldErrors: {},
      payload: {
        doctorId: "",
        date: "",
        patientName: "",
        email: "",
        phone: "",
        reason: "",
        slot: "",
      },
    };
  }

  const values: BookingValues = {
    doctorId: getString(formData, "doctorId"),
    date: getString(formData, "date"),
    patientName: getString(formData, "patientName"),
    email: getString(formData, "email"),
    phone: getString(formData, "phone"),
    reason: getString(formData, "reason"),
    slot: getString(formData, "slot"),
  };

  const parsed = bookingSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted booking fields.",
      fieldErrors: buildFieldErrors<BookingValues>(parsed.error.issues),
      values,
    };
  }

  const bookingRateLimit = await checkRateLimit(
    `booking:${parsed.data.email}:${parsed.data.phone}`,
    {
      limit: 3,
      windowMs: 60_000,
    },
  );

  if (bookingRateLimit.limited) {
    return {
      status: "error",
      message: `Too many booking attempts. Please wait ${Math.ceil(bookingRateLimit.retryAfterMs / 1000)} seconds and try again.`,
      fieldErrors: {},
      values,
    };
  }

  const reservedSlots = await getReservedSlots(
    parsed.data.date,
    parsed.data.doctorId,
  );

  const availableSlots = getAvailableSlots(
    new Date(`${parsed.data.date}T00:00:00`),
    parsed.data.doctorId,
    reservedSlots,
  );

  if (!availableSlots.includes(parsed.data.slot)) {
    return {
      status: "error",
      message:
        "The selected slot is no longer available. Please choose another time.",
      fieldErrors: {
        slot: "Choose one of the currently available slots",
      },
      values,
    };
  }

  const record = await createBookingRecord(parsed.data, requestId);

  if (!record.ok) {
    return {
      status: "error",
      message:
        "That slot was just taken by another patient. Please choose another time.",
      fieldErrors: {
        slot: "Choose one of the currently available slots",
      },
      values,
    };
  }

  const deliveryJob = await enqueueDeliveryJob({
    topic: "booking",
    recordId: record.booking.id,
    requestId,
    endpoint: process.env.BOOKING_WEBHOOK_URL,
    payload: {
      type: "booking",
      clinic: clinicConfig.brand.clinicName,
      submittedAt: new Date().toISOString(),
      requestId,
      bookingId: record.booking.id,
      confirmationCode: record.booking.confirmationCode,
      ...parsed.data,
    },
  });

  const delivery = await processDeliveryJob(deliveryJob.id);

  if (delivery?.status === "failed" || delivery?.status === "dead_letter") {
    logWarn("booking delivery failed after persistence", {
      requestId,
      bookingId: record.booking.id,
      confirmationCode: record.booking.confirmationCode,
      error: delivery.lastError,
      statusCode: delivery.lastStatusCode,
    });

    return {
      status: "success",
      message: `Your request was saved with reference ${record.booking.confirmationCode}. Our team will review it manually because automatic confirmation is temporarily unavailable.`,
      fieldErrors: {},
      payload: {
        doctorId: "",
        date: "",
        patientName: "",
        email: "",
        phone: "",
        reason: "",
        slot: "",
      },
    };
  }

  if (delivery?.status === "skipped") {
    logWarn("booking saved without outbound webhook", {
      requestId,
      bookingId: record.booking.id,
      confirmationCode: record.booking.confirmationCode,
    });

    return {
      status: "success",
      message: `Your booking request was saved with reference ${record.booking.confirmationCode}. Connect BOOKING_WEBHOOK_URL before relying on automated clinic workflows.`,
      fieldErrors: {},
      payload: {
        doctorId: "",
        date: "",
        patientName: "",
        email: "",
        phone: "",
        reason: "",
        slot: "",
      },
    };
  }

  logInfo("booking saved and delivered", {
    requestId,
    bookingId: record.booking.id,
    confirmationCode: record.booking.confirmationCode,
    deliveryJobId: deliveryJob.id,
  });

  return {
    status: "success",
    message: `${clinicConfig.booking.successDescription} Reference: ${record.booking.confirmationCode}.`,
    fieldErrors: {},
    payload: {
      doctorId: "",
      date: "",
      patientName: "",
      email: "",
      phone: "",
      reason: "",
      slot: "",
    },
  };
}

export async function submitEnquiryAction(
  _previousState: ActionState<EnquiryValues>,
  formData: FormData,
): Promise<ActionState<EnquiryValues>> {
  const requestId = randomUUID();

  if (getString(formData, "website")) {
    logWarn("enquiry honeypot triggered", { requestId });

    return {
      status: "success",
      message: clinicConfig.contactForm.successDescription,
      fieldErrors: {},
      payload: {
        name: "",
        phone: "",
        email: "",
        service: "",
        message: "",
      },
    };
  }

  const values: EnquiryValues = {
    name: getString(formData, "name"),
    phone: getString(formData, "phone"),
    email: getString(formData, "email"),
    service: getString(formData, "service"),
    message: getString(formData, "message"),
  };

  const parsed = enquirySchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted enquiry fields.",
      fieldErrors: buildFieldErrors<EnquiryValues>(parsed.error.issues),
      values,
    };
  }

  const enquiryRateLimit = await checkRateLimit(
    `enquiry:${parsed.data.email}:${parsed.data.phone}`,
    {
      limit: 4,
      windowMs: 60_000,
    },
  );

  if (enquiryRateLimit.limited) {
    return {
      status: "error",
      message: `Too many enquiry attempts. Please wait ${Math.ceil(enquiryRateLimit.retryAfterMs / 1000)} seconds and try again.`,
      fieldErrors: {},
      values,
    };
  }

  const enquiry = await createEnquiryRecord(parsed.data, requestId);

  const deliveryJob = await enqueueDeliveryJob({
    topic: "enquiry",
    recordId: enquiry.id,
    requestId,
    endpoint: process.env.CONTACT_WEBHOOK_URL,
    payload: {
      type: "enquiry",
      clinic: clinicConfig.brand.clinicName,
      submittedAt: new Date().toISOString(),
      requestId,
      enquiryId: enquiry.id,
      ...parsed.data,
    },
  });

  const delivery = await processDeliveryJob(deliveryJob.id);

  if (delivery?.status === "failed" || delivery?.status === "dead_letter") {
    logWarn("enquiry delivery failed after persistence", {
      requestId,
      enquiryId: enquiry.id,
      error: delivery.lastError,
      statusCode: delivery.lastStatusCode,
    });

    return {
      status: "success",
      message:
        "Your enquiry was saved for manual follow-up because automatic routing is temporarily unavailable.",
      fieldErrors: {},
      payload: {
        name: "",
        phone: "",
        email: "",
        service: "",
        message: "",
      },
    };
  }

  if (delivery?.status === "skipped") {
    logWarn("enquiry saved without outbound webhook", {
      requestId,
      enquiryId: enquiry.id,
    });

    return {
      status: "success",
      message:
        "Your enquiry was saved. Connect CONTACT_WEBHOOK_URL before relying on automated routing.",
      fieldErrors: {},
      payload: {
        name: "",
        phone: "",
        email: "",
        service: "",
        message: "",
      },
    };
  }

  logInfo("enquiry saved and delivered", {
    requestId,
    enquiryId: enquiry.id,
    deliveryJobId: deliveryJob.id,
  });

  return {
    status: "success",
    message: clinicConfig.contactForm.successDescription,
    fieldErrors: {},
    payload: {
      name: "",
      phone: "",
      email: "",
      service: "",
      message: "",
    },
  };
}

type BookingDraft = {
  doctorId?: string;
  date?: string;
};

type ChatbotResponsePayload = {
  reply: string;
  doctorId?: string;
  date?: string;
};

export async function requestChatbotReplyAction(
  _previousState: ActionState<ChatbotValues>,
  formData: FormData,
): Promise<ActionState<ChatbotValues>> {
  const values: ChatbotValues = {
    message: getString(formData, "message"),
    doctorId: getString(formData, "doctorId") || undefined,
    date: getString(formData, "date") || undefined,
  };

  const parsed = chatbotSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ...emptyActionState,
      status: "error",
      message: "Please enter a valid message.",
    };
  }

  const normalized = parsed.data.message.toLowerCase();
  const activeDraft: BookingDraft = {
    doctorId: parsed.data.doctorId,
    date: parsed.data.date,
  };

  let payload: ChatbotResponsePayload;

  if (
    activeDraft.doctorId ||
    normalized.includes("book") ||
    normalized.includes("appointment")
  ) {
    if (!activeDraft.doctorId) {
      const matchedDoctor = clinicConfig.doctors.find((doctor) => {
        const lastName = doctor.name.toLowerCase().split(" ")[1];
        return (
          normalized.includes(lastName) ||
          normalized.includes(doctor.specialty.toLowerCase())
        );
      });

      payload = matchedDoctor
        ? {
            reply: `Great. I can help you book with ${matchedDoctor.name}. Please type your preferred date in YYYY-MM-DD format.`,
            doctorId: matchedDoctor.id,
          }
        : {
            reply: `Sure. Which doctor would you like to book with? Options: ${clinicConfig.doctors
              .map((doctor) => doctor.name)
              .join(", ")}.`,
          };
    } else if (!activeDraft.date) {
      const bookingDate = new Date(parsed.data.message);

      if (Number.isNaN(bookingDate.getTime())) {
        payload = {
          reply:
            "Please send the date in YYYY-MM-DD format, for example 2026-04-12.",
          doctorId: activeDraft.doctorId,
        };
      } else {
        const isoDate = parsed.data.message;
        const reservedSlots = await getReservedSlots(
          isoDate,
          activeDraft.doctorId,
        );
        const slots = getAvailableSlots(
          bookingDate,
          activeDraft.doctorId,
          reservedSlots,
        );

        payload = {
          reply: `Available slots on ${isoDate} are ${slots.slice(0, 5).join(", ")}. Use the booking page to submit the request securely.`,
          doctorId: activeDraft.doctorId,
          date: isoDate,
        };
      }
    } else {
      payload = {
        reply:
          "I can suggest slots and treatment information here, but secure booking submission happens on the booking page.",
      };
    }
  } else if (
    normalized.includes("service") ||
    normalized.includes("aligner") ||
    normalized.includes("implant")
  ) {
    payload = {
      reply:
        "We offer implants, aligners, braces, root canal therapy, pediatric care, cosmetic dentistry, and preventive checkups. If you want, I can also help you choose the right service.",
    };
  } else if (normalized.includes("price") || normalized.includes("cost")) {
    payload = {
      reply:
        "Exact pricing depends on diagnosis and treatment complexity. Use the enquiry form for clinic-specific estimates, or I can guide you toward the right treatment page.",
    };
  } else if (normalized.includes("emergency") || normalized.includes("pain")) {
    payload = {
      reply: `For urgent swelling, trauma, or severe pain, call the emergency line now: ${clinicConfig.contact.emergencyPhone}.`,
    };
  } else if (normalized.includes("insurance")) {
    payload = {
      reply:
        "Insurance and financing details can be customized per clinic tenant. For this template, you can place insurer lists, partner plans, or payment guidance in config or CMS content.",
    };
  } else if (normalized.includes("doctor")) {
    payload = {
      reply: `Current doctors are ${clinicConfig.doctors
        .map((doctor) => doctor.name)
        .join(", ")}. I can also help you compare their specialties.`,
    };
  } else {
    payload = {
      reply: clinicConfig.chatbot.defaultFallback,
    };
  }

  return {
    ...emptyActionState,
    status: "success",
    message: payload.reply,
    payload,
  };
}
