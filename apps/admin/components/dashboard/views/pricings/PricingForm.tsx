"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, X, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePricingAction } from "@/app/actions/pricing";
import { pricingSchema } from "@/lib/validations/pricing";
import { toast } from "sonner";

interface PricingFormProps {
          initialData: any; // Now explicitly required since it's update-only
          onSuccess: () => void;
          onCancel: () => void;
}

export default function PricingForm({ initialData, onSuccess, onCancel }: PricingFormProps) {
          const [isLoading, setIsLoading] = useState(false);
          const [formErrors, setFormErrors] = useState<Record<string, string>>({});

          // States initialized from existing data
          const [provider] = useState(initialData.provider);
          const [stage] = useState(initialData.stage);
          const [rate, setRate] = useState<string>(initialData.rate?.toString() || "");

          const isFormValid = Boolean(rate.trim());

          const handleSubmit = async () => {
                    setFormErrors({});
                    setIsLoading(true);

                    const payload = { provider, stage, rate: parseFloat(rate) || 0 };
                    const validatedData = pricingSchema.safeParse(payload);

                    if (!validatedData.success) {
                              const errors: Record<string, string> = {};
                              validatedData.error.issues.forEach(issue => {
                                        if (issue.path.length > 0) errors[String(issue.path[0])] = issue.message;
                              });
                              setFormErrors(errors);
                              toast.error("Please fix the validation errors.");
                              setIsLoading(false);
                              return;
                    }

                    const toastId = toast.loading("Updating rate...");

                    try {
                              const result = await updatePricingAction(initialData.id, validatedData.data);

                              if (!result.success) {
                                        toast.error(result.error || "Operation failed.", { id: toastId });
                              } else {
                                        toast.success(`Rate updated successfully!`, { id: toastId });
                                        onSuccess();
                              }
                    } catch (error) {
                              toast.error("System error occurred.", { id: toastId });
                    } finally {
                              setIsLoading(false);
                    }
          };

          return (
                    <div className="w-full mx-auto space-y-6 sm:space-y-8 p-4 sm:p-6 relative">
                              <div className="flex justify-between items-start border-b border-border/50 pb-4 sm:pb-6">
                                        <div>
                                                  <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">Update Rate</h2>
                                                  <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">Modify the per-unit cost for {provider}.</p>
                                        </div>
                                        
                              </div>

                              <div className="p-5 sm:p-8 border border-border/50 shadow-sm rounded-2xl bg-card space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                                  <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground ml-1">Provider ID (Locked)</label>
                                                            <Input value={provider} disabled className="rounded-xl px-4 py-6 bg-muted/50 cursor-not-allowed opacity-70" />
                                                  </div>
                                                  <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground ml-1">Stage (Locked)</label>
                                                            <Input value={stage} disabled className="rounded-xl px-4 py-6 bg-muted/50 cursor-not-allowed opacity-70" />
                                                  </div>
                                        </div>

                                        <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                                                  <label className="text-[10px] sm:text-xs font-semibold uppercase text-primary ml-1">New Credit Cost Rate <span className="text-destructive">*</span></label>
                                                  <div className="relative">
                                                            <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                                                            <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className={`rounded-xl pl-12 py-6 text-lg font-mono bg-muted/30 border-primary/30 focus-visible:ring-primary ${formErrors.rate ? 'border-destructive' : ''}`} placeholder="0.5" />
                                                  </div>
                                                  {formErrors.rate && <p className="text-xs text-destructive ml-1">{formErrors.rate}</p>}
                                        </div>
                              </div>

                              <div className="flex justify-end gap-3 sm:gap-4 mt-8 pt-4 border-t border-border/50">
                                        <Button size="lg" onClick={handleSubmit} disabled={isLoading || !isFormValid} className="rounded-full px-10 shadow-lg shadow-primary/20">
                                                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                                  Save Changes
                                        </Button>
                              </div>
                    </div>
          );
}