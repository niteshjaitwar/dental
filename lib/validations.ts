import { z } from "zod";
import { clinicConfig } from "@/lib/config";

const doctorIds = clinicConfig.doctors.map((doctor) => doctor.id);
const serviceTitles = clinicConfig.services.map((service) => service.title);

export const bookingSchema = z.object({
  doctorId: z
    .string()
    .refine((value) => doctorIds.includes(value), "Select a valid doctor"),
  date: z.string().date("Choose a valid appointment date"),
  patientName: z.string().trim().min(2, "Enter patient name").max(80),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(8, "Enter a valid phone number").max(20),
  reason: z
    .string()
    .trim()
    .min(6, "Tell us a little about the appointment")
    .max(500),
  slot: z.string().trim().min(1, "Choose a time slot"),
});

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: z.string().trim().min(8, "Enter a valid phone number").max(20),
  email: z.string().trim().email("Enter a valid email"),
  service: z
    .string()
    .refine((value) => serviceTitles.includes(value), "Choose a valid service"),
  message: z.string().trim().min(10, "Add a short message").max(800),
});

export const chatbotSchema = z.object({
  message: z.string().trim().min(1, "Enter a message").max(400),
  doctorId: z.string().optional(),
  date: z.string().optional(),
});

export type BookingValues = z.infer<typeof bookingSchema>;
export type EnquiryValues = z.infer<typeof enquirySchema>;
export type ChatbotValues = z.infer<typeof chatbotSchema>;
