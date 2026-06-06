"use client";

import { createNicheAction, updateNicheAction } from "@/app/actions/niche";
import { CustomAudioPlayer, MobileFramePreview } from "@/components/dashboard/ui/MediaPreviews"; // ⚡ IMPORT MEDIA PREVIEWS
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { nicheSchema } from "@/lib/validations/niche";
import { CheckCircle2, Loader2, MinusCircle, Plus, PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface NicheFormProps {
          initialData?: any;
          onSuccess: () => void;
          onCancel: () => void;
}

export default function NicheForm({ initialData, onSuccess, onCancel }: NicheFormProps) {
          
          const isEditMode = !!initialData;
          const [showOptional, setShowOptional] = useState(isEditMode);
          const [isLoading, setIsLoading] = useState(false);
          const [volume, setVolume] = useState(initialData?.bgmVolume ?? 0.2);
          const [formErrors, setFormErrors] = useState<Record<string, string>>({});

          const [key, setKey] = useState(initialData?.key || "");
          const [name, setName] = useState(initialData?.name || "");
          const [systemPrompt, setSystemPrompt] = useState(initialData?.systemPrompt || "");
          const [hooksInstruction, setHooksInstruction] = useState(initialData?.hooksInstruction || "");
          const [expansionInstruction, setExpansionInstruction] = useState(initialData?.expansionInstruction || "");
          const [imageInstruction, setImageInstruction] = useState(initialData?.imageInstruction || "");
          const [audioInstruction, setAudioInstruction] = useState(initialData?.audioInstruction || "");
          const [videoInstruction, setVideoInstruction] = useState(initialData?.videoInstruction || "");
          const [fallbackUrl, setFallbackUrl] = useState(initialData?.fallbackUrl || "");

          const [bgmInput, setBgmInput] = useState("");
          const [bgmUrls, setBgmUrls] = useState<string[]>(initialData?.bgmUrls || []);

          const addBgmUrl = () => {
                    if (bgmInput.trim() && bgmInput.startsWith("http")) {
                              setBgmUrls([...bgmUrls, bgmInput.trim()]);
                              setBgmInput("");
                    }
          };

          const removeBgmUrl = (indexToRemove: number) => {
                    setBgmUrls(bgmUrls.filter((_, index) => index !== indexToRemove));
          };

          const isFormValid = Boolean(key.trim() && name.trim() && systemPrompt.trim() && hooksInstruction.trim() && expansionInstruction.trim());

          const handleSubmit = async () => { /* ... existing submit logic ... */
                    setFormErrors({});
                    setIsLoading(true);
                    const payload = { key, name, systemPrompt, hooksInstruction, expansionInstruction, imageInstruction: imageInstruction || undefined, audioInstruction: audioInstruction || undefined, videoInstruction: videoInstruction || undefined, bgmUrls, bgmVolume: volume, fallbackUrl: fallbackUrl || undefined };
                    const validatedData = nicheSchema.safeParse(payload);

                    if (!validatedData.success) {
                              const errors: Record<string, string> = {};
                              validatedData.error.issues.forEach(issue => { if (issue.path.length > 0) errors[String(issue.path[0])] = issue.message; });
                              setFormErrors(errors);
                              toast.error("Please fix the validation errors in the form.");
                              setIsLoading(false);
                              return;
                    }

                    const toastId = toast.loading(isEditMode ? "Updating record..." : "Creating new niche...");
                    try {
                              let result;
                              if (isEditMode) result = await updateNicheAction(initialData.id, validatedData.data);
                              else result = await createNicheAction(validatedData.data);

                              if (!result.success) toast.error(result.error || "Operation failed.", { id: toastId });
                              else { toast.success(`Niche ${isEditMode ? 'updated' : 'created'} successfully!`, { id: toastId }); onSuccess(); }
                    } catch (error) { toast.error("System error occurred.", { id: toastId }); }
                    finally { setIsLoading(false); }
          };

          return (
                    <div className="w-full max-w-full mx-auto space-y-6 sm:space-y-8 p-4 sm:p-6 relative overflow-x-hidden">
                              <div className="flex justify-between items-start border-b border-border/50 pb-4 sm:pb-6">
                                        <div>
                                                  <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                                                            {isEditMode ? "Update Configuration" : "Add New Niche"}
                                                  </h2>
                                                  <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
                                                            {isEditMode ? `Modifying parameters for ${initialData.name}` : "Define core parameters and AI behaviors."}
                                                  </p>
                                        </div>
                              </div>

                              <div className="space-y-6 sm:space-y-8">
                                        {/* Basic Information */}
                                        <div className="p-5 sm:p-8 border border-border/50 shadow-sm rounded-2xl bg-card">
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                                            {/* ⚡ FIX: Changed to flex flex-col gap-3 for perfect spacing */}
                                                            <div className="flex flex-col gap-3">
                                                                      <label className="text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground ml-1">Unique Key (ID) <span className="text-destructive">*</span></label>
                                                                      <Input value={key} onChange={(e) => setKey(e.target.value)} disabled={isEditMode} className={`rounded-xl px-4 py-6 bg-muted/30 ${formErrors.key ? 'border-destructive' : ''}`} />
                                                                      {formErrors.key && <p className="text-xs text-destructive ml-1">{formErrors.key}</p>}
                                                            </div>
                                                            {/* ⚡ FIX: Changed to flex flex-col gap-3 */}
                                                            <div className="flex flex-col gap-3">
                                                                      <label className="text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground ml-1">Display Name <span className="text-destructive">*</span></label>
                                                                      <Input value={name} onChange={(e) => setName(e.target.value)} className={`rounded-xl px-4 py-6 bg-muted/30 ${formErrors.name ? 'border-destructive' : ''}`} />
                                                                      {formErrors.name && <p className="text-xs text-destructive ml-1">{formErrors.name}</p>}
                                                            </div>
                                                  </div>
                                        </div>

                                        {/* AI Instructions */}
                                        <div className="p-5 sm:p-8 border border-border/50 shadow-sm rounded-2xl bg-card">
                                                  <div className="space-y-6">
                                                            {/* ⚡ FIX: Changed to flex flex-col gap-3 */}
                                                            <div className="flex flex-col gap-3">
                                                                      <label className="text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground ml-1">System Prompt <span className="text-destructive">*</span></label>
                                                                      <Textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} className={`rounded-xl px-4 py-4 bg-muted/30 min-h-[120px] ${formErrors.systemPrompt ? 'border-destructive' : ''}`} />
                                                                      {formErrors.systemPrompt && <p className="text-xs text-destructive ml-1">{formErrors.systemPrompt}</p>}
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                                                      {/* ⚡ FIX: Changed to flex flex-col gap-3 */}
                                                                      <div className="flex flex-col gap-3">
                                                                                <label className="text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground ml-1">Hooks Instruction <span className="text-destructive">*</span></label>
                                                                                <Textarea value={hooksInstruction} onChange={(e) => setHooksInstruction(e.target.value)} className={`rounded-xl px-4 py-4 bg-muted/30 ${formErrors.hooksInstruction ? 'border-destructive' : ''}`} />
                                                                                {formErrors.hooksInstruction && <p className="text-xs text-destructive ml-1">{formErrors.hooksInstruction}</p>}
                                                                      </div>
                                                                      {/* ⚡ FIX: Changed to flex flex-col gap-3 */}
                                                                      <div className="flex flex-col gap-3">
                                                                                <label className="text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground ml-1">Expansion Instruction <span className="text-destructive">*</span></label>
                                                                                <Textarea value={expansionInstruction} onChange={(e) => setExpansionInstruction(e.target.value)} className={`rounded-xl px-4 py-4 bg-muted/30 ${formErrors.expansionInstruction ? 'border-destructive' : ''}`} />
                                                                                {formErrors.expansionInstruction && <p className="text-xs text-destructive ml-1">{formErrors.expansionInstruction}</p>}
                                                                      </div>
                                                            </div>

                                                            <div className="pt-6 border-t border-border/40 mt-6">
                                                                      <button type="button" onClick={() => setShowOptional(!showOptional)} className="flex items-center gap-2 text-primary text-[10px] lg:text-sm font-medium mb-6 cursor-pointer hover:opacity-80">
                                                                                {showOptional ? <MinusCircle className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />} Media Instructions (Optional)
                                                                      </button>
                                                                      {showOptional && (
                                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 animate-in fade-in">
                                                                                          <Textarea placeholder="Image Logic" value={imageInstruction} onChange={(e) => setImageInstruction(e.target.value)} className="rounded-xl bg-muted/30" rows={3} />
                                                                                          <Textarea placeholder="Audio Tone" value={audioInstruction} onChange={(e) => setAudioInstruction(e.target.value)} className="rounded-xl bg-muted/30" rows={3} />
                                                                                          <Textarea placeholder="Video Style" value={videoInstruction} onChange={(e) => setVideoInstruction(e.target.value)} className="rounded-xl bg-muted/30" rows={3} />
                                                                                </div>
                                                                      )}
                                                            </div>
                                                  </div>
                                        </div>
                                        <div className="p-5 sm:p-8 border border-border/50 shadow-sm rounded-2xl bg-card">
                                                  <h3 className="text-lg font-medium mb-6">Media Configuration</h3>

                                                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                                                            {/* Audio Configuration (Left Side) */}
                                                            <div className="lg:col-span-8 space-y-6">
                                                                      <div className="flex gap-2">
                                                                                <Input value={bgmInput} onChange={(e) => setBgmInput(e.target.value)} className="rounded-xl py-6 bg-muted/30 flex-grow" placeholder="Add audio URL (https://...)" />
                                                                                <Button type="button" onClick={addBgmUrl} variant="outline" className="h-[52px] w-12 rounded-xl cursor-pointer"><Plus className="w-5 h-5" /></Button>
                                                                      </div>

                                                                      {/* ⚡ Custom Audio Player List */}
                                                                      <div className="space-y-3 mt-4">
                                                                                {bgmUrls.length > 0 ? (
                                                                                          bgmUrls.map((url, i) => (
                                                                                                    <CustomAudioPlayer key={i} url={url} onRemove={() => removeBgmUrl(i)} />
                                                                                          ))
                                                                                ) : (
                                                                                          <p className="text-xs text-muted-foreground italic py-2">No background tracks added yet.</p>
                                                                                )}
                                                                      </div>

                                                                      <div className="flex flex-col gap-3 pt-6 border-t border-border/50">
                                                                                <label className="text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground">Master BGM Volume ({volume.toFixed(2)})</label>
                                                                                <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full sm:w-2/3 cursor-pointer" />
                                                                      </div>
                                                            </div>

                                                            {/* Fallback Image Preview (Right Side) */}
                                                            <div className="lg:col-span-4 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-border/50 pt-6 lg:pt-0 lg:pl-8">
                                                                      <div className="flex flex-col gap-3">
                                                                                <label className="text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground">Fallback Image URL</label>
                                                                                <Input value={fallbackUrl} onChange={(e) => setFallbackUrl(e.target.value)} className={`rounded-xl bg-muted/30 ${formErrors.fallbackUrl ? 'border-destructive' : ''}`} placeholder="https://..." />
                                                                                {formErrors.fallbackUrl && <p className="text-xs text-destructive ml-1">{formErrors.fallbackUrl}</p>}
                                                                      </div>

                                                                      {/* ⚡ Runtime Mobile Frame Preview */}
                                                                      <div className="flex flex-col items-center sm:items-start lg:items-center mt-2">
                                                                                <MobileFramePreview url={fallbackUrl} alt="Live Preview" />
                                                                                <p className="text-[10px] text-muted-foreground text-center mt-3">Live Runtime Preview</p>
                                                                      </div>
                                                            </div>

                                                  </div>
                                        </div>

                                        {/* Sticky Action Bar */}
                                        <div className="sticky bottom-0 mt-8 flex flex-col lg:flex-row justify-end gap-3 sm:gap-4 bg-background/95 backdrop-blur-xl border border-border p-4 z-10 rounded-xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] lg:mx-5 -mx-3">
                                                  <Button size="lg" onClick={handleSubmit} disabled={isLoading || !isFormValid} className="rounded-full px-8 sm:px-10 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all">
                                                            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                                            {isEditMode ? "Save Changes" : "Create Niche"}
                                                  </Button>
                                        </div>
                              </div>
                              </div>
                              );
}