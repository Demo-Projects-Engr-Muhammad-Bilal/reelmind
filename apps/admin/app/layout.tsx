// app/layout.tsx
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider"; // Tumhara exact path
import "./globals.css";
import { Toaster } from "sonner"; // ⚡ FIX: Direct sonner package import kiya
// ⚡ FIX: Variable ka naam '--font-sans' rakhna zaroori hai Shadcn ke liye
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "Reelmind | Management Hub",
  description: "Secure Admin Login Portal for ReelMind",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* ⚡ FIX: poppins.variable pass kiya aur font-sans class lagayi */}
      <body className={`${poppins.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster richColors position="bottom-right" theme="system" />        
          </ThemeProvider>
      </body>
    </html>
  );
}