"use client";

import dayjs from "dayjs";
import { CalendarDays } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import Calendar from "react-calendar";
import { submitBookingAction } from "@/app/actions/forms";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/providers/toast-provider";
import { getAvailableSlots } from "@/lib/booking";
import { clinicConfig } from "@/lib/config";
import { emptyActionState, type ActionState } from "@/lib/form-state";
import { bookingSchema, type BookingValues } from "@/lib/validations";

const defaultDoctorId = clinicConfig.doctors[0]?.id ?? "";

const initialValues: BookingValues = {
  doctorId: defaultDoctorId,
  date: dayjs().format("YYYY-MM-DD"),
  patientName: "",
  email: "",
  phone: "",
  reason: "",
  slot: "",
};

export function BookingForm() {
  const { showToast } = useToast();
  const [state, setState] =
    useState<ActionState<BookingValues>>(emptyActionState);
  const [values, setValues] = useState<BookingValues>(initialValues);
  const [clientErrors, setClientErrors] = useState<
    Partial<Record<keyof BookingValues, string>>
  >({});
  const [isPending, startTransition] = useTransition();

  const selectedDate = useMemo(
    () => new Date(`${values.date}T00:00:00`),
    [values.date],
  );
  const slots = useMemo(
    () => getAvailableSlots(selectedDate, values.doctorId),
    [selectedDate, values.doctorId],
  );
  const selectedSlot = slots.includes(values.slot) ? values.slot : "";

  const fieldErrors = { ...state.fieldErrors, ...clientErrors } as Partial<
    Record<keyof BookingValues, string>
  >;

  const handleChange = <TKey extends keyof BookingValues>(
    key: TKey,
    value: BookingValues[TKey],
  ) => {
    setValues((current) => {
      const nextValues = { ...current, [key]: value };

      if (
        (key === "doctorId" || key === "date") &&
        !getAvailableSlots(
          new Date(`${nextValues.date}T00:00:00`),
          nextValues.doctorId,
        ).includes(nextValues.slot)
      ) {
        nextValues.slot = "";
      }

      return nextValues;
    });
    setClientErrors((current) => ({ ...current, [key]: undefined }));
  };

  const runServerAction = () => {
    const formData = new FormData();

    for (const [key, value] of Object.entries({
      ...values,
      slot: selectedSlot,
    })) {
      formData.set(key, value);
    }

    startTransition(async () => {
      const nextState = await submitBookingAction(emptyActionState, formData);
      setState(nextState);

      if (nextState.status === "success") {
        showToast({
          title: clinicConfig.booking.successTitle,
          description: nextState.message,
          tone: "success",
          duration: 5000,
        });
      }

      if (nextState.status === "error" && nextState.message) {
        showToast({
          title: "Booking request failed",
          description: nextState.message,
          tone: "error",
          duration: 5000,
        });
      }

      if (nextState.status === "success") {
        setValues(initialValues);
        setClientErrors({});
      }
    });
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="glass-card rounded-[2rem] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--primary)]/10">
              <CalendarDays className="h-5 w-5 text-[color:var(--primary)]" />
            </div>
            <div>
              <p className="text-lg font-semibold">
                {clinicConfig.booking.dateTitle}
              </p>
              <p className="text-sm text-[color:var(--muted)]">
                {clinicConfig.booking.dateDescription}
              </p>
            </div>
          </div>
          <div className="mt-5">
            <Calendar
              minDate={new Date()}
              onChange={(value) => {
                const dateValue = dayjs(value as Date).format("YYYY-MM-DD");
                handleChange("date", dateValue);
              }}
              value={selectedDate}
            />
          </div>
        </div>
        <form
          className="glass-card rounded-[2rem] p-6"
          onSubmit={(event) => {
            event.preventDefault();
            const nextValues = { ...values, slot: selectedSlot };
            const parsed = bookingSchema.safeParse(nextValues);

            if (!parsed.success) {
              const nextErrors = parsed.error.issues.reduce<
                Partial<Record<keyof BookingValues, string>>
              >((acc, issue) => {
                const field = issue.path[0] as keyof BookingValues | undefined;
                if (field && !acc[field]) {
                  acc[field] = issue.message;
                }
                return acc;
              }, {});

              setClientErrors(nextErrors);
              setState({
                status: "error",
                message: "Please correct the highlighted booking fields.",
                fieldErrors: {},
              });
              showToast({
                title: "Booking request failed",
                description: "Please correct the highlighted booking fields.",
                tone: "error",
                duration: 5000,
              });
              return;
            }

            setClientErrors({});
            runServerAction();
          }}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                {clinicConfig.booking.doctorLabel}
              </label>
              <Select
                name="doctorId"
                value={values.doctorId}
                onChange={(event) =>
                  handleChange("doctorId", event.target.value)
                }
              >
                {clinicConfig.doctors.map((doctor) => (
                  <option
                    key={doctor.id}
                    value={doctor.id}
                    className="text-slate-900"
                  >
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </Select>
              {fieldErrors.doctorId ? (
                <FormMessage>{fieldErrors.doctorId}</FormMessage>
              ) : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                {clinicConfig.booking.patientNameLabel}
              </label>
              <Input
                name="patientName"
                value={values.patientName}
                onChange={(event) =>
                  handleChange("patientName", event.target.value)
                }
              />
              {fieldErrors.patientName ? (
                <FormMessage>{fieldErrors.patientName}</FormMessage>
              ) : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                {clinicConfig.booking.emailLabel}
              </label>
              <Input
                name="email"
                type="email"
                value={values.email}
                onChange={(event) => handleChange("email", event.target.value)}
              />
              {fieldErrors.email ? (
                <FormMessage>{fieldErrors.email}</FormMessage>
              ) : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                {clinicConfig.booking.phoneLabel}
              </label>
              <Input
                name="phone"
                value={values.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
              />
              {fieldErrors.phone ? (
                <FormMessage>{fieldErrors.phone}</FormMessage>
              ) : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                {clinicConfig.booking.dateLabel}
              </label>
              <div className="rounded-2xl border border-[color:var(--border)] px-4 py-3">
                {dayjs(values.date).format("dddd, MMMM D, YYYY")}
              </div>
              {fieldErrors.date ? (
                <FormMessage>{fieldErrors.date}</FormMessage>
              ) : null}
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                {clinicConfig.booking.slotLabel}
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                {slots.map((slot) => {
                  const isSelected = selectedSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      className={`rounded-2xl border px-4 py-3 text-center text-sm transition ${
                        isSelected
                          ? "border-[color:var(--primary)] bg-[color:var(--primary)]/10"
                          : "border-[color:var(--border)] hover:border-[color:var(--primary)]"
                      }`}
                      onClick={() => handleChange("slot", slot)}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {fieldErrors.slot ? (
                <FormMessage>{fieldErrors.slot}</FormMessage>
              ) : null}
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                {clinicConfig.booking.reasonLabel}
              </label>
              <Textarea
                name="reason"
                rows={4}
                value={values.reason}
                onChange={(event) => handleChange("reason", event.target.value)}
              />
              {fieldErrors.reason ? (
                <FormMessage>{fieldErrors.reason}</FormMessage>
              ) : null}
            </div>
          </div>
          {state.status === "error" && state.message ? (
            <FormMessage>{state.message}</FormMessage>
          ) : null}
          <div className="mt-6">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending
                ? clinicConfig.booking.submittingLabel
                : clinicConfig.booking.submitLabel}
            </Button>
          </div>
        </form>
      </div>
      {isPending ? (
        <FormMessage tone="muted">
          {clinicConfig.booking.submittingLabel}
        </FormMessage>
      ) : null}
    </>
  );
}
