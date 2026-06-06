"use client";

import React, { useEffect, useState } from "react";
import { Edit3, Loader2, Package, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getPackagesAction } from "@/app/actions/package";
import PackageForm from "./PackageForm";
import { toast } from "sonner";

export default function PackagesList() {
          const [packages, setPackages] = useState<any[]>([]);
          const [isLoading, setIsLoading] = useState(true);

          const [isModalOpen, setIsModalOpen] = useState(false);
          const [selectedPackage, setSelectedPackage] = useState<any | null>(null);

          const fetchPackages = async () => {
                    setIsLoading(true);
                    const res = await getPackagesAction();
                    if (!res.success) toast.error(res.error || "Failed to load packages");
                    else setPackages(res.data);
                    setIsLoading(false);
          };

          useEffect(() => { fetchPackages(); }, []);

          const handleEdit = (pkg: any) => { setSelectedPackage(pkg); setIsModalOpen(true); };

          return (
                    <div className="w-full max-w-7xl mx-auto space-y-6">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                                  <h2 className="text-3xl font-semibold text-foreground tracking-tight">Credit Packages</h2>
                                                  <p className="text-sm text-muted-foreground mt-1">Manage billing plans and credit allocations for end-users.</p>
                                        </div>
                              </div>

                              <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
                                        {isLoading ? (
                                                  <div className="flex justify-center items-center py-20 text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin" /></div>
                                        ) : packages.length === 0 ? (
                                                  <div className="flex flex-col items-center py-20 text-muted-foreground text-center">
                                                            <Package className="w-12 h-12 mb-4 opacity-20" />
                                                            <p>No credit packages found in the database.</p>
                                                  </div>
                                        ) : (
                                                  <>
                                                            {/* 📱 MOBILE VIEW */}
                                                            <div className="grid grid-cols-1 gap-4 p-4 lg:hidden">
                                                                      {packages.map((pkg) => (
                                                                                <div key={pkg.id} className="p-5 border border-border/50 rounded-xl bg-card flex flex-col gap-3 relative shadow-sm">
                                                                                          <div className="flex justify-between items-start pr-8">
                                                                                                    <div>
                                                                                                              <h4 className="font-semibold text-foreground">{pkg.name}</h4>
                                                                                                              <p className="text-xs font-mono text-muted-foreground mt-0.5">{pkg.planId}</p>
                                                                                                              <p className="text-xl font-bold text-foreground mt-2">${pkg.priceUSD}</p>
                                                                                                    </div>
                                                                                                    <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md border border-border/50">
                                                                                                              <Zap className="w-3 h-3 text-amber-500" />
                                                                                                              <span className="font-mono text-sm font-bold">{pkg.credits}</span>
                                                                                                    </div>
                                                                                          </div>
                                                                                          <div className="absolute top-6 right-4 flex flex-col gap-2">
                                                                                                    <button onClick={() => handleEdit(pkg)} className="text-primary hover:opacity-70 p-1 cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                                                                                          </div>
                                                                                </div>
                                                                      ))}
                                                            </div>

                                                            {/* 💻 DESKTOP TABLE VIEW */}
                                                            <div className="hidden lg:block w-full overflow-x-auto">
                                                                      <table className="w-full text-sm text-left">
                                                                                <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
                                                                                          <tr>
                                                                                                    <th className="px-6 py-4 font-medium tracking-wider">Plan ID & Name</th>
                                                                                                    <th className="px-6 py-4 font-medium tracking-wider">Price (USD)</th>
                                                                                                    <th className="px-6 py-4 font-medium tracking-wider">Allocated Credits</th>
                                                                                                    <th className="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
                                                                                          </tr>
                                                                                </thead>
                                                                                <tbody className="divide-y divide-border/50">
                                                                                          {packages.map((pkg) => (
                                                                                                    <tr key={pkg.id} className="hover:bg-muted/5 transition-colors bg-background">
                                                                                                              <td className="px-6 py-4 whitespace-nowrap">
                                                                                                                        <p className="font-semibold text-foreground">{pkg.name}</p>
                                                                                                                        <p className="text-xs font-mono text-muted-foreground mt-0.5">{pkg.planId}</p>
                                                                                                              </td>
                                                                                                              <td className="px-6 py-4 font-bold text-foreground">${pkg.priceUSD}</td>
                                                                                                              <td className="px-6 py-4 font-mono font-medium flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> {pkg.credits} credits</td>
                                                                                                              <td className="px-6 py-4 text-right">
                                                                                                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(pkg)} className="rounded-full hover:bg-primary/10 hover:text-primary cursor-pointer"><Edit3 className="w-4 h-4 mr-2" /> Edit</Button>
                                                                                                              </td>
                                                                                                    </tr>
                                                                                          ))}
                                                                                </tbody>
                                                                      </table>
                                                            </div>
                                                  </>
                                        )}
                              </div>

                              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                        <DialogContent className="max-w-[95vw] sm:max-w-[500px] p-0 overflow-hidden rounded-2xl bg-background border-border/50 ">
                                                  <DialogTitle className="sr-only">Package Form</DialogTitle>
                                                  <DialogDescription className="sr-only">Configure credit packages.</DialogDescription>
                                                  {isModalOpen && selectedPackage && <PackageForm initialData={selectedPackage} onSuccess={() => { setIsModalOpen(false); fetchPackages(); }} onCancel={() => setIsModalOpen(false)} />}
                                        </DialogContent>
                              </Dialog>
                    </div>
          );
}