"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
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
import { Checkbox } from "@/components/ui/checkbox";
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
import { auditItemsAtom } from "@/lib/atoms";
import { TOOLS_CONFIG } from "@/lib/config";
import {
  ApiProviderKey,
  AuditInput,
  SaasKey,
} from "@/lib/types";
import { cn } from "@/lib/utils";

// --- SCHEMA DEFINITIONS ---
const saasSchema = z.object({
  type: z.literal("saas"),
  toolId: z.string().min(1, "Select a tool"),
  plan: z.string().min(1, "Select a plan"),
  seats: z.coerce.number().int().min(1),
  spend: z.coerce.number().min(0),
});

const apiSchema = z.object({
  type: z.literal("api"),
  toolId: z.string().min(1, "Select a tool"),
  providerKey: z.string(), // Mapped from config
  modelId: z.string().min(1, "Select a model"),
  inputTokens: z.coerce.number().min(0),
  outputTokens: z.coerce.number().min(0),
  spend: z.coerce.number().min(0),
  isLatencyCritical: z.boolean().default(false),
});

const spendInputFormSchema = z.object({
  tools: z
    .array(
      z.discriminatedUnion("type", [saasSchema, apiSchema]),
    )
    .min(1),
  useCase: z.enum(
    ["coding", "writing", "data", "research", "mixed"],
    {
      message: "Please select a valid use case",
    },
  ),
});

type SpendInputFormInput = z.input<
  typeof spendInputFormSchema
>;
type SpendInputFormOutput = z.infer<
  typeof spendInputFormSchema
>;

export function SpendInputForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setAuditItems] = useAtom(auditItemsAtom);

  const form = useForm<
    SpendInputFormInput,
    unknown,
    SpendInputFormOutput
  >({
    resolver: zodResolver(spendInputFormSchema),
    defaultValues: {
      tools: [
        {
          type: "saas",
          toolId: "",
          plan: "",
          seats: 1,
          spend: 0,
        },
        {
          type: "api",
          toolId: "",
          providerKey: "",
          modelId: "",
          inputTokens: 0,
          outputTokens: 0,
          spend: 0,
          isLatencyCritical: false,
        },
      ],
      useCase: "coding",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tools",
  });

  // Replaces the expensive form.watch inside the render loop
  const watchedTools = useWatch({
    control: form.control,
    name: "tools",
  });

  const onSubmit = async (values: SpendInputFormOutput) => {
    setIsSubmitting(true);
    try {
      // THE MAPPER: Translate the loose Form Output into Strict Domain Types
      const strictAuditItems: AuditInput[] =
        values.tools.map((item) => {
          if (item.type === "saas") {
            return {
              type: "saas",
              toolId: item.toolId as SaasKey,
              plan: item.plan,
              seats: item.seats,
              spend: item.spend,
            };
          } else {
            return {
              type: "api",
              toolId: item.toolId as ApiProviderKey,
              providerKey:
                item.providerKey as ApiProviderKey,
              modelId: item.modelId,
              inputTokens: item.inputTokens,
              outputTokens: item.outputTokens,
              spend: item.spend,
              isLatencyCritical: item.isLatencyCritical,
              // Inject the global useCase into the specific API item
              useCase: values.useCase,
            };
          }
        });

      // Strict save to Jotai
      setAuditItems(strictAuditItems);

      console.log(
        "Strict payload saved to Jotai:",
        strictAuditItems,
      );
      alert("Audit saved to local storage!");
    } catch (error) {
      console.error("Error saving form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto ">
      <Card className="bg-white border-slate-200 rounded-xl ">
        <CardHeader className="font-sans">
          <CardTitle className="text-2xl font-semibold font-sans capitalize!">
            AI Tools Spending Calculator
          </CardTitle>
          <CardDescription>
            Analyze your engineering team&apos;s expenses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  AI Stack
                </h3>
                <Button
                  type="button"
                  onClick={() =>
                    append({
                      type: "saas",
                      toolId: "",
                      plan: "",
                      seats: 1,
                      spend: 0,
                    })
                  }
                  variant={"outline"}
                  size="sm"
                  className="rounded-md ">
                  <Plus className="w-4 h-4 mr-2" /> Add Tool
                </Button>
              </div>

              {fields.map((field, index) => {
                // Efficiently pull current tool state from useWatch
                const currentTool = watchedTools?.[index];
                const toolId =
                  currentTool?.toolId as string;
                const type = currentTool?.type as
                  | "saas"
                  | "api";
                const config = toolId
                  ? TOOLS_CONFIG[toolId]
                  : null;

                return (
                  <div
                    key={field.id}
                    className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-4 relative">
                    <div className="flex justify-between">
                      <h4 className="font-medium ">
                        Tool {index + 1}
                      </h4>
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        variant="ghost"
                        size={"icon-lg"}
                        className={cn(
                          "text-slate-400  rounded-md hover:text-slate-600 transition-colors",
                          watchedTools.length === 1 &&
                            "hidden", // Hide delete button on the first item to ensure at least one tool remains
                        )}>
                        <Trash2 className="w-6 h-6" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      {/* Tool Dropdown */}
                      <Controller
                        control={form.control}
                        name={`tools.${index}.toolId`}
                        render={({
                          field: f,
                          fieldState: s,
                        }) => (
                          <Field data-invalid={s.invalid}>
                            <FieldLabel>
                              Tool / Provider
                            </FieldLabel>
                            <Select
                              value={f.value}
                              onValueChange={(val) => {
                                f.onChange(val);
                                const c = TOOLS_CONFIG[val];
                                if (c?.supportsSaaS) {
                                  form.setValue(
                                    `tools.${index}.type`,
                                    "saas",
                                  );
                                } else if (c?.supportsAPI) {
                                  form.setValue(
                                    `tools.${index}.type`,
                                    "api",
                                  );
                                  form.setValue(
                                    `tools.${index}.providerKey`,
                                    c.apiProviderKey!,
                                  );
                                }
                              }}>
                              <SelectTrigger className=" bg-white ">
                                <SelectValue placeholder="Choose an AI tool" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                {Object.entries(
                                  TOOLS_CONFIG,
                                ).map(([k, v]) => (
                                  <SelectItem
                                    key={k}
                                    value={k}>
                                    {v.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                        name="useCase"
                        render={({
                          field: f,
                          fieldState: s,
                        }) => (
                          <Field data-invalid={s.invalid}>
                            <FieldLabel>
                              Use Case
                            </FieldLabel>
                            <Select
                              value={f.value}
                              onValueChange={f.onChange}>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select use case" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                {[
                                  "coding",
                                  "writing",
                                  "data",
                                  "research",
                                  "mixed",
                                ].map((v) => (
                                  <SelectItem
                                    key={v}
                                    value={v}>
                                    {v
                                      .charAt(0)
                                      .toUpperCase() +
                                      v.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {s.invalid && (
                              <FieldError
                                className="text-red-600"
                                errors={[s.error]}
                              />
                            )}
                          </Field>
                        )}
                      />

                      {/* Mode Toggle */}
                      {config?.supportsSaaS &&
                        config?.supportsAPI && (
                          <Controller
                            control={form.control}
                            name={`tools.${index}.type`}
                            render={({ field: f }) => (
                              <Field className="col-span-2 ">
                                <FieldLabel>
                                  Billing Structure
                                </FieldLabel>
                                <div className="grid md:grid-cols-2  gap-2">
                                  <Button
                                    type="button"
                                    variant={
                                      f.value === "saas"
                                        ? "default"
                                        : "outline"
                                    }
                                    onClick={() =>
                                      f.onChange("saas")
                                    }
                                    className=" rounded-md">
                                    SaaS
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={
                                      f.value === "api"
                                        ? "default"
                                        : "outline"
                                    }
                                    onClick={() => {
                                      f.onChange("api");
                                      form.setValue(
                                        `tools.${index}.providerKey`,
                                        config.apiProviderKey!,
                                      );
                                    }}
                                    className=" rounded-md">
                                    API
                                  </Button>
                                </div>
                              </Field>
                            )}
                          />
                        )}
                    </div>

                    {/* SaaS Inputs */}
                    {type === "saas" &&
                      config?.supportsSaaS && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in">
                          <Controller
                            control={form.control}
                            name={`tools.${index}.plan`}
                            render={({
                              field: f,
                              fieldState: s,
                            }) => (
                              <Field
                                data-invalid={s.invalid}>
                                <FieldLabel>
                                  Plan Tier
                                </FieldLabel>
                                <Select
                                  value={f.value}
                                  onValueChange={
                                    f.onChange
                                  }>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Plan" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    {config.plans.map(
                                      (p) => (
                                        <SelectItem
                                          key={p}
                                          value={p}>
                                          {p}
                                        </SelectItem>
                                      ),
                                    )}
                                  </SelectContent>
                                </Select>
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
                            name={`tools.${index}.seats`}
                            render={({
                              field: f,
                              fieldState: s,
                            }) => (
                              <Field
                                data-invalid={s.invalid}>
                                <FieldLabel>
                                  Seats
                                </FieldLabel>
                                <Input
                                  type="number"
                                  {...f}
                                  step={1}
                                  min={1}
                                  value={
                                    (f.value as number) ??
                                    ""
                                  }
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
                            name={`tools.${index}.spend`}
                            render={({
                              field: f,
                              fieldState: s,
                            }) => (
                              <Field
                                data-invalid={s.invalid}>
                                <FieldLabel>
                                  Spend
                                </FieldLabel>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700">
                                    $
                                  </span>
                                  <Input
                                    type="number"
                                    step={"any"}
                                    {...f}
                                    min={0}
                                    value={
                                      (f.value as number) ??
                                      ""
                                    }
                                    className="pl-8 bg-white"
                                  />
                                </div>
                                {s.invalid && (
                                  <FieldError
                                    className="text-red-600"
                                    errors={[s.error]}
                                  />
                                )}
                              </Field>
                            )}
                          />
                        </div>
                      )}

                    {/* API Inputs */}
                    {type === "api" &&
                      config?.supportsAPI && (
                        <div className="space-y-4 animate-in fade-in">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Controller
                              control={form.control}
                              name={`tools.${index}.modelId`}
                              render={({
                                field: f,
                                fieldState: s,
                              }) => (
                                <Field
                                  data-invalid={s.invalid}>
                                  <FieldLabel>
                                    Model
                                  </FieldLabel>
                                  <Select
                                    value={f.value}
                                    onValueChange={
                                      f.onChange
                                    }>
                                    <SelectTrigger className="bg-white">
                                      <SelectValue placeholder="Model" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                      {config.models?.map(
                                        (m) => (
                                          <SelectItem
                                            key={m.id}
                                            value={m.id}>
                                            {m.name}
                                          </SelectItem>
                                        ),
                                      )}
                                    </SelectContent>
                                  </Select>
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
                              name={`tools.${index}.inputTokens`}
                              render={({
                                field: f,
                                fieldState: s,
                              }) => (
                                <Field
                                  data-invalid={s.invalid}>
                                  <FieldLabel>
                                    Input (M)
                                  </FieldLabel>
                                  <Input
                                    type="number"
                                    min={0}
                                    step="any"
                                    {...f}
                                    value={
                                      (f.value as number) ??
                                      ""
                                    }
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
                              name={`tools.${index}.outputTokens`}
                              render={({
                                field: f,
                                fieldState: s,
                              }) => (
                                <Field
                                  data-invalid={s.invalid}>
                                  <FieldLabel>
                                    Output (M)
                                  </FieldLabel>
                                  <Input
                                    type="number"
                                    min={0}
                                    step={"any"}
                                    {...f}
                                    value={
                                      (f.value as number) ??
                                      ""
                                    }
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
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <Controller
                              control={form.control}
                              name={`tools.${index}.spend`}
                              render={({
                                field: f,
                                fieldState: s,
                              }) => (
                                <Field
                                  data-invalid={s.invalid}>
                                  <FieldLabel>
                                    Spend ($)
                                  </FieldLabel>
                                  <Input
                                    type="number"
                                    {...f}
                                    min={0}
                                    value={
                                      (f.value as
                                        | string
                                        | number) ?? ""
                                    }
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
                              name={`tools.${index}.isLatencyCritical`}
                              render={({ field: f }) => (
                                <Field className="flex gap-0 justify-between">
                                  <div className="flex gap-2 pt-1">
                                    <Checkbox
                                      checked={
                                        (f.value as boolean) ??
                                        false
                                      }
                                      onCheckedChange={
                                        f.onChange
                                      }
                                      className="h-5! w-5!  rounded-md border-slate-300 bg-white data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white"
                                    />
                                    <FieldLabel className="text-slate-700 font-semibold!">
                                      Latency Critical
                                      (Real-time)
                                    </FieldLabel>
                                  </div>
                                  <FieldDescription>
                                    Disable for background
                                    tasks to calculate batch
                                    processing discounts.
                                  </FieldDescription>
                                </Field>
                              )}
                            />
                          </div>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 rounded-md">
              {isSubmitting
                ? "Generating Audit..."
                : "Generate Free Audit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
