"use client";

/**
 * @file components/dashboard/views/settings/AdminSettings.tsx
 * @description System Configuration view. Reads admin profile from DashboardDataContext cache.
 * After a successful profile/password update, invalidate() purges the cache.
 */

import { updateAdminProfileAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2, RefreshCw, Save, Shield, User,
  History, LogIn, KeyRound, Eye, EyeOff,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import SystemLoader from "@/components/dashboard/shared/SystemLoader";
import DataErrorState from "@/components/dashboard/shared/DataErrorState";

const passwordSchema = z
  .string()
  .min(8, "Minimum 8 characters required")
  .max(32, "Maximum 32 characters allowed")
  .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
  .regex(/[a-z]/, "Must contain at least 1 lowercase letter")
  .regex(/[0-9]/, "Must contain at least 1 number")
  .regex(/[\W_]/, "Must contain at least 1 special character");

interface FormData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AdminSettings() {
  const { data: admin, isLoading, error, invalidate } = useDashboardData("settings");

  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Sync form fields whenever cached admin data becomes available
  useEffect(() => {
    if (admin) {
      setFormData((prev) => ({
        ...prev,
        name: admin.name || "",
        email: admin.email || "",
      }));
    }
  }, [admin]);

  if (isLoading) return <SystemLoader message="Loading system configuration..." />;
  if (error) return <DataErrorState message={error} onRetry={invalidate} />;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProfile(true);
    const toastId = toast.loading("Updating identity profile...");
    const res = await updateAdminProfileAction({ name: formData.name, email: formData.email });
    if (res.success) {
      toast.success("Profile updated successfully.", { id: toastId });
      invalidate();
    } else {
      toast.error(res.error || "Failed to update profile.", { id: toastId });
    }
    setIsSubmittingProfile(false);
  };

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

    const validation = passwordSchema.safeParse(formData.newPassword);
    if (!validation.success) {
      setPasswordErrors(validation.error.issues.map((i) => i.message));
      toast.error("Password does not meet security requirements.");
      return;
    }

    setIsSubmittingPassword(true);
    const toastId = toast.loading("Verifying and updating security keys...");
    const res = await updateAdminProfileAction({
      name: formData.name,
      email: formData.email,
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });

    if (res.success) {
      toast.success("Security override successful. Password changed.", { id: toastId });
      setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      setPasswordErrors([]);
      invalidate();
    } else {
      toast.error(res.error || "Security override failed. Check current password.", { id: toastId });
    }
    setIsSubmittingPassword(false);
  };

  const metrics = {
    lastLoginAt: admin?.lastLoginAt ? String(admin.lastLoginAt) : null,
    lastPasswordChange: admin?.lastPasswordChange ? String(admin.lastPasswordChange) : null,
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 min-h-[500px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-foreground tracking-tight">System Configuration</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage core super-admin credentials, authorization keys, and security audit.</p>
        </div>
        <Button variant="outline" onClick={invalidate} className="rounded-full px-5 h-9 shadow-sm cursor-pointer">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* LEFT: Identity + Activity */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* FORM 1: Identity Profile */}
          <form onSubmit={handleProfileSubmit} className="bg-card border border-border/50 rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 sm:p-8 flex-grow">
              <div className="flex items-center gap-2 border-b border-border/50 pb-4 mb-8">
                <User className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground">Identity Profile</h3>
              </div>
              <div className="flex flex-col gap-8">
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
            <div className="bg-muted/5 border-t border-border/50 p-5 flex justify-end">
              <Button type="submit" disabled={isSubmittingProfile} className="rounded-full px-6 h-10 shadow-sm cursor-pointer font-medium">
                {isSubmittingProfile ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Update Profile
              </Button>
            </div>
          </form>

          {/* Activity Metrics */}
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

        {/* RIGHT: Security Override */}
        <div className="lg:col-span-1">
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
                    <Input type={showCurrent ? "text" : "password"} value={formData.currentPassword} onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })} placeholder="••••••••" className="rounded-xl border-border/60 bg-background/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 h-11 pr-10" />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="w-full h-px bg-border/50 my-1" />
                {/* New Password */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">New Password</label>
                  <div className="relative">
                    <Input type={showNew ? "text" : "password"} value={formData.newPassword} onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} placeholder="Strong password required" className={`rounded-xl bg-background/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 h-11 pr-10 ${passwordErrors.length > 0 ? "border-destructive/60" : "border-border/60"}`} />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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
                    <Input type={showConfirm ? "text" : "password"} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="Re-type password" className="rounded-xl border-border/60 bg-background/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 h-11 pr-10" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
