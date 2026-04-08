"use client";

import { useState, useTransition } from "react";
import { submitEnquiryAction } from "@/app/actions/forms";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { clinicConfig } from "@/lib/config";
import { emptyActionState, type ActionState } from "@/lib/form-state";
import { enquirySchema, type EnquiryValues } from "@/lib/validations";

const initialValues: EnquiryValues = {
  name: "",
  phone: "",
  email: "",
  service: "",
  message: "",
};

export function ContactForm() {
  const { showToast } = useToast();
  const [state, setState] =
    useState<ActionState<EnquiryValues>>(emptyActionState);
  const [values, setValues] = useState<EnquiryValues>(initialValues);
  const [clientErrors, setClientErrors] = useState<
    Partial<Record<keyof EnquiryValues, string>>
  >({});
  const [isPending, startTransition] = useTransition();

  const fieldErrors = { ...state.fieldErrors, ...clientErrors } as Partial<
    Record<keyof EnquiryValues, string>
  >;

  const handleChange = <TKey extends keyof EnquiryValues>(
    key: TKey,
    value: EnquiryValues[TKey],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    setClientErrors((current) => ({ ...current, [key]: undefined }));
  };

  return (
    <div className="glass-card rounded-[2rem] p-6">
      <div className="mb-6">
        <p className="text-lg font-semibold">
          {clinicConfig.contactForm.title}
        </p>
        <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
          {clinicConfig.contactForm.description}
        </p>
      </div>
      <form
        className="grid gap-5 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          const parsed = enquirySchema.safeParse(values);

          if (!parsed.success) {
            const nextErrors = parsed.error.issues.reduce<
              Partial<Record<keyof EnquiryValues, string>>
            >((acc, issue) => {
              const field = issue.path[0] as keyof EnquiryValues | undefined;
              if (field && !acc[field]) {
                acc[field] = issue.message;
              }
              return acc;
            }, {});

            setClientErrors(nextErrors);
            setState({
              status: "error",
              message: "Please correct the highlighted enquiry fields.",
              fieldErrors: {},
            });
            showToast({
              title: "Enquiry failed",
              description: "Please correct the highlighted enquiry fields.",
              tone: "error",
              duration: 5000,
            });
            return;
          }

          setClientErrors({});
          const formData = new FormData();
          for (const [key, value] of Object.entries(values)) {
            formData.set(key, value);
          }

          startTransition(async () => {
            const nextState = await submitEnquiryAction(
              emptyActionState,
              formData,
            );
            setState(nextState);

            if (nextState.status === "success") {
              showToast({
                title: clinicConfig.contactForm.successTitle,
                description: nextState.message,
                tone: "success",
                duration: 5000,
              });
            }

            if (nextState.status === "error" && nextState.message) {
              showToast({
                title: "Enquiry failed",
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
        }}
      >
        <div>
          <label className="mb-2 block text-sm font-medium">
            {clinicConfig.contactForm.nameLabel}
          </label>
          <Input
            name="name"
            value={values.name}
            onChange={(event) => handleChange("name", event.target.value)}
          />
          {fieldErrors.name ? (
            <FormMessage>{fieldErrors.name}</FormMessage>
          ) : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">
            {clinicConfig.contactForm.phoneLabel}
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
            {clinicConfig.contactForm.emailLabel}
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
            {clinicConfig.contactForm.serviceLabel}
          </label>
          <Select
            name="service"
            value={values.service}
            onChange={(event) => handleChange("service", event.target.value)}
          >
            <option value="" className="text-slate-900">
              {clinicConfig.contactForm.servicePlaceholder}
            </option>
            {clinicConfig.services.map((service) => (
              <option
                key={service.title}
                value={service.title}
                className="text-slate-900"
              >
                {service.title}
              </option>
            ))}
          </Select>
          {fieldErrors.service ? (
            <FormMessage>{fieldErrors.service}</FormMessage>
          ) : null}
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">
            {clinicConfig.contactForm.messageLabel}
          </label>
          <Textarea
            name="message"
            rows={5}
            value={values.message}
            onChange={(event) => handleChange("message", event.target.value)}
          />
          {fieldErrors.message ? (
            <FormMessage>{fieldErrors.message}</FormMessage>
          ) : null}
        </div>
        <div className="md:col-span-2">
          {state.status === "error" && state.message ? (
            <FormMessage>{state.message}</FormMessage>
          ) : null}
          <Button type="submit" className="mt-1 w-full" disabled={isPending}>
            {isPending
              ? clinicConfig.contactForm.submittingLabel
              : clinicConfig.contactForm.submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
