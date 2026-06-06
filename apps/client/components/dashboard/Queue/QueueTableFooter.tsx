// components/dashboard/Queue/QueueTableFooter.tsx
// Pagination footer for the queue table.
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QueueTableFooterProps {
  activeNodesCount: number;
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export function QueueTableFooter({
  activeNodesCount, currentPage, totalPages, onPrev, onNext,
}: QueueTableFooterProps) {
  return (
    <div className="bg-sidebar p-3.5 border-t border-border/60 flex justify-between items-center text-xs font-bold text-muted-foreground mt-auto">
      <div className="flex items-center gap-4">
        <span>
          Active Nodes:{" "}
          <span className="text-emerald-500">{activeNodesCount}/3 Online</span>
        </span>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="w-7 h-7 cursor-pointer"
            disabled={currentPage === 1}
            onClick={onPrev}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button
            variant="outline"
            size="icon"
            className="w-7 h-7 cursor-pointer"
            disabled={currentPage === totalPages}
            onClick={onNext}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
