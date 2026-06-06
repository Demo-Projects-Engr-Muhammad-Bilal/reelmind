"use client";

import { getAdminProfileAction, updateAdminProfileAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, Save, Shield, User, History, LogIn, KeyRound, Eye, EyeOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

// ⚡ ZOD SCHEMA FOR PASSWORD VALIDATION
const passwordSchema = z.string()
          .min(8, "Minimum 8 characters required")
          .max(32, "Maximum 32 characters allowed")
          .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
          .regex(/[a-z]/, "Must contain at least 1 lowercase letter")
          .regex(/[0-9]/, "Must contain at least 1 number")
          .regex(/[\W_]/, "Must contain at least 1 special character");

export default function AdminSettings() {
          const [isLoading, setIsLoading] = useState(true);
          const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
          const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

          // Form State
          const [formData, setFormData] = useState({
                    name: "",
                    email: "",
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
          });

          // Security Errors & Visibility States
          const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
          const [showCurrent, setShowCurrent] = useState(false);
          const [showNew, setShowNew] = useState(false);
          const [showConfirm, setShowConfirm] = useState(false);

          // Metadata State
          const [metrics, setMetrics] = useState({
                    lastLoginAt: null as string | null,
                    lastPasswordChange: null as string | null,
                    updatedAt: null as string | null,
          });

          const fetchAdminProfile = async () => {
                    setIsLoading(true);
                    const res = await getAdminProfileAction();
                    if (res.success && res.data) {
                              setFormData(prev => ({
                                        ...prev,
                                        name: res.data.name || "",
                                        email: res.data.email || ""
                              }));
                              setMetrics({
                                        lastLoginAt: res.data.lastLoginAt,
                                        lastPasswordChange: res.data.lastPasswordChange || res.data.createdAt,
                                        updatedAt: res.data.updatedAt,
                              });
                    } else {
                              toast.error(res.error || "Failed to load admin details.");
                    }
                    setIsLoading(false);
          };

          useEffect(() => { fetchAdminProfile(); }, []);

          // ⚡ HANDLER 1: Profile Update Only
          const handleProfileSubmit = async (e: React.FormEvent) => {
                    e.preventDefault();
                    setIsSubmittingProfile(true);
                    const toastId = toast.loading("Updating identity profile...");

                    const res = await updateAdminProfileAction({
                              name: formData.name,
                              email: formData.email,
                              currentPassword: "",
                              newPassword: ""
                    });

                    if (res.success) {
                              toast.success("Profile updated successfully.", { id: toastId });
                              fetchAdminProfile();
                    } else {
                              toast.error(res.error || "Failed to update profile.", { id: toastId });
                    }
                    setIsSubmittingProfile(false);
          };

          // ⚡ HANDLER 2: Password Update Only (With Zod Validation)
          const handlePasswordSubmit = async (e: React.FormEvent) => {
                    e.preventDefault();
                    setPasswordErrors([]);

                    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
                              toast.error("Please fill all password fields.");
                              return;
                    }
                    if (formData.newPassword !== formData.confirmPassword) {
                              toast.error("New password and confirm password do not match.");
                              return;
                    }

                    // ZOD VALIDATION CHECK
                    const validationResult = passwordSchema.safeParse(formData.newPassword);
                    if (!validationResult.success) {
                              const errors = validationResult.error.issues.map(issue => issue.message);
                              setPasswordErrors(errors);
                              toast.error("Password does not meet security requirements.");
                              return;
                    }

                    setIsSubmittingPassword(true);
                    const toastId = toast.loading("Verifying and updating security keys...");

                    const res = await updateAdminProfileAction(formData);

                    if (res.success) {
                              toast.success("Security override successful. Password changed.", { id: toastId });
                              setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
                              setPasswordErrors([]);
                              fetchAdminProfile();
                    } else {
                              toast.error(res.error || "Security override failed. Check current password.", { id: toastId });
                    }
                    setIsSubmittingPassword(false);
          };

          if (isLoading) {
                    return (
                              <div className="w-full max-w-6xl mx-auto min-h-[500px] flex justify-center items-center text-muted-foreground">
                                        <Loader2 className="w-8 h-8 animate-spin" />
                              </div>
                    );
          }

          return (
                    <div className="w-full max-w-6xl mx-auto space-y-6 min-h-[500px]">

                              {/* Header */}
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                                  <h2 className="text-3xl font-semibold text-foreground tracking-tight">System Configuration</h2>
                                                  <p className="text-sm text-muted-foreground mt-1">Manage core super-admin credentials, authorization keys, and security audit.</p>
                                        </div>
                                        <Button variant="outline" onClick={fetchAdminProfile} className="rounded-full px-5 h-9 shadow-sm cursor-pointer">
                                                  <RefreshCw className="w-4 h-4 mr-2" /> Refresh Data
                                        </Button>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

                                        {/* LEFT SIDE: Identity & Activity */}
                                        <div className="lg:col-span-2 flex flex-col gap-6">

                                                  {/* ⚡ FORM 1: Identity Profile Card */}
                                                  <form onSubmit={handleProfileSubmit} className="bg-card border border-border/50 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                                                            <div className="p-6 sm:p-8 flex-grow">

                                                                      {/* Header Visual Gap Increased (mb-8) */}
                                                                      <div className="flex items-center gap-2 border-b border-border/50 pb-4 mb-8">
                                                                                <User className="w-4 h-4 text-primary" />
                                                                                <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground">Identity Profile</h3>
                                                                      </div>

                                                                      {/* Stacked Fields with space-y-8 for visual clarity */}
                                                                      <div className="flex flex-col gap-8">
                                                                                {/* Label & Input Gap Increased (space-y-3) */}
                                                                                <div className="space-y-3">
                                                                                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Commander Name</label>
                                                                                          <Input
                                                                                                    value={formData.name}
                                                                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                                                                    placeholder="System Commander"
                                                                                                    className="rounded-xl border-border/60 bg-background/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 h-11 px-4 text-base"
                                                                                                    required
                                                                                          />
                                                                                </div>
                                                                                <div className="space-y-3">
                                                                                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Root Email Address</label>
                                                                                          <Input
                                                                                                    type="email"
                                                                                                    value={formData.email}
                                                                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                                                                    placeholder="admin@aireelgen.com"
                                                                                                    className="rounded-xl border-border/60 bg-background/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 h-11 px-4 text-base"
                                                                                                    required
                                                                                          />
                                                                                </div>
                                                                      </div>
                                                            </div>

                                                            {/* Action Footer */}
                                                            <div className="bg-muted/5 border-t border-border/50 p-5 flex justify-end">
                                                                      <Button type="submit" disabled={isSubmittingProfile} className="rounded-full px-6 h-10 shadow-sm cursor-pointer font-medium">
                                                                                {isSubmittingProfile ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Update Profile
                                                                      </Button>
                                                            </div>
                                                  </form>

                                                  {/* Activity Metrics Card */}
                                                  <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-6 sm:p-8">
                                                            <div className="flex items-center gap-2 border-b border-border/50 pb-4 mb-6">
                                                                      <History className="w-4 h-4 text-primary" />
                                                                      <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground">System Activity Logs</h3>
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                      <div className="bg-muted/20 border border-border/50 rounded-xl p-5 flex flex-col gap-1.5">
                                                                                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                                                                          <LogIn className="w-3.5 h-3.5" />
                                                                                          <span className="text-[10px] uppercase font-bold tracking-wider">Last Login Session</span>
                                                                                </div>
                                                                                <p className="text-sm font-semibold text-foreground">
                                                                                          {metrics.lastLoginAt ? new Date(metrics.lastLoginAt).toLocaleString() : "No login records yet"}
                                                                                </p>
                                                                      </div>
                                                                      <div className="bg-muted/20 border border-border/50 rounded-xl p-5 flex flex-col gap-1.5">
                                                                                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                                                                          <KeyRound className="w-3.5 h-3.5" />
                                                                                          <span className="text-[10px] uppercase font-bold tracking-wider">Last Password Change</span>
                                                                                </div>
                                                                                <p className="text-sm font-semibold text-foreground">
                                                                                          {metrics.lastPasswordChange ? new Date(metrics.lastPasswordChange).toLocaleString() : "Never changed"}
                                                                                </p>
                                                                      </div>
                                                            </div>
                                                  </div>

                                        </div>

                                        {/* RIGHT SIDE: Security Override */}
                                        <div className="lg:col-span-1">
                                                  {/* ⚡ FORM 2: Security Override Card */}
                                                  <form onSubmit={handlePasswordSubmit} className="bg-card border border-border/50 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
                                                            <div className="p-6 sm:p-8 flex-grow">

                                                                      <div className="flex items-center gap-2 border-b border-border/50 pb-4 mb-8">
                                                                                <Shield className="w-4 h-4 text-primary" />
                                                                                <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground">Security Override</h3>
                                                                      </div>

                                                                      <div className="flex flex-col gap-6">

                                                                                {/* Current Password */}
                                                                                <div className="space-y-3">
                                                                                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Current Password</label>
                                                                                          <div className="relative">
                                                                                                    <Input
                                                                                                              type={showCurrent ? "text" : "password"}
                                                                                                              value={formData.currentPassword}
                                                                                                              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                                                                                              placeholder="••••••••"
                                                                                                              className="rounded-xl border-border/60 bg-background/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 h-11 pr-10"
                                                                                                    />
                                                                                                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                                                                                                              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                                                    </button>
                                                                                          </div>
                                                                                </div>

                                                                                <div className="w-full h-px bg-border/50 my-1"></div>

                                                                                {/* New Password */}
                                                                                <div className="space-y-3">
                                                                                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">New Password</label>
                                                                                          <div className="relative">
                                                                                                    <Input
                                                                                                              type={showNew ? "text" : "password"}
                                                                                                              value={formData.newPassword}
                                                                                                              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                                                                                              placeholder="Strong password required"
                                                                                                              className={`rounded-xl bg-background/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 h-11 pr-10 ${passwordErrors.length > 0 ? "border-destructive/60" : "border-border/60"}`}
                                                                                                    />
                                                                                                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                                                                                                              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                                                    </button>
                                                                                          </div>
                                                                                          {/* Zod Validation Errors */}
                                                                                          {passwordErrors.length > 0 && (
                                                                                                    <div className="text-[10px] text-destructive bg-destructive/10 p-2.5 rounded-lg space-y-1 mt-2">
                                                                                                              {passwordErrors.map((err, i) => <p key={i}>• {err}</p>)}
                                                                                                    </div>
                                                                                          )}
                                                                                </div>

                                                                                {/* Confirm Password */}
                                                                                <div className="space-y-3">
                                                                                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Confirm New Pass</label>
                                                                                          <div className="relative">
                                                                                                    <Input
                                                                                                              type={showConfirm ? "text" : "password"}
                                                                                                              value={formData.confirmPassword}
                                                                                                              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                                                                              placeholder="Re-type password"
                                                                                                              className="rounded-xl border-border/60 bg-background/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 h-11 pr-10"
                                                                                                    />
                                                                                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                                                                                                              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                                                    </button>
                                                                                          </div>
                                                                                </div>

                                                                      </div>

                                                            </div>

                                                            {/* Action Footer */}
                                                            <div className="bg-muted/5 border-t border-border/50 p-5 flex justify-end mt-auto">
                                                                      <Button type="submit" disabled={isSubmittingPassword} className="rounded-full px-6 h-10 shadow-sm cursor-pointer font-medium bg-primary text-primary-foreground">
                                                                                {isSubmittingPassword ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Update Password
                                                                      </Button>
                                                            </div>
                                                  </form>
                                        </div>

                              </div>
                    </div>
          );
}