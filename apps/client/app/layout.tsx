// app/layout.tsx
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/context/auth/AuthContext"; // ⚡ Sirf AuthProvider Import
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner"; // ⚡ Toaster yahan aagaya
import "./globals.css";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

const fontHeadline = Outfit({ subsets: ["latin"], variable: "--font-headline", display: "swap" });
const fontBody = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "Aireelgen | Next-Gen AI Video",
  description: "Distill Motion into Gold with Aireelgen",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("light", jetbrainsMono.variable, "font-sans", geist.variable)} suppressHydrationWarning>
      <body className={`${fontBody.variable} ${fontHeadline.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* ⚡ Auth state puri app mein global chahiye */}
          <AuthProvider>
            {children}
            <Toaster position="bottom-right" richColors theme="dark" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}