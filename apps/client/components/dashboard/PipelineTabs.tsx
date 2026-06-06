import { Button } from "@/components/ui/button";

export const PipelineTabs = ({ activeTab, setTab }: any) => (
          <div className="flex lg:hidden bg-sidebar p-1 rounded-xl border border-border/60 items-center h-12 w-full">
                    {["form", "pipeline"].map((tab) => (
                              <Button key={tab} variant="ghost" onClick={() => setTab(tab)}
                                        className={`flex-1 h-full text-xs font-bold rounded-lg ${activeTab === tab ? "bg-background text-primary" : "text-muted-foreground"}`}>
                                        {tab === "form" ? "Configuration" : "Live Pipeline"}
                              </Button>
                    ))}
          </div>
);