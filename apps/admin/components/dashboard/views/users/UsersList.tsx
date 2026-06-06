"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Search, Download, ShieldAlert, ShieldCheck, Zap, Ban, CheckCircle2, Eye, ChevronLeft, ChevronRight, User as UserIcon, Calendar, MessageSquare, Video, X, Coins, Snowflake, MessageCircle, Activity, Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getUsersAction, updateUserCreditsAction, toggleUserStatusAction } from "@/app/actions/user";
import { toast } from "sonner";
import { useDashboard } from "@/context/dashboard/DashboardProvider";


export default function UsersList() {
          const [users, setUsers] = useState<any[]>([]);
          const [isLoading, setIsLoading] = useState(true);

          const { setActiveView } = useDashboard();

          // Filter & Search States
          const [searchQuery, setSearchQuery] = useState("");
          const [filterStatus, setFilterStatus] = useState("Active"); // 'All', 'Active', 'Frozen'

          // Pagination States
          const [currentPage, setCurrentPage] = useState(1);
          const ITEMS_PER_PAGE = 4;

          // Modals States
          const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
          const [selectedUser, setSelectedUser] = useState<any | null>(null);
          const [newCredits, setNewCredits] = useState<string>("");
          const [isUpdating, setIsUpdating] = useState(false);

          const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
          const [userToToggle, setUserToToggle] = useState<any | null>(null);
          const [isToggling, setIsToggling] = useState(false);

          const [isViewModalOpen, setIsViewModalOpen] = useState(false);
          const [userToView, setUserToView] = useState<any | null>(null);

          const fetchUsers = async () => {
                    setIsLoading(true);
                    const res = await getUsersAction();
                    if (!res.success) toast.error(res.error || "Failed to load users");
                    else setUsers(res.data);
                    setIsLoading(false);
          };

          useEffect(() => { fetchUsers(); }, []);
          useEffect(() => { setCurrentPage(1); }, [searchQuery, filterStatus]);

          const handleNavigateToAudit = (email: string) => {
                    sessionStorage.setItem("audit_search", email);
                    setIsViewModalOpen(false);
                    setActiveView("audit");
          };


          const handleNavigateToReels = (email: string) => {
                    sessionStorage.setItem("reels_search", email);
                    setIsViewModalOpen(false);
                    setActiveView("reels"); // Ensure this matches your sidebar ID for Observer Dash
          };

          // FILTERING LOGIC
          const filteredUsers = users.filter((user) => {
                    const matchesSearch = user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              user.name?.toLowerCase().includes(searchQuery.toLowerCase());

                    let matchesFilter = true;
                    if (filterStatus === "Active") matchesFilter = user.isVerified === true;
                    if (filterStatus === "Frozen") matchesFilter = user.isVerified === false;

                    return matchesSearch && matchesFilter;
          });

          // PAGINATION LOGIC
          const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
          const paginatedUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

          // CSV EXPORT LOGIC
          const exportToCSV = () => {
                    const headers = ["User ID", "Name", "Email", "Credits", "Status", "Joined Date"];
                    const rows = filteredUsers.map(u => [
                              u.id, `"${u.name || 'N/A'}"`, u.email, u.credits, u.isVerified ? 'Active' : 'Blocked', new Date(u.createdAt).toLocaleDateString()
                    ]);
                    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
                    const link = document.createElement("a");
                    link.setAttribute("href", encodeURI(csvContent));
                    link.setAttribute("download", `aethelgard_users_${new Date().toISOString().split('T')[0]}.csv`);
                    document.body.appendChild(link); link.click(); document.body.removeChild(link);
          };

          // Action Handlers
          const handleOpenCreditModal = (user: any) => { setSelectedUser(user); setNewCredits(user.credits.toString()); setIsCreditModalOpen(true); };
          const handleOpenFreezeModal = (user: any) => { setUserToToggle(user); setIsFreezeModalOpen(true); };
          const handleOpenViewModal = (user: any) => { setUserToView(user); setIsViewModalOpen(true); };

          const handleUpdateCredits = async () => {
                    if (!selectedUser) return;
                    setIsUpdating(true);
                    const toastId = toast.loading("Updating credits...");
                    const res = await updateUserCreditsAction(selectedUser.id, parseInt(newCredits) || 0);
                    if (res.success) {
                              toast.success("Credits updated successfully!", { id: toastId });
                              setIsCreditModalOpen(false); fetchUsers();
                    } else toast.error(res.error || "Failed to update credits.", { id: toastId });
                    setIsUpdating(false);
          };

          const confirmToggleStatus = async () => {
                    if (!userToToggle) return;
                    setIsToggling(true);
                    const actionText = userToToggle.isVerified ? "Freezing" : "Activating";
                    const toastId = toast.loading(`${actionText} account...`);

                    const res = await toggleUserStatusAction(userToToggle.id, userToToggle.isVerified);
                    if (res.success) {
                              toast.success(`Account successfully ${userToToggle.isVerified ? 'frozen' : 'activated'}.`, { id: toastId });
                              setIsFreezeModalOpen(false); fetchUsers();
                    } else toast.error(res.error || "Action failed.", { id: toastId });
                    setIsToggling(false);
          };

          return (
                    <div className="w-full max-w-7xl mx-auto space-y-6">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                                  <h2 className="text-3xl font-semibold text-foreground tracking-tight">User Directory</h2>
                                                  <p className="text-sm text-muted-foreground mt-1">Manage accounts, credit balances, and platform access.</p>
                                        </div>
                                        <Button onClick={exportToCSV} variant="outline" className="rounded-full px-6 shadow-sm cursor-pointer">
                                                  <Download className="w-4 h-4 mr-2" /> Export to CSV
                                        </Button>
                              </div>

                              {/* ⚡ FIX: min-h-[550px] applied, structured specifically to push pagination down */}
                              <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[550px]">

                                        {/* TOP CONTROLS: SEARCH & FILTER TABS */}
                                        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/5 shrink-0">
                                                  <div className="flex items-center gap-2 w-full sm:w-auto bg-background border border-border/50 px-3 py-1.5 rounded-full shadow-sm">
                                                            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                                                            <Input
                                                                      placeholder="Search by name or email..."
                                                                      value={searchQuery}
                                                                      onChange={(e) => setSearchQuery(e.target.value)}
                                                                      className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 px-0 h-7 text-sm"
                                                            />
                                                  </div>


                                                  <div className="flex bg-muted/50 p-1 rounded-xl w-full sm:w-auto overflow-hidden shrink-0">
                                                            {['All', 'Active', 'Frozen'].map((status) => (
                                                                      <Button
                                                                      size="default"
                                                                      variant="ghost"
                                                                                key={status}
                                                                                onClick={() => setFilterStatus(status)}
                                                                                // ⚡ FIX: Active filter color mapped correctly
                                                                                className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${filterStatus === status ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'
                                                                                          }`}
                                                                      >
                                                                                {status}
                                                                      </Button>
                                                            ))}
                                                  </div>
                                        </div>

                                        {/* ⚡ DATA LIST (flex-grow forces this container to take all available middle space) */}
                                        <div className="flex-grow flex flex-col bg-background">
                                                  {isLoading ? (
                                                            <div className="flex-grow flex justify-center items-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin" /></div>
                                                  ) : filteredUsers.length === 0 ? (
                                                            <div className="flex-grow flex flex-col items-center justify-center text-muted-foreground text-center p-8">
                                                                      <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
                                                                      <p>{searchQuery ? "No matching users found." : "No users found in this category."}</p>
                                                            </div>
                                                  ) : (
                                                            <>
                                                                      {/* 💻 DESKTOP TABLE VIEW */}
                                                                      <div className="hidden lg:block w-full overflow-x-auto flex-grow">
                                                                                <table className="w-full text-sm text-left">
                                                                                          <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
                                                                                                    <tr>
                                                                                                              <th className="px-6 py-4 font-medium tracking-wider">User Details</th>
                                                                                                              <th className="px-6 py-4 font-medium tracking-wider">Status</th>
                                                                                                              <th className="px-6 py-4 font-medium tracking-wider">Credits</th>
                                                                                                              <th className="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
                                                                                                    </tr>
                                                                                          </thead>
                                                                                          <tbody className="divide-y divide-border/50">
                                                                                                    {paginatedUsers.map((user) => (
                                                                                                              <tr key={user.id} className="hover:bg-muted/5 transition-colors bg-background">
                                                                                                                        <td className="px-6 py-4 align-middle whitespace-nowrap">
                                                                                                                                  <p className="font-semibold text-foreground">{user.name || "Unnamed User"}</p>
                                                                                                                                  <p className="text-xs text-muted-foreground">{user.email}</p>
                                                                                                                        </td>
                                                                                                                        <td className="px-6 py-4 align-middle">
                                                                                                                                  {user.isVerified ? (
                                                                                                                                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md w-fit"><ShieldCheck className="w-3.5 h-3.5" /> Active</span>
                                                                                                                                  ) : (
                                                                                                                                            <span className="flex items-center gap-1.5 text-xs font-bold text-destructive bg-destructive/10 px-2.5 py-1 rounded-md w-fit"><Ban className="w-3.5 h-3.5" /> Frozen</span>
                                                                                                                                  )}
                                                                                                                        </td>
                                                                                                                        <td className="px-6 py-4 align-middle font-mono font-medium">
                                                                                                                                  <div className="flex items-center gap-2">
                                                                                                                                            <Zap className="w-4 h-4 text-amber-500" /> {user.credits}
                                                                                                                                  </div>
                                                                                                                        </td>
                                                                                                                        <td className="px-6 py-4 align-middle text-right">
                                                                                                                                  <div className="flex justify-end gap-2">
                                                                                                                                            <Button variant="ghost" size="sm" onClick={() => handleOpenViewModal(user)} className="rounded-full hover:bg-primary/10 hover:text-primary cursor-pointer"><Eye className="w-4 h-4" /></Button>
                                                                                                                                            <Button variant="outline" size="sm" onClick={() => handleOpenCreditModal(user)} className="rounded-full border-border/50 cursor-pointer"><Zap className="w-3.5 h-3.5 mr-2 text-amber-500" /> Credits</Button>
                                                                                                                                            <Button variant="outline" size="sm" onClick={() => handleOpenFreezeModal(user)} className={`rounded-full border-border/50 cursor-pointer ${user.isVerified ? 'hover:bg-destructive/10 hover:text-destructive' : 'hover:bg-emerald-500/10 hover:text-emerald-500'}`}>
                                                                                                                                                      {user.isVerified ? <><Ban className="w-3.5 h-3.5 mr-2" /> Freeze</> : <><CheckCircle2 className="w-3.5 h-3.5 mr-2" /> Activate</>}
                                                                                                                                            </Button>
                                                                                                                                  </div>
                                                                                                                        </td>
                                                                                                              </tr>
                                                                                                    ))}
                                                                                          </tbody>
                                                                                </table>
                                                                      </div>

                                                                      {/* 📱 MOBILE VIEW */}
                                                                      <div className="grid grid-cols-1 gap-4 p-4 lg:hidden">
                                                                                {paginatedUsers.map((user) => (
                                                                                          <div key={user.id} className="p-5 border border-border/50 rounded-xl bg-background flex flex-col gap-3 relative shadow-sm">
                                                                                                    <div className="flex justify-between items-start pr-12">
                                                                                                              <div className="flex-1 overflow-hidden">
                                                                                                                        <h4 className="font-semibold text-foreground truncate">{user.name || "Unnamed User"}</h4>
                                                                                                                        <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                                                                                                                        <div className="mt-2 flex items-center gap-2">
                                                                                                                                  {user.isVerified ? (
                                                                                                                                            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-0 py-0.5 rounded-full uppercase tracking-wider font-bold">Active</span>
                                                                                                                                  ) : (
                                                                                                                                            <span className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Frozen</span>
                                                                                                                                  )}
                                                                                                                        </div>
                                                                                                              </div>
                                                                                                    </div>
                                                                                                    <div className="flex items-center gap-4 mt-2">
                                                                                                              <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md border border-border/50">
                                                                                                                        <Coins className="w-3 h-3 text-amber-500" />
                                                                                                                        <span className="font-mono text-sm font-bold">{user.credits}</span>
                                                                                                              </div>
                                                                                                    </div>
                                                                                                    <div className="absolute top-4 right-3 flex flex-col gap-4">
                                                                                                              <button onClick={() => handleOpenViewModal(user)} className="text-primary hover:opacity-70 p-2 bg-muted/50 rounded-md cursor-pointer"><Eye className="w-4 h-4" /></button>
                                                                                                              <button onClick={() => handleOpenCreditModal(user)} className="text-primary hover:opacity-70 p-2 bg-muted/50 rounded-md cursor-pointer"><Zap className="w-4 h-4" /></button>
                                                                                                              <button onClick={() => handleOpenFreezeModal(user)} className={`${user.isVerified ? 'text-destructive' : 'text-emerald-500'} hover:opacity-70 p-2 bg-muted/50 rounded-md cursor-pointer`}>
                                                                                                                        {user.isVerified ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                                                                                              </button>
                                                                                                    </div>
                                                                                          </div>
                                                                                ))}
                                                                      </div>
                                                            </>
                                                  )}
                                        </div>

                                        {/* ⚡ PAGINATION CONTROLS (mt-auto forces it to stay at the very bottom of the 550px container) */}
                                        <div className="mt-auto p-4 border-t border-border/50 bg-muted/5 flex items-center justify-between shrink-0">
                                                  <p className="text-xs text-muted-foreground font-medium">
                                                            Showing <span className="text-foreground">{filteredUsers.length === 0 ? 0 : ((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}</span> of <span className="text-foreground">{filteredUsers.length}</span>
                                                  </p>
                                                  {totalPages > 1 && (
                                                            <div className="flex items-center gap-2">
                                                                      <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-full cursor-pointer">
                                                                                <ChevronLeft className="w-4 h-4" />
                                                                      </Button>
                                                                      <div className="text-xs font-semibold px-2">{currentPage} / {totalPages}</div>
                                                                      <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-full cursor-pointer">
                                                                                <ChevronRight className="w-4 h-4" />
                                                                      </Button>
                                                            </div>
                                                  )}
                                        </div>
                              </div>

                              {/* ⚡ MODAL 1: VIEW USER DEEP DIVE (With Usage Logs Link) */}
                              <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                                        <DialogContent className="w-[95vw] sm:max-w-[500px] p-0 overflow-hidden rounded-2xl bg-background border-border/50 [&>button]:hidden">
                                                  <DialogTitle className="sr-only">User Profile Details</DialogTitle>
                                                  <DialogDescription className="sr-only">View complete profile and activity of the user.</DialogDescription>

                                                  {userToView && (
                                                            <div className="w-full">

                                                                      {/* Header (Edge-to-edge background) */}
                                                                      <div className="bg-muted/30 p-4 sm:p-6 border-b border-border/50 relative">
                                                                                <div className="flex items-center gap-3 sm:gap-4 pr-8 w-full">
                                                                                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 shrink-0">
                                                                                                    <UserIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                                                                          </div>
                                                                                          <div className="flex-1 min-w-0">
                                                                                                    <h3 className="font-semibold text-base sm:text-lg text-foreground truncate">{userToView.name || "Unnamed"}</h3>
                                                                                                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{userToView.email}</p>

                                                                                                    <div className="flex items-center gap-4 mt-1.5">
                                                                                                              {/* Existing Audit Link */}
                                                                                                              <button
                                                                                                                        onClick={() => handleNavigateToAudit(userToView.email)}
                                                                                                                        className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-primary hover:opacity-70 transition-opacity cursor-pointer"
                                                                                                              >
                                                                                                                        <Activity className="w-3 h-3" /> View Usage Logs
                                                                                                              </button>

                                                                                                              {/* ⚡ NEW Reels Link */}
                                                                                                              <button
                                                                                                                        onClick={() => handleNavigateToReels(userToView.email)}
                                                                                                                        className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-primary hover:opacity-70 transition-opacity cursor-pointer"
                                                                                                              >
                                                                                                                        <Clapperboard className="w-3 h-3" /> View Reels
                                                                                                              </button>
                                                                                                    </div>
                                                                                          </div>
                                                                                </div>
                                                                                <Button
                                                                                          variant="ghost"
                                                                                          size="icon"
                                                                                          onClick={() => setIsViewModalOpen(false)}
                                                                                          className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full cursor-pointer h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                                                                                >
                                                                                          <X className="w-4 h-4" />
                                                                                </Button>
                                                                      </div>

                                                                      {/* Stats Grid */}
                                                                      <div className="p-4 sm:p-6 grid grid-cols-2 gap-3 sm:gap-4">
                                                                                <div className="p-3 sm:p-4 bg-muted/10 border border-border/50 rounded-xl space-y-1.5 shadow-sm overflow-hidden">
                                                                                          <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground"><Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /><span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider truncate">Joined On</span></div>
                                                                                          <p className="font-medium text-xs sm:text-sm text-foreground truncate">{new Date(userToView.createdAt).toLocaleDateString()}</p>
                                                                                </div>
                                                                                <div className="p-3 sm:p-4 bg-muted/10 border border-border/50 rounded-xl space-y-1.5 shadow-sm overflow-hidden">
                                                                                          <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground"><Video className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /><span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider truncate">Reels Gen</span></div>
                                                                                          <p className="font-medium text-base sm:text-lg text-foreground">{userToView._count?.reels || 0}</p>
                                                                                </div>
                                                                      </div>

                                                                      {/* Telegram Info */}
                                                                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
                                                                                <h4 className="text-xs font-bold tracking-wider uppercase text-primary flex items-center gap-2 border-b border-border/50 pb-2"><MessageCircle className="w-3.5 h-3.5" /> Telegram Config</h4>
                                                                                {userToView.telegramCreds ? (
                                                                                          <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-y-2 sm:gap-y-3 text-xs sm:text-sm">
                                                                                                    <div className="text-muted-foreground">Bot Active:</div>
                                                                                                    <div className="font-medium text-foreground">{userToView.telegramCreds.isActive ? "Yes" : "No"}</div>

                                                                                                    <div className="text-muted-foreground">Username:</div>
                                                                                                    <div className="font-medium text-foreground truncate pr-2">{userToView.telegramCreds.username || "N/A"}</div>

                                                                                                    <div className="text-muted-foreground">Chat ID:</div>
                                                                                                    <div className="font-mono text-[10px] sm:text-xs mt-0.5 text-foreground truncate pr-2">{userToView.telegramCreds.telegramChatId}</div>
                                                                                          </div>
                                                                                ) : (
                                                                                          <p className="text-xs sm:text-sm text-muted-foreground italic bg-muted/30 p-3 rounded-lg border border-border/50">No Telegram account connected yet.</p>
                                                                                )}
                                                                      </div>

                                                            </div>
                                                  )}
                                        </DialogContent>
                              </Dialog>

                              {/* ⚡ MODAL 2: UPDATE CREDITS (Fixed Width) */}
                              <Dialog open={isCreditModalOpen} onOpenChange={setIsCreditModalOpen}>
                                        <DialogContent className="w-[95vw] max-w-[500px] p-6 rounded-2xl bg-background border-border/50">
                                                  <DialogTitle className="text-xl font-semibold">Update Credits</DialogTitle>
                                                  <DialogDescription className="text-md text-muted-foreground">Modify the credit balance for {selectedUser?.name || selectedUser?.email}.</DialogDescription>
                                                  <div className="mt-6 space-y-4">
                                                            <div className="relative">
                                                                      <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFD700]" />
                                                                      <Input type="number" value={newCredits} onChange={(e) => setNewCredits(e.target.value)} className="pl-11 py-6 bg-muted/30 text-lg font-mono border-primary/30 focus-visible:ring-primary" />
                                                            </div>
                                                  </div>
                                                  <div className="flex justify-center mt-6 pt-4 border-t border-border/50 w-full">

                                                            <Button size="lg" onClick={handleUpdateCredits} disabled={isUpdating || !newCredits} className="px-8 rounded-full shadow-lg shadow-primary/20 cursor-pointer">
                                                                      {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />} Save Balance
                                                            </Button>
                                                  </div>
                                        </DialogContent>
                              </Dialog>

                              {/* ⚡ MODAL 3: FREEZE CONFIRMATION (Fixed Width) */}
                              <Dialog open={isFreezeModalOpen} onOpenChange={setIsFreezeModalOpen}>
                                        <DialogContent className="w-[95vw] max-w-[500px] p-6 rounded-2xl bg-background border-border/50 [&>button]:hidden">
                                                  <DialogTitle className="text-xl font-semibold text-center mt-2 flex flex-col items-center gap-3">
                                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${userToToggle?.isVerified ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                                      {userToToggle?.isVerified ? <Ban className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                                                            </div>
                                                            {userToToggle?.isVerified ? "Freeze Account?" : "Activate Account?"}
                                                  </DialogTitle>
                                                  <DialogDescription className="text-center text-base text-muted-foreground mt-2">
                                                            Are you sure you want to {userToToggle?.isVerified ? "block" : "unblock"} <span className="font-semibold text-foreground">{userToToggle?.name || userToToggle?.email}</span><span> ?</span>
                                                            {userToToggle?.isVerified && <span className="block text-sm mt-2 text-destructive">They will lose access and receive a notification email.</span>}
                                                  </DialogDescription>

                                                  <div className="flex justify-center gap-4 mt-8 w-full">
                                                            <Button variant="outline" onClick={() => setIsFreezeModalOpen(false)} className="rounded-full flex-1 cursor-pointer"><X className="size-4"/>Cancel</Button>
                                                            <Button
                                                                      variant="destructive"
                                                                      onClick={confirmToggleStatus}
                                                                      disabled={isToggling}
                                                                      className="rounded-full flex-1 cursor-pointer"
                                                            >
                                                                      {isToggling ? (
                                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                      ) : (
                                                                                <>
                                                                                          {userToToggle?.isVerified ? (
                                                                                                    <Snowflake className="w-4 h-4 mr-2" />
                                                                                          ) : (
                                                                                                    <Zap className="w-4 h-4 mr-2" />
                                                                                          )}
                                                                                </>
                                                                      )}
                                                                      {userToToggle?.isVerified ? "Yes, Freeze" : "Yes, Activate"}
                                                            </Button>

                                                  </div>
                                        </DialogContent>
                              </Dialog>

                    </div>
          );
}