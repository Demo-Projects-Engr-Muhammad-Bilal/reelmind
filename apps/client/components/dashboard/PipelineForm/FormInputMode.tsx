// components/dashboard/PipelineForm/FormInputMode.tsx
// Renders the editable form fields (prompt, niche, style, execution mode).
import React from "react";
import { Video, Sparkles, Layers, BrainCircuit, BookOpen, HardHat, Car, Construction } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { NicheData, VisualStyle, PipelineMode } from "@/types/pipeline";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "container-homes":           Construction,
  "car-secrets":               Car,
  "underground-construction":  HardHat,
  "creative-fiction":          BookOpen,
  "dark-psychology-secrets":   BrainCircuit,
};

interface FormInputModeProps {
  prompt: string;
  setPrompt: (v: string) => void;
  selectedNiche: string;
  setSelectedNiche: (v: string) => void;
  selectedStyle: VisualStyle | null;
  setSelectedStyle: (v: VisualStyle) => void;
  pipelineType: PipelineMode;
  setPipelineType: (v: PipelineMode) => void;
  niches: NicheData[];
  isQueueFull: boolean;
}

export function FormInputMode({
  prompt, setPrompt, selectedNiche, setSelectedNiche,
  selectedStyle, setSelectedStyle, pipelineType, setPipelineType,
  niches, isQueueFull,
}: FormInputModeProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* 1. Core Topic Prompt */}
      <div className="flex flex-col gap-3.5">
        <label className="text-xs font-bold tracking-wide text-muted-foreground uppercase block">
          1. Core Topic Prompt
        </label>
        <textarea
          value={prompt}
          disabled={isQueueFull}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full min-h-[110px] md:min-h-[210px] bg-sidebar border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl p-4 text-sm resize-none outline-none transition-all text-foreground font-medium disabled:opacity-50"
          placeholder={isQueueFull ? "Queue limit reached. Wait for a reel to finish..." : "Enter automation prompt theme..."}
        />
      </div>

      {/* 2. Target Micro-Niche */}
      <div className="flex flex-col gap-3.5">
        <label className="text-xs font-bold tracking-wide text-muted-foreground uppercase block">
          2. Target Micro-Niche
        </label>
        <Select value={selectedNiche} onValueChange={setSelectedNiche} disabled={niches.length === 0 || isQueueFull}>
          <SelectTrigger className="w-full bg-sidebar border border-border rounded-xl px-4 py-6 h-12 font-semibold text-sm text-foreground focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer">
            <SelectValue placeholder={niches.length === 0 ? "Loading DB items..." : "Select micro-niche preset..."} />
          </SelectTrigger>
          <SelectContent>
            {niches.map((niche, idx, array) => {
              const Icon = iconMap[niche.key] ?? Layers;
              return (
                <React.Fragment key={niche.key ?? idx}>
                  <SelectItem value={niche.key} className="font-semibold text-sm py-3 px-3 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span>{niche.name}</span>
                    </div>
                  </SelectItem>
                  {idx < array.length - 1 && <SelectSeparator />}
                </React.Fragment>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* 3. Visual Generation Style */}
      <div className="flex flex-col gap-3.5">
        <label className="text-xs font-bold tracking-wide text-muted-foreground uppercase block">
          3. Visual Generation Style
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            disabled={isQueueFull}
            onClick={() => setSelectedStyle("ai-video")}
            className={`cursor-pointer p-3 rounded-xl border text-center text-xs font-bold transition-all flex flex-col items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${selectedStyle === "ai-video" ? "bg-primary/10 border-primary text-primary" : "bg-sidebar border-border/70 text-muted-foreground hover:bg-muted/40"}`}
          >
            <Video className="w-4 h-4" /> <span>AI Video Loops</span>
          </button>
          <button
            disabled={isQueueFull}
            onClick={() => setSelectedStyle("ken-burns")}
            className={`cursor-pointer p-3 rounded-xl border text-center text-xs font-bold transition-all flex flex-col items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${selectedStyle === "ken-burns" ? "bg-primary/10 border-primary text-primary" : "bg-sidebar border-border/70 text-muted-foreground hover:bg-muted/40"}`}
          >
            <Sparkles className="w-4 h-4" /> <span>Ken Burns</span>
          </button>
        </div>
      </div>

      {/* 4. Execution Mode */}
      <div className="flex flex-col gap-3.5 pt-4 border-t border-border/50">
        <label className="text-xs font-bold tracking-wide text-muted-foreground uppercase block">
          Pipeline Execution Mode
        </label>
        <div className="flex bg-sidebar p-1 rounded-xl border border-border/60 items-center h-12">
          <Button
            variant="ghost"
            disabled={isQueueFull}
            onClick={() => setPipelineType("direct")}
            className={`flex-1 cursor-pointer ${pipelineType === "direct" ? "bg-background text-primary" : "text-muted-foreground"}`}
          >
            Direct Reel
          </Button>
          <Button
            variant="ghost"
            disabled={isQueueFull}
            onClick={() => setPipelineType("interactive")}
            className={`flex-1 cursor-pointer ${pipelineType === "interactive" ? "bg-background text-primary" : "text-muted-foreground"}`}
          >
            Interactive
          </Button>
        </div>
      </div>
    </div>
  );
}
