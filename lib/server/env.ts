import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url()
  .optional()
  .or(z.literal(""))
  .transform((value) => value || undefined);

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  DATABASE_URL: optionalUrl,
  BOOKING_WEBHOOK_URL: optionalUrl,
  CONTACT_WEBHOOK_URL: optionalUrl,
  DELIVERY_QUEUE_TOKEN: z.string().trim().min(16).optional(),
  OPS_DASHBOARD_TOKEN: z.string().trim().min(16).optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

export function getAppEnv(input: Partial<NodeJS.ProcessEnv> = process.env): AppEnv {
  return envSchema.parse(input);
}

export function validateAppEnv(input: Partial<NodeJS.ProcessEnv> = process.env) {
  return envSchema.safeParse(input);
}