import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { AuthGuard } from "@/components/AuthGuard";
import { NavBar } from "@/components/NavBar";
import { SideBoard } from "@/components/SideBoard";

export const metadata: Metadata = {
  title: "Habit Journal - Student Focus & Discipline",
  description: "A nostalgic student habit journal with daily works spreadsheets, monthly analytics, and visual shelves.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans antialiased selection:bg-amber-200 selection:text-amber-950">
        <AuthProvider>
          <AuthGuard>
            <div className="min-h-screen flex flex-col relative overflow-x-hidden">
              <NavBar />
              <main className="flex-1 mx-auto w-full max-w-[1600px] px-4 sm:px-6 py-6 sm:py-8">
                {children}
              </main>
              <SideBoard />
            </div>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
