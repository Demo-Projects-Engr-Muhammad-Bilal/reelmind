// components/dashboard/PipelineForm/FormSummaryMode.tsx
// Renders the locked "Quiet Luxury" summary brief when pipeline is active/finished.
import { Video, Sparkles, Layers, RotateCcw, Play, BrainCircuit, BookOpen, HardHat, Car, Construction } from "lucide-react";
import type { NicheData, VisualStyle, PipelineMode } from "@/types/pipeline";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "container-homes":           Construction,
  "car-secrets":               Car,
  "underground-construction":  HardHat,
  "creative-fiction":          BookOpen,
  "dark-psychology-secrets":   BrainCircuit,
};

interface FormSummaryModeProps {
  prompt: string;
  selectedNiche: string;
  selectedStyle: VisualStyle | null;
  pipelineType: PipelineMode;
  isFinished: boolean;
  niches: NicheData[];
}

export function FormSummaryMode({
  prompt, selectedNiche, selectedStyle, pipelineType, isFinished, niches,
}: FormSummaryModeProps) {
  const activeNicheName = niches.find((n) => n.key === selectedNiche)?.name ?? selectedNiche;
  const activeStyleName = selectedStyle === "ai-video" ? "AI Video Loops" : selectedStyle === "ken-burns" ? "Ken Burns" : "None";
  const ActiveIcon = iconMap[selectedNiche] ?? Layers;

  return (
    <div className="flex flex-col gap-5 animate-in slide-in-from-bottom-2 fade-in duration-500 pt-2">
      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
        {isFinished ? <RotateCcw className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
      </div>
      <h2 className="text-2xl font-black font-headline tracking-tight text-foreground -mt-3">
        {isFinished ? "Production Complete" : "Pipeline Active"}
      </h2>
      <p className="text-sm font-medium text-muted-foreground -mt-3">
        The parameters below are locked while the engine is running. To edit, cancel the current process.
      </p>

      <div className="flex flex-col gap-5 p-5 rounded-2xl border border-border/60 bg-sidebar/30 mt-2">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Topic / Prompt</span>
          <p className="text-sm font-bold text-foreground leading-relaxed">{prompt || "Untitled Draft"}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Micro-Niche</span>
            <span className="text-sm font-bold text-foreground flex items-center gap-2">
              <ActiveIcon className="w-4 h-4 text-primary" />
              <span className="truncate">{activeNicheName}</span>
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Visual Style</span>
            <span className="text-sm font-bold text-foreground flex items-center gap-2">
              {selectedStyle === "ai-video"
                ? <Video className="w-4 h-4 text-primary" />
                : <Sparkles className="w-4 h-4 text-primary" />}
              {activeStyleName}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 pt-4 border-t border-border/50">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Execution Mode</span>
          <div className="flex items-center">
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20 uppercase tracking-widest">
              {pipelineType === "direct" ? "Direct Generation" : "Interactive Mode"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
