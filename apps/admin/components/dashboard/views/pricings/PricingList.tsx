"use client";

import React, { useEffect, useState } from "react";
import { Edit3, Loader2, Coins, Search, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getPricingRatesAction } from "@/app/actions/pricing";
import PricingForm from "./PricingForm";
import { toast } from "sonner";

export default function PricingList() {
          const [rates, setRates] = useState<any[]>([]);
          const [isLoading, setIsLoading] = useState(true);
          const [searchQuery, setSearchQuery] = useState("");

          const [isModalOpen, setIsModalOpen] = useState(false);
          const [selectedRate, setSelectedRate] = useState<any | null>(null);

          const fetchRates = async () => {
                    setIsLoading(true);
                    const res = await getPricingRatesAction();

                    if (!res.success) {
                              toast.error(res.error || "Failed to load pricing rates");
                    } else {
                              setRates(res.data);
                    }

                    setIsLoading(false);
          };

          useEffect(() => { fetchRates(); }, []);

          const handleEdit = (rate: any) => { setSelectedRate(rate); setIsModalOpen(true); };

          // ⚡ FILTER LOGIC
          const filteredRates = rates.filter(rate =>
                    rate.provider.toLowerCase().includes(searchQuery.toLowerCase())
          );

          // ⚡ GROUPING LOGIC (Bulletproof TypeScript Definition)
          const groupedRates: Record<string, any[]> = filteredRates.reduce((acc: Record<string, any[]>, rate: any) => {
                    if (!acc[rate.stage]) acc[rate.stage] = [];
                    acc[rate.stage].push(rate);
                    return acc;
          }, {});

          return (
                    <div className="w-full max-w-7xl mx-auto space-y-6">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                                  <h2 className="text-3xl font-semibold text-foreground tracking-tight">AI Provider Pricing</h2>
                                                  <p className="text-sm text-muted-foreground mt-1">Manage global credit deduction costs for AI generation stages.</p>
                                                  <p className="text-[11px] text-muted-foreground mt-1">
                                                            As an administrator, you are restricted from creating or deleting price
                                                            rates. Only rate updates are permitted within the system.
                                                  </p>
                                        </div>
                              </div>

                              <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">

                                        {/* ⚡ SEARCH BAR */}
                                        <div className="p-4 border-b border-border/50 flex items-center gap-3 bg-muted/10">
                                                  <Search className="w-4 h-4 text-muted-foreground" />
                                                  <Input
                                                            placeholder="Search provider by key..."
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            className="border-none bg-transparent shadow-none focus-visible:ring-0 h-8 px-2 text-sm placeholder:text-xs placeholder:pl-1"
                                                  />
                                        </div>


                                        {isLoading ? (
                                                  <div className="flex justify-center items-center py-20 text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin" /></div>
                                        ) : filteredRates.length === 0 ? (
                                                  <div className="flex flex-col items-center py-20 text-muted-foreground text-center">
                                                            <Coins className="w-12 h-12 mb-4 opacity-20" />
                                                            <p>{searchQuery ? "No matching providers found." : "No pricing rates found in the database."}</p>
                                                  </div>
                                        ) : (
                                                  <>
                                                            {/* 📱 MOBILE VIEW: Grouped Cards */}
                                                            <div className="flex flex-col lg:hidden">
                                                                      {Object.entries(groupedRates).map(([stage, stageRates]) => (
                                                                                <div key={stage} className="border-b border-border/50 last:border-0">
                                                                                          <div className="bg-muted/20 px-4 py-2 flex items-center gap-2 border-b border-border/50">
                                                                                                    <Layers className="w-4 h-4 text-primary" />
                                                                                                    <span className="text-xs font-bold text-primary tracking-wider uppercase">{stage} PIPELINE</span>
                                                                                          </div>

                                                                                          <div className="p-4 grid grid-cols-1 gap-4 bg-background">
                                                                                                    {/* ⚡ FIX: Added (rate: any) to stop TS complaints */}
                                                                                                    {stageRates.map((rate: any) => (
                                                                                                              <div key={rate.id} className="p-3 border border-border/50 rounded-xl bg-card flex flex-col  gap-3 relative shadow-sm">
                                                                                                                        <div className="flex flex-col space-y-2 ">
                                                                                                                                  <div>
                                                                                                                                            <h4 className="font-semibold text-foreground">{rate.provider}</h4>
                                                                                                                                  </div>
                                                                                                                                  <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md border border-border/50">
                                                                                                                                            <Coins className="w-3 h-3 text-[#FFD700]" />
                                                                                                                                            <span className="font-mono text-sm font-bold">{rate.rate}</span>
                                                                                                                                  </div>
                                                                                                                        </div>
                                                                                                                        <div className="absolute top-3 right-4 flex flex-col gap-2">
                                                                                                                                  <button onClick={() => handleEdit(rate)} className="text-primary hover:opacity-70 p-1 cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                                                                                                                        </div>
                                                                                                              </div>
                                                                                                    ))}
                                                                                          </div>
                                                                                </div>
                                                                      ))}
                                                            </div>

                                                            {/* 💻 DESKTOP TABLE VIEW: Grouped Rows */}
                                                            <div className="hidden lg:block w-full overflow-x-auto">
                                                                      <table className="w-full text-sm text-left">
                                                                                <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
                                                                                          <tr>
                                                                                                    <th className="px-6 py-4 font-medium tracking-wider">Provider Key</th>
                                                                                                    <th className="px-6 py-4 font-medium tracking-wider">Credit Cost</th>
                                                                                                    <th className="px-6 py-4 font-medium tracking-wider text-right">Action</th>
                                                                                          </tr>
                                                                                </thead>
                                                                                <tbody className="divide-y divide-border/50">
                                                                                          {Object.entries(groupedRates).map(([stage, stageRates]) => (
                                                                                                    <React.Fragment key={stage}>
                                                                                                              <tr className="bg-muted/10">
                                                                                                                        <td colSpan={3} className="px-6 py-3 border-y border-border/40 bg-muted/5">
                                                                                                                                  <div className="flex items-center gap-2">
                                                                                                                                            <Layers className="w-4 h-4 text-primary" />
                                                                                                                                            <span className="text-xs font-bold text-primary tracking-wider uppercase">{stage} PIPELINE</span>
                                                                                                                                  </div>
                                                                                                                        </td>
                                                                                                              </tr>

                                                                                                              {/* ⚡ FIX: Added (rate: any) to stop TS complaints */}
                                                                                                              {stageRates.map((rate: any) => (
                                                                                                                        <tr key={rate.id} className="hover:bg-muted/5 transition-colors bg-background">
                                                                                                                                  <td className="px-6 py-4 font-semibold text-foreground pl-10 border-l-[3px] border-transparent">{rate.provider}</td>
                                                                                                                                  <td className="px-6 py-4 font-mono font-medium flex items-center gap-2"><Coins className="w-4 h-4 text-muted-foreground" /> {rate.rate} cr/unit</td>
                                                                                                                                  <td className="px-6 py-4 text-right">
                                                                                                                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(rate)} className="rounded-full hover:bg-primary/10 hover:text-primary cursor-pointer"><Edit3 className="w-4 h-4 mr-2" /> Edit</Button>
                                                                                                                                  </td>
                                                                                                                        </tr>
                                                                                                              ))}
                                                                                                    </React.Fragment>
                                                                                          ))}
                                                                                </tbody>
                                                                      </table>
                                                            </div>
                                                  </>
                                        )}
                              </div>

                              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                        <DialogContent className="max-w-[95vw] sm:max-w-[500px] p-0 overflow-hidden rounded-2xl bg-background border-border/50">
                                                  <DialogTitle className="sr-only">Pricing Form</DialogTitle>
                                                  <DialogDescription className="sr-only">Configure AI provider rates.</DialogDescription>
                                                  {isModalOpen && selectedRate && <PricingForm initialData={selectedRate} onSuccess={() => { setIsModalOpen(false); fetchRates(); }} onCancel={() => setIsModalOpen(false)} />}
                                        </DialogContent>
                              </Dialog>
                    </div>
          );
}