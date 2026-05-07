"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { z } from "zod";

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
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Tool definitions with their respective plan tiers
const TOOLS_CONFIG = {
  cursor: {
    name: "Cursor",
    plans: ["Free", "Pro", "Enterprise"],
  },
  github_copilot: {
    name: "GitHub Copilot",
    plans: ["Individual", "Business", "Enterprise"],
  },
  claude: {
    name: "Claude",
    plans: ["Free", "Claude Pro", "Claude API"],
  },
  chatgpt: {
    name: "ChatGPT",
    plans: ["Free", "Plus", "Teams", "Enterprise"],
  },
  anthropic_api: {
    name: "Anthropic API",
    plans: ["Pay-as-you-go", "Enterprise"],
  },
  openai_api: {
    name: "OpenAI API",
    plans: ["Pay-as-you-go", "Enterprise"],
  },
  gemini: {
    name: "Gemini",
    plans: ["Free", "Gemini Advanced", "API"],
  },
  v0: {
    name: "v0",
    plans: ["Free", "Pro", "Team"],
  },
} as const;

type ToolKey = keyof typeof TOOLS_CONFIG;

const toolSchema = z.object({
  tool: z.string().min(1, "Please select a tool"),
  planTier: z.string().min(1, "Please select a plan tier"),
  monthlySpend: z.coerce
    .number()
    .min(0, "Monthly spend must be at least $0")
    .max(100000, "Monthly spend cannot exceed $100,000"),
  numberOfSeats: z.coerce
    .number()
    .int("Number of seats must be a whole number")
    .min(1, "Number of seats must be at least 1")
    .max(10000, "Number of seats cannot exceed 10,000"),
});

const spendInputFormSchema = z.object({
  tools: z
    .array(toolSchema)
    .min(1, "Please add at least one AI tool")
    .max(8, "Maximum 8 tools allowed"),
  totalEngineeringTeamSize: z.coerce
    .number()
    .int("Must be a whole number")
    .min(1, "Team size must be at least 1")
    .max(10000, "Team size cannot exceed 10,000"),
  primaryUseCase: z.enum(
    ["coding", "writing", "data", "research", "mixed"],
    {
      message: "Please select a valid use case",
    },
  ),
});

type SpendInputFormValues = z.infer<
  typeof spendInputFormSchema
>;
type SpendInputFormInput = z.input<
  typeof spendInputFormSchema
>;

export function SpendInputForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<
    SpendInputFormInput,
    unknown,
    SpendInputFormValues
  >({
    resolver: zodResolver(spendInputFormSchema),
    defaultValues: {
      tools: [
        {
          tool: "",
          planTier: "",
          monthlySpend: 0,
          numberOfSeats: 1,
        },
      ],
      totalEngineeringTeamSize: 1,
      primaryUseCase: undefined,
    },
  });

  const watchedTools = useWatch({
    control: form.control,
    name: "tools",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tools",
  });

  const onSubmit = async (values: SpendInputFormValues) => {
    setIsSubmitting(true);
    try {
      // Here you would normally send the data to your backend
      console.log("Form Data:", values);
      // Example: await fetch('/api/audit', { method: 'POST', body: JSON.stringify(values) })
      alert(
        "Audit request submitted! Check console for details.",
      );
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTool = () => {
    if (fields.length < 8) {
      append({
        tool: "",
        planTier: "",
        monthlySpend: 0,
        numberOfSeats: 1,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">
            AI Tools Spending Calculator
          </CardTitle>
          <CardDescription className="text-slate-600">
            Track and analyze your AI tool expenses across
            your engineering team
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8">
            {/* Tools Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    AI Tools
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Add all AI tools your team is currently
                    using
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={addTool}
                  disabled={fields.length >= 8}
                  variant="outline"
                  size="sm"
                  className="border-slate-200 text-slate-900 hover:bg-slate-50">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tool
                </Button>
              </div>

              {/* Tool Items */}
              <div className="space-y-4">
                {fields.map((field, index) => {
                  const selectedTool = (watchedTools?.[index]?.tool) as ToolKey;
                  const planTiers = selectedTool
                    ? TOOLS_CONFIG[selectedTool]?.plans ||
                      []
                    : [];

                  return (
                    <div
                      key={field.id}
                      className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-4">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-slate-900">
                          Tool {index + 1}
                        </h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            variant="ghost"
                            size="sm"
                            className="text-slate-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      {/* Grid for tool fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Tool Dropdown */}
                        <Controller
                          control={form.control}
                          name={`tools.${index}.tool`}
                          render={({
                            field,
                            fieldState,
                          }) => (
                            <Field>
                              <FieldLabel className="text-slate-700">
                                Tool
                              </FieldLabel>
                              <Select
                                value={field.value}
                                onValueChange={
                                  field.onChange
                                }>
                                <SelectTrigger className="border-slate-200 bg-white text-slate-900">
                                  <SelectValue placeholder="Select a tool" />
                                </SelectTrigger>

                                <SelectContent className="bg-white">
                                  {Object.entries(
                                    TOOLS_CONFIG,
                                  ).map(([key, config]) => (
                                    <SelectItem
                                      key={key}
                                      value={key}>
                                      {config.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {fieldState.invalid && (
                                <FieldError
                                  className="text-red-600"
                                  errors={[
                                    fieldState.error,
                                  ]}
                                />
                              )}
                            </Field>
                          )}
                        />

                        {/* Plan Tier Dropdown */}
                        <Controller
                          control={form.control}
                          name={`tools.${index}.planTier`}
                          render={({
                            field,
                            fieldState,
                          }) => (
                            <Field>
                              <FieldLabel className="text-slate-700">
                                Plan Tier
                              </FieldLabel>
                              <Select
                                value={field.value}
                                onValueChange={
                                  field.onChange
                                }>
                                <SelectTrigger
                                  disabled={!selectedTool}
                                  className="border-slate-200 bg-white text-slate-900 disabled:opacity-50">
                                  <SelectValue placeholder="Select a plan" />
                                </SelectTrigger>

                                <SelectContent className="bg-white">
                                  {planTiers.map((plan) => (
                                    <SelectItem
                                      key={plan}
                                      value={plan}>
                                      {plan}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {fieldState.invalid && (
                                <FieldError
                                  className="text-red-600"
                                  errors={[
                                    fieldState.error,
                                  ]}
                                />
                              )}
                            </Field>
                          )}
                        />

                        {/* Monthly Spend */}
                        <Controller
                          control={form.control}
                          name={`tools.${index}.monthlySpend`}
                          render={({
                            field,
                            fieldState,
                          }) => (
                            <Field>
                              <FieldLabel className="text-slate-700">
                                Monthly Spend
                              </FieldLabel>

                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700 font-medium">
                                  $
                                </span>
                                <Input
                                  ref={field.ref}
                                  name={field.name}
                                  onBlur={field.onBlur}
                                  type="number"
                                  placeholder="0.00"
                                  value={
                                    (field.value as string) ??
                                    ""
                                  }
                                  className="pl-8 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? parseFloat(
                                            e.target.value,
                                          )
                                        : 0,
                                    )
                                  }
                                />
                              </div>

                              {fieldState.invalid && (
                                <FieldError
                                  className="text-red-600"
                                  errors={[
                                    fieldState.error,
                                  ]}
                                />
                              )}
                            </Field>
                          )}
                        />

                        {/* Number of Seats */}
                        <Controller
                          control={form.control}
                          name={`tools.${index}.numberOfSeats`}
                          render={({
                            field,
                            fieldState,
                          }) => (
                            <Field>
                              <FieldLabel className="text-slate-700">
                                Number of Seats
                              </FieldLabel>

                              <Input
                                ref={field.ref}
                                name={field.name}
                                onBlur={field.onBlur}
                                type="number"
                                placeholder="1"
                                value={
                                  (field.value as number) ??
                                  1
                                }
                                className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? parseInt(
                                          e.target.value,
                                          10,
                                        )
                                      : 1,
                                  )
                                }
                              />

                              {fieldState.invalid && (
                                <FieldError
                                  className="text-red-600"
                                  errors={[
                                    fieldState.error,
                                  ]}
                                />
                              )}
                            </Field>
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {form.formState.errors.tools && (
                <p className="text-sm font-medium text-red-600">
                  {form.formState.errors.tools.message}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200" />

            {/* Global Fields Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Team Information
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  General details about your team
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Engineering Team Size */}
                <Controller
                  control={form.control}
                  name="totalEngineeringTeamSize"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel className="text-slate-700">
                        Total Engineering Team Size
                      </FieldLabel>

                      <Input
                        ref={field.ref}
                        name={field.name}
                        onBlur={field.onBlur}
                        type="number"
                        placeholder="10"
                        value={(field.value as number) ?? 1}
                        className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value, 10)
                              : 1,
                          )
                        }
                      />

                      <FieldDescription className="text-slate-500">
                        Number of engineers on your team
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError
                          className="text-red-600"
                          errors={[fieldState.error]}
                        />
                      )}
                    </Field>
                  )}
                />

                {/* Primary Use Case */}
                <Controller
                  control={form.control}
                  name="primaryUseCase"
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel className="text-slate-700">
                        Primary Use Case
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}>
                        <SelectTrigger className="border-slate-200 bg-white text-slate-900">
                          <SelectValue placeholder="Select a use case" />
                        </SelectTrigger>

                        <SelectContent className="bg-white">
                          <SelectItem value="coding">
                            Coding
                          </SelectItem>
                          <SelectItem value="writing">
                            Writing
                          </SelectItem>
                          <SelectItem value="data">
                            Data
                          </SelectItem>
                          <SelectItem value="research">
                            Research
                          </SelectItem>
                          <SelectItem value="mixed">
                            Mixed
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldDescription className="text-slate-500">
                        How your team primarily uses AI
                        tools
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError
                          className="text-red-600"
                          errors={[fieldState.error]}
                        />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting
                  ? "Generating Audit..."
                  : "Generate Free Audit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
