"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, X, DollarSign, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePackageAction } from "@/app/actions/package";
import { packageSchema } from "@/lib/validations/package";
import { toast } from "sonner";

interface PackageFormProps {
          initialData: any; // Explicitly required for Update-Only mode
          onSuccess: () => void;
          onCancel: () => void;
}

export default function PackageForm({ initialData, onSuccess, onCancel }: PackageFormProps) {
          const [isLoading, setIsLoading] = useState(false);
          const [formErrors, setFormErrors] = useState<Record<string, string>>({});

          // Locked Fields
          const [planId] = useState(initialData.planId || "");
          const [name] = useState(initialData.name || "");

          // Editable Fields
          const [priceUSD, setPriceUSD] = useState<string>(initialData.priceUSD?.toString() || "");
          const [credits, setCredits] = useState<string>(initialData.credits?.toString() || "");

          const isFormValid = Boolean(priceUSD.trim() && credits.trim());

          const handleSubmit = async () => {
                    setFormErrors({});
                    setIsLoading(true);

                    const payload = { priceUSD: parseFloat(priceUSD) || 0, credits: parseInt(credits) || 0 };
                    const validatedData = packageSchema.safeParse(payload);

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

                    const toastId = toast.loading("Updating package...");

                    try {
                              const result = await updatePackageAction(initialData.id, validatedData.data);

                              if (!result.success) {
                                        toast.error(result.error || "Operation failed.", { id: toastId });
                              } else {
                                        toast.success("Package updated successfully!", { id: toastId });
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
                                                  <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">Update Package</h2>
                                                  <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">Modify pricing and credit limits for {name}.</p>
                                        </div>
                              </div>

                              <div className="p-5 sm:p-8 border border-border/50 shadow-sm rounded-2xl bg-card space-y-6">

                                        {/* Locked Fields */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                                  <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground ml-1">Plan ID (Locked)</label>
                                                            <Input value={planId} disabled className="rounded-xl px-4 py-6 bg-muted/50 cursor-not-allowed opacity-70" />
                                                  </div>
                                                  <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground ml-1">Package Name (Locked)</label>
                                                            <Input value={name} disabled className="rounded-xl px-4 py-6 bg-muted/50 cursor-not-allowed opacity-70" />
                                                  </div>
                                        </div>

                                        {/* Editable Fields */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-border/50">
                                                  <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] sm:text-xs font-semibold uppercase text-primary ml-1">Price (USD) <span className="text-destructive">*</span></label>
                                                            <div className="relative">
                                                                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                                                      <Input type="number" step="0.01" value={priceUSD} onChange={(e) => setPriceUSD(e.target.value)} className={`rounded-xl pl-11 py-6 bg-muted/30 border-primary/30 focus-visible:ring-primary ${formErrors.priceUSD ? 'border-destructive' : ''}`} placeholder="70" />
                                                            </div>
                                                            {formErrors.priceUSD && <p className="text-xs text-destructive ml-1">{formErrors.priceUSD}</p>}
                                                  </div>

                                                  <div className="flex flex-col gap-3">
                                                            <label className="text-[10px] sm:text-xs font-semibold uppercase text-primary ml-1">Credits Assigned <span className="text-destructive">*</span></label>
                                                            <div className="relative">
                                                                      <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                                                      <Input type="number" value={credits} onChange={(e) => setCredits(e.target.value)} className={`rounded-xl pl-11 py-6 bg-muted/30 border-primary/30 focus-visible:ring-primary ${formErrors.credits ? 'border-destructive' : ''}`} placeholder="5000" />
                                                            </div>
                                                            {formErrors.credits && <p className="text-xs text-destructive ml-1">{formErrors.credits}</p>}
                                                  </div>
                                        </div>
                              </div>

                              <div className="flex justify-end gap-3 sm:gap-4 mt-8 pt-4 border-t border-border/50">
                                        <Button size="lg"
                                        onClick={handleSubmit} disabled={isLoading || !isFormValid} className="rounded-full px-10 shadow-lg shadow-primary/20 cursor-pointer">
                                                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                                  Save Changes
                                        </Button>
                              </div>
                    </div>
          );
}