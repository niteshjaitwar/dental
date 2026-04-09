const phonePattern = /^\+?[0-9\s\-()]{8,20}$/;

function isWithinBookingWindow(value: string) {
  const appointmentDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(appointmentDate.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 6);

  return appointmentDate >= today && appointmentDate <= maxDate;
}

import { z } from "zod";
import { clinicConfig } from "@/lib/config";

const doctorIds = clinicConfig.doctors.map((doctor) => doctor.id);
const serviceTitles = clinicConfig.services.map((service) => service.title);

export const bookingSchema = z.object({
  doctorId: z
    .string()
    .refine((value) => doctorIds.includes(value), "Select a valid doctor"),
  date: z
    .string()
    .date("Choose a valid appointment date")
    .refine(
      (value) => isWithinBookingWindow(value),
      "Appointments can only be booked up to 6 months ahead",
    ),
  patientName: z.string().trim().min(2, "Enter patient name").max(80),
  email: z.string().trim().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .regex(phonePattern, "Enter a valid phone number"),
  reason: z
    .string()
    .trim()
    .min(6, "Tell us a little about the appointment")
    .max(500),
  slot: z.string().trim().min(1, "Choose a time slot"),
});

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: z
    .string()
    .trim()
    .regex(phonePattern, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email"),
  service: z
    .string()
    .refine((value) => serviceTitles.includes(value), "Choose a valid service"),
  message: z.string().trim().min(10, "Add a short message").max(800),
});

export const chatbotSchema = z.object({
  message: z.string().trim().min(1, "Enter a message").max(400),
  doctorId: z.string().optional(),
  date: z.string().date().optional(),
});

export type BookingValues = z.infer<typeof bookingSchema>;
export type EnquiryValues = z.infer<typeof enquirySchema>;
export type ChatbotValues = z.infer<typeof chatbotSchema>;
