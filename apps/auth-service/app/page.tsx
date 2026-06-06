"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Braces, ChevronDown, Code2, Cpu, Fingerprint, Globe,
  Lock, Moon, ShieldCheck, Sun, Terminal, UserPlus, Zap, LogOut, LucideIcon,
  BookOpen, AlertCircle, Play, RefreshCw, KeyRound, Mail, Settings2
} from "lucide-react";
import { useTheme } from "next-themes";
import { Poppins } from "next/font/google";
import Link from "next/link";

// 🖋| Poppins Setup - No Italics, Pure Professional Hierarchy
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: 'normal'
});

// --- API Schema & Data ---

interface ApiEndpoint {
  id: string;
  method: "POST" | "GET";
  path: string;
  icon: LucideIcon;
  title: string;
  shortDesc: string;
  readme: {
    purpose: string;
    auth: string;
    statusCodes: { code: string; label: string }[];
  };
  testData: any;
}

const API_DOCS: ApiEndpoint[] = [
  {
    id: "signup",
    method: "POST",
    path: "/api/auth/signup",
    icon: UserPlus,
    title: "User Registration",
    shortDesc: "Registers a new identity with default credits.",
    readme: {
      purpose: "Creates user record, hashes password (bcrypt), and dispatches a 1-hour verification token via Resend.",
      auth: "Public",
      statusCodes: [{ code: "201", label: "Created" }, { code: "409", label: "Conflict" }]
    },
    testData: { name: "Bilal Test", email: "dev_test@aireelgen.com", password: "12qa!@QA" }
  },
  {
    id: "login",
    method: "POST",
    path: "/api/auth/login",
    icon: KeyRound,
    title: "Identity Verification",
    shortDesc: "Authenticates credentials and manages sessions.",
    readme: {
      purpose: "Verifies password and updates currentSessionId for Singleton security logic.",
      auth: "Public - Issues Auth Cookie",
      statusCodes: [{ code: "200", label: "Success" }, { code: "401", label: "Invalid" }]
    },
    testData: { email: "muhammadbilal41266@gmail.com", password: "12qa!@QZ" }
  },
  {
    id: "resend",
    method: "POST",
    path: "/api/auth/resend-verify",
    icon: Mail,
    title: "Resend Verification",
    shortDesc: "Regenerates verification tokens.",
    readme: {
      purpose: "Issues a new verification link if the previous one has expired.",
      auth: "Public",
      statusCodes: [{ code: "200", label: "Sent" }, { code: "404", label: "User Not Found" }]
    },
    testData: { email: "muhammadbilal41266@gmail.com" }
  },
  {
    id: "forgot",
    method: "POST",
    path: "/api/auth/forgot-password",
    icon: Fingerprint,
    title: "Forgot Password",
    shortDesc: "Initiates secure account recovery.",
    readme: {
      purpose: "Dispatches a 15-minute recovery token to the registered email address.",
      auth: "Public - Privacy Safe",
      statusCodes: [{ code: "200", label: "Link Sent" }]
    },
    testData: { email: "muhammadbilal41266@gmail.com" }
  },
  {
    id: "reset",
    method: "POST",
    path: "/api/auth/reset-password",
    icon: Settings2,
    title: "Reset Password",
    shortDesc: "Finalizes the recovery flow with a new password.",
    readme: {
      purpose: "Verifies reset token and updates password in DB, clearing the reset session.",
      auth: "Valid Token Required",
      statusCodes: [{ code: "200", label: "Updated" }, { code: "400", label: "Invalid Token" }]
    },
    testData: { token: "token_123", password: "new_password_2026" }
  },
  {
    id: "google",
    method: "POST",
    path: "/api/auth/google",
    icon: Globe,
    title: "Google OAuth Sync",
    shortDesc: "Social authentication and profile sync.",
    readme: {
      purpose: "Exchanges Google OAuth code for profile data and creates/syncs user identity.",
      auth: "OAuth Provider",
      statusCodes: [{ code: "200", label: "Sync OK" }, { code: "500", label: "Provider Error" }]
    },
    testData: { code: "4/0AeanS..." }
  },
  {
    id: "validate",
    method: "GET",
    path: "/api/auth/validate-session",
    icon: ShieldCheck,
    title: "Session Integrity",
    shortDesc: "Validates active JWT and session ID.",
    readme: {
      purpose: "Cross-references active JWT against DB session to prevent multi-device conflicts.",
      auth: "Required (Cookie)",
      statusCodes: [{ code: "200", label: "Valid" }, { code: "401", label: "Expired" }]
    },
    testData: null
  },
  {
    id: "logout",
    method: "POST",
    path: "/api/auth/logout",
    icon: LogOut,
    title: "Logout Service",
    shortDesc: "Terminates session and clears cookies.",
    readme: {
      purpose: "Clears auth_token and terminates server-side session persistence.",
      auth: "Required",
      statusCodes: [{ code: "200", label: "Logged Out" }]
    },
    testData: {}
  }
];

// --- Specialized Components ---

const TechnicalBadge = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{label}</span>
    <span className="text-[11px] font-bold text-foreground">{value}</span>
  </div>
);

const ResponseBox = ({ title, data, icon: Icon, colorClass, isLive = false }: any) => (
  <div className="space-y-3">
    <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 opacity-70">
      <Icon className="w-3 h-3" /> {title}
    </h4>
    <div className={`relative bg-slate-100 dark:bg-zinc-900/50 p-5 rounded-2xl border ${isLive ? 'border-primary/40' : 'border-border'} font-mono text-[11px] leading-relaxed shadow-inner overflow-x-auto min-h-[60px] cursor-text`}>
      <pre className={colorClass}>{typeof data === 'string' ? data : JSON.stringify(data, null, 2)}</pre>
      {isLive && data && <span className="absolute top-2 right-3 text-[8px] font-black uppercase text-primary animate-pulse tracking-widest">Live Response</span>}
    </div>
  </div>
);

// --- Main Page Component ---

export default function AuthDocs() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openItem, setOpenItem] = useState<string | null>("signup");

  // Playground States
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => setMounted(true), []);

  const triggerTest = async (item: ApiEndpoint) => {
    setLoading(prev => ({ ...prev, [item.id]: true }));
    let payload: any = item.testData ? { ...item.testData } : {};

    // Auto-generate email for Signup to prevent conflict errors
    if (item.id === "signup") {
      payload.email = `dev_test_${Math.floor(Math.random() * 10000)}@aireelgen.com`;
    }

    try {
      const options: RequestInit = {
        method: item.method,
        headers: { "Content-Type": "application/json" },
      };
      if (item.method === "POST" && Object.keys(payload).length > 0) {
        options.body = JSON.stringify(payload);
      }
      const res = await fetch(item.path, options);
      const data = await res.json();
      setTestResults(prev => ({ ...prev, [item.id]: data }));
    } catch (err) {
      setTestResults(prev => ({ ...prev, [item.id]: { error: "Connection Failed. Check Server." } }));
    } finally {
      setLoading(prev => ({ ...prev, [item.id]: false }));
    }
  };

  if (!mounted) return null;

  return (
    <div className={`${poppins.className} min-h-screen bg-background text-foreground transition-colors duration-500 relative selection:bg-primary/30`}>

      {/* 🚀 Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-500">Service Operational</span>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 rounded-full border border-border/60 bg-secondary/20 flex items-center justify-center hover:border-primary transition-all cursor-pointer"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-primary" />}
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 relative z-10">

        {/* Hero */}
        <header className="mb-20">
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
            Auth <span className="text-primary drop-shadow-[0_0_15px_rgba(132,85,239,0.3)] ml-2">Micro-service</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl font-medium leading-relaxed">
            Full API Registry & Technical Manual for AIreelgen. Standardizing identity through high-performance session architecture.
          </p>
        </header>

        {/* 📊 System Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          {[
            { icon: Lock, label: "Encryption", val: "HS256 JWT" },
            { icon: Zap, label: "Latency", val: "<150ms" },
            { icon: Cpu, label: "Engine", val: "Turbopack" },
            { icon: ShieldCheck, label: "Security", val: "Singleton" },
          ].map((m, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="p-8 rounded-[1.8rem] bg-white dark:bg-secondary/10 border border-border shadow-sm cursor-pointer transition-all hover:border-primary/40 group">
              <m.icon className="w-7 h-7 text-primary mb-8 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-1">{m.label}</p>
              <h3 className="text-lg font-black uppercase text-foreground">{m.val}</h3>
            </motion.div>
          ))}
        </div>

        {/* 📚 Endpoint Registry */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-10 pl-2">
            <Terminal className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-black uppercase tracking-tight">Endpoint Documentation registry</h2>
          </div>

          {API_DOCS.map((item) => (
            <div
              key={item.id}
              className={`rounded-[2rem] border transition-all duration-300 ${openItem === item.id ? 'border-primary/50 bg-white dark:bg-secondary/30 shadow-2xl' : 'border-border bg-slate-50/50 dark:bg-secondary/5 hover:bg-slate-50 dark:hover:bg-secondary/10'}`}
            >
              <button
                onClick={() => setOpenItem(openItem === item.id ? null : item.id)}
                className="w-full px-6 md:px-10 py-7 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-6 text-left">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${openItem === item.id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-background border-border text-primary'}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded border border-primary/20 text-primary bg-primary/10 uppercase tracking-widest">{item.method}</span>
                      <span className="font-mono text-xs opacity-50 font-bold">{item.path}</span>
                    </div>
                    <h3 className="text-lg font-extrabold uppercase tracking-tight text-foreground">{item.title}</h3>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-500 ${openItem === item.id ? 'rotate-180 text-primary' : ''}`} />
              </button>

              <AnimatePresence>
                {openItem === item.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-6 md:px-10 pb-10 pt-2 space-y-10 border-t border-border/10">

                      {/* Technical Info (README) */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                        <div className="md:col-span-2 space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2"><BookOpen className="w-3 h-3" /> Technical Manual</h4>
                          <p className="text-muted-foreground text-sm font-medium leading-relaxed">{item.readme.purpose}</p>
                          <p className="text-xs text-muted-foreground/60">{item.shortDesc}</p>
                        </div>
                        <div className="bg-slate-100/50 dark:bg-black/20 p-6 rounded-2xl border border-border space-y-5 shadow-inner">
                          <TechnicalBadge label="Authorization" value={item.readme.auth} />
                          <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Possible Status Codes</span>
                            <div className="flex flex-wrap gap-2">
                              {item.readme.statusCodes.map(s => (
                                <span key={s.code} className="text-[9px] font-bold px-2 py-1 rounded bg-background border border-border" title={s.label}>{s.code}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Playground System */}
                      <div className="bg-primary/[0.03] rounded-3xl border border-primary/10 p-8 space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black uppercase tracking-tighter flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary" /> API Playground
                          </h4>
                          <button
                            onClick={() => triggerTest(item)}
                            disabled={loading[item.id]}
                            className="px-6 py-2 bg-primary text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-xl shadow-primary/20"
                          >
                            {loading[item.id] ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                            {loading[item.id] ? "Processing..." : "Run Test"}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <ResponseBox title="Request Schema" data={item.testData || "// Body not required"} icon={Braces} colorClass="text-blue-600 dark:text-blue-400" />
                          <ResponseBox title="Live Response" data={testResults[item.id] || "// Execute to see response"} icon={Zap} colorClass={testResults[item.id]?.success || testResults[item.id]?.valid ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'} isLive />
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <footer className="mt-32 pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 selection:bg-primary/30">
          <p className="text-[10px] font-black uppercase tracking-[0.4em]">Aireelgen Security Protocol v4.0.21</p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
            <span>Next.js 16</span>
            <span>Prisma Engine</span>
            <span>Jose JWT</span>
          </div>
        </footer>
      </main>
    </div>
  );
}