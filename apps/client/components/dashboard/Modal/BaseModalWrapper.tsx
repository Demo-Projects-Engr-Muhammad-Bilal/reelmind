"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BaseModalProps {
          isOpen: boolean;
          onClose: () => void;
          title: string | React.ReactNode;
          subtitle: string | React.ReactNode;
          icon?: React.ElementType;
          headerRight?: React.ReactNode;
          leftNav?: React.ReactNode;
          rightNav?: React.ReactNode;
          footer?: React.ReactNode;
          children: React.ReactNode;
}

export const BaseModalWrapper = ({
          isOpen, onClose, title, subtitle, icon: Icon = Terminal,
          headerRight, leftNav, rightNav, footer, children
}: BaseModalProps) => {
          const [mounted, setMounted] = useState(false);
          useEffect(() => setMounted(true), []);

          if (!isOpen || !mounted) return null;

          return createPortal(
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-0 md:p-4 bg-background/90 backdrop-blur-sm animate-in fade-in duration-200">
                              <div className="bg-card border border-border rounded-xl md:rounded-2xl w-[95vw] h-[90vh] md:h-[95vh] max-w-none flex flex-col shadow-2xl relative overflow-hidden">

                                        {leftNav}
                                        {rightNav}

                                        <div className="flex items-center justify-between px-4 md:px-8 pt-6 pb-4 border-b border-border/50 shrink-0 bg-sidebar/30 relative z-50">
                                                  <div className="flex items-center gap-4 md:gap-6">
                                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-sm">
                                                                      <Icon className="w-5 h-5 md:w-6 md:h-6 pointer-events-none" />
                                                            </div>
                                                            <div>
                                                                      <h3 className="text-xl md:text-2xl font-black font-headline text-foreground tracking-tight leading-none">
                                                                                {title}
                                                                      </h3>
                                                                      <p className="text-xs md:text-sm font-medium text-muted-foreground mt-1">
                                                                                {subtitle}
                                                                      </p>
                                                            </div>
                                                  </div>
                                                  <div className="flex items-center gap-3 md:gap-4">
                                                            {headerRight}
                                                            <Button variant="ghost" size="icon" onClick={onClose} className="border border-border/80 shadow-sm rounded-full bg-background hover:bg-muted w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shrink-0 cursor-pointer">
                                                                      <X className="w-5 h-5 md:w-6 md:h-6 text-foreground pointer-events-none" />
                                                            </Button>
                                                  </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto py-6 bg-background relative flex flex-col px-4 md:px-8">
                                                  {children}
                                        </div>

                                        {footer && (
                                                  <div className="px-4 md:px-8 py-3 border-t border-border flex justify-between items-center shrink-0 bg-sidebar/80 backdrop-blur-md z-40">
                                                            {footer}
                                                  </div>
                                        )}
                              </div>

                              <style dangerouslySetInnerHTML={{
                                        __html: `
        .custom-audio { border-radius: 9999px !important; outline: none; width: 100%; height: 100%; }
        .custom-audio::-webkit-media-controls-enclosure { background-color: #f1f3f4 !important; border-radius: 9999px !important; }
        .dark .custom-audio::-webkit-media-controls-enclosure { background-color: #27272a !important; }
        .dark .custom-audio { color-scheme: dark; }
        .custom-video { outline: none; }
        .dark .custom-video { color-scheme: dark; }
      `}} />
                    </div>,
                    document.body
          );
};