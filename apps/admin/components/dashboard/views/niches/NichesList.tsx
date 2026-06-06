"use client";

/**
 * @file components/dashboard/views/niches/NichesList.tsx
 * @description Niches view. Reads from DashboardDataContext cache via useDashboardData.
 * After create/update, invalidate() purges the cache so data re-fetches fresh on next visit.
 */

import { useState } from "react";
import { Edit3, Plus, Search, Layers, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import NicheForm from "./NicheForm";
import NicheView from "./NicheView";
import SystemLoader from "@/components/dashboard/shared/SystemLoader";
import DataErrorState from "@/components/dashboard/shared/DataErrorState";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import type { NicheRecord } from "@/lib/types";

export default function NichesList() {
  const { data: niches, isLoading, error, invalidate } = useDashboardData("niches");

  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNicheToEdit, setSelectedNicheToEdit] = useState<NicheRecord | null>(null);
  const [viewNiche, setViewNiche] = useState<NicheRecord | null>(null);

  if (isLoading) return <SystemLoader message="Loading content niches..." />;
  if (error) return <DataErrorState message={error} onRetry={invalidate} />;

  const safeNiches = niches ?? [];

  const filteredNiches = safeNiches.filter(
    (niche) =>
      niche.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      niche.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNew = () => {
    setSelectedNicheToEdit(null);
    setIsEditModalOpen(true);
  };

  const handleEdit = (niche: NicheRecord) => {
    setSelectedNicheToEdit(niche);
    setIsEditModalOpen(true);
  };

  const handleEditModalSuccess = () => {
    setIsEditModalOpen(false);
    invalidate(); // Purge cache — next visit will fetch fresh data
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-foreground tracking-tight">
            Content Niches
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage AI behaviors and system prompts.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="rounded-full px-6 shadow-lg shadow-primary/20 cursor-pointer">
          <Plus className="w-4 h-4 mr-2" /> Create New Niche
        </Button>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border/50 flex items-center gap-3 bg-muted/10">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search niches by name or key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-none bg-transparent shadow-none focus-visible:ring-0 h-8 px-2 text-sm placeholder:text-xs placeholder:pl-1"
          />
        </div>

        {filteredNiches.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-muted-foreground">
            <Layers className="w-12 h-12 mb-4 opacity-20" />
            <p>{searchQuery ? "No matching niches found." : "No niches found. Create your first one!"}</p>
          </div>
        ) : (
          <>
            {/* 📱 MOBILE VIEW: Cards */}
            <div className="grid grid-cols-1 gap-4 p-4 lg:hidden">
              {filteredNiches.map((niche) => (
                <div key={niche.id} className="p-5 border border-border/50 rounded-xl bg-background space-y-3 relative">
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setViewNiche(niche)} className="bg-muted/50 rounded-full h-8 w-8 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(niche)} className="bg-muted/50 rounded-full h-8 w-8 cursor-pointer hover:bg-primary/10 transition-colors">
                      <Edit3 className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                  <div className="pr-16">
                    <h4 className="font-semibold text-foreground">{niche.name}</h4>
                    <p className="text-xs text-muted-foreground font-mono mt-1 bg-muted/50 inline-block px-1.5 py-0.5 rounded">{niche.key}</p>
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2 mt-2">
                    {niche.systemPrompt}
                  </div>
                </div>
              ))}
            </div>

            {/* 💻 DESKTOP VIEW: Table */}
            <div className="hidden lg:block w-full overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 font-medium tracking-wider">Display Name & Key</th>
                    <th className="px-6 py-4 font-medium tracking-wider">System Prompt Sneak Peek</th>
                    <th className="px-6 py-4 font-medium tracking-wider text-center">BGM Assets</th>
                    <th className="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredNiches.map((niche) => (
                    <tr key={niche.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-semibold text-foreground">{niche.name}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5 bg-muted/50 inline-block px-1.5 py-0.5 rounded">{niche.key}</p>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="truncate text-muted-foreground">{niche.systemPrompt}</p>
                      </td>
                      <td className="px-6 py-4 text-center text-muted-foreground">
                        {niche.bgmUrls?.length || 0} tracks
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setViewNiche(niche)} className="rounded-full px-4 border-border/50 hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
                            <Eye className="w-3.5 h-3.5 mr-2" /> View
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(niche)} className="rounded-full px-4 border-border/50 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer">
                            <Edit3 className="w-3.5 h-3.5 mr-2" /> Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-[95vw] lg:max-w-[70vw] h-[80vh] lg:h-[85vh] p-0 overflow-y-auto overflow-x-hidden rounded-2xl bg-background border-border/50">
          <DialogTitle className="sr-only">Edit or Create Niche</DialogTitle>
          <DialogDescription className="sr-only">Fill out the form to edit or create a new content niche.</DialogDescription>
          {isEditModalOpen && (
            <NicheForm
              initialData={selectedNicheToEdit}
              onSuccess={handleEditModalSuccess}
              onCancel={() => setIsEditModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* READ-ONLY VIEW MODAL */}
      <Dialog open={!!viewNiche} onOpenChange={(open) => !open && setViewNiche(null)}>
        <DialogContent className="max-w-[95vw] lg:max-w-[70vw] h-[80vh] lg:h-[85vh] p-0 overflow-y-auto overflow-x-hidden rounded-2xl bg-background border-border/50 [&>button]:hidden">
          <DialogTitle className="sr-only">Niche Details View</DialogTitle>
          <DialogDescription className="sr-only">Read-only view of the selected niche configurations.</DialogDescription>
          {viewNiche && <NicheView niche={viewNiche} onClose={() => setViewNiche(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
