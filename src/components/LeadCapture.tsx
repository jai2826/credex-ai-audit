"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "../../convex/_generated/api";

const BLOCKED_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
];

const leadSchema = z.object({
  fullName: z.string(),
  workEmail: z.email().refine(
    (email) => {
      const domain = email.split("@")[1]?.toLowerCase();
      return !BLOCKED_DOMAINS.includes(domain);
    },
    { message: "Work email required." },
  ),
  companyName: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.string().optional(),
  password: z.string().max(0, "Bot detected"), // The trap It is actually a honeypot field - if it's filled out, we know it's a bot
});

export function LeadCapture({
  totalMonthlySavings,
}: {
  totalMonthlySavings: number;
}) {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      fullName: "",
      workEmail: "",
      companyName: "",
      role: "",
      teamSize: "",
      password: "",
    },
  });

  const isHighSavings = totalMonthlySavings >= 500;
  const createNewLead = useMutation(api.leads.createLead);

  const onSubmit = async (
    data: z.infer<typeof leadSchema>,
  ) => {
    // Honeypot check - if this field is filled out, it's likely a bot submission, so we silently drop it
    if (data.password.length > 0) return; // Silently drop bot submissions

    // TODO: Wire up your Convex mutation here
    const leadId = await createNewLead({
      fullName: data.fullName,
      workEmail: data.workEmail,
      companyName: data.companyName ?? "",
      role: data.role ?? "",
      teamSize: data.teamSize ?? "",
      auditDataSummary: `Total Monthly Savings: $${totalMonthlySavings}`,
    });
	console.log(leadId)
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 bg-green-50 text-green-700 rounded-lg border border-green-200">
        Thanks! Check your inbox shortly.
      </div>
    );
  }

  return (
    <div className="w-full  ">
      <Card className="bg-white border-slate-200 rounded-xl ">
        <CardHeader className="font-sans">
          <CardTitle className="text-2xl font-semibold font-sans capitalize!">
            {isHighSavings
              ? "Stop burning cash. Let Credex fix this for you."
              : "You're spending efficiently. Stay ahead of the curve."}
          </CardTitle>
          <CardDescription>
            {isHighSavings
              ? "Enter your work email to get this full report and book a free optimization consultation."
              : "Join our list to get notified the moment a new AI tool or pricing tier could save you money."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            <Controller
              control={form.control}
              name={"fullName"}
              render={({ field: f, fieldState: s }) => (
                <Field
                  
                  data-invalid={s.invalid}>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input
                    type="text"
                    {...f}
                    value={f.value ?? ""}
                    className="bg-white"
                  />
                  {s.invalid && (
                    <FieldError
                      className="text-red-600"
                      errors={[s.error]}
                    />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name={"companyName"}
              render={({ field: f, fieldState: s }) => (
                <Field data-invalid={s.invalid}>
                  <FieldLabel>Company Name</FieldLabel>
                  <Input
                    type="text"
                    {...f}
                    value={f.value ?? ""}
                    className="bg-white"
                  />
                  {s.invalid && (
                    <FieldError
                      className="text-red-600"
                      errors={[s.error]}
                    />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name={"workEmail"}
              render={({ field: f, fieldState: s }) => (
                <Field data-invalid={s.invalid}>
                  <FieldLabel>Work Email</FieldLabel>
                  <Input
                    type="email"
                    {...f}
                    value={f.value ?? ""}
                    className="bg-white"
                  />
                  {s.invalid && (
                    <FieldError
                      className="text-red-600"
                      errors={[s.error]}
                    />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name={"role"}
              render={({ field: f, fieldState: s }) => (
                <Field data-invalid={s.invalid}>
                  <FieldLabel>Role</FieldLabel>
                  <Input
                    type="text"
                    {...f}
                    value={f.value ?? ""}
                    className="bg-white"
                  />
                  {s.invalid && (
                    <FieldError
                      className="text-red-600"
                      errors={[s.error]}
                    />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name={"teamSize"}
              render={({ field: f, fieldState: s }) => (
                <Field data-invalid={s.invalid}>
                  <FieldLabel>Team Size</FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    {...f}
                    value={f.value ?? 1}
                    className="bg-white"
                  />
                  {s.invalid && (
                    <FieldError
                      className="text-red-600"
                      errors={[s.error]}
                    />
                  )}
                </Field>
              )}
            />
            {/* Password field for honeypot protection */}
            <Controller
              control={form.control}
              name={"password"}
              render={({ field: f, fieldState: s }) => (
                <Field
                  data-invalid={s.invalid}
                  className="absolute opacity-0 -z-10 h-0 w-0 overflow-hidden"
                  aria-hidden="true">
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...f}
                    value={f.value ?? 1}
                    className="bg-white"
                  />
                  {s.invalid && (
                    <FieldError
                      className="text-red-600"
                      errors={[s.error]}
                    />
                  )}
                </Field>
              )}
            />

            {/* Add optional fields here if you want them visible, or hide them behind an accordion */}
            <div className="col-span-2 flex p-2 pt-4">
              <Button
                type="submit"
                className="w-1/2 mx-auto rounded-md    bg-indigo-500 hover:bg-indigo-600">
                {isHighSavings
                  ? "Send My Report & Book Consult"
                  : "Notify Me of Future Savings"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
