"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { BookOpen, Sparkles, Lock, Mail, User as UserIcon, ArrowRight, CheckCircle2, Award } from "lucide-react";

export default function LoginPage() {
  const { login, register, demoLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!displayName.trim()) {
          throw new Error("Please enter your name or student handle.");
        }
        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters long.");
        }
        await register(email, password, displayName);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setDemoLoading(true);
    try {
      await demoLogin();
    } catch (err: any) {
      setError(err.message || "Failed to log in with demo account.");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-[#f5f1ea] text-stone-800 relative overflow-hidden font-sans">
      {/* Background ambient nostalgic textures */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-5xl bg-white/90 backdrop-blur-xl border border-stone-200/80 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Side: Nostalgic Study Art & Motivation */}
        <div className="lg:col-span-5 bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 p-8 sm:p-10 flex flex-col justify-between text-amber-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <Image
              src="/nostalgic_study_motivation.jpg"
              alt="Nostalgic Study Desk"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Top badge */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-medium tracking-wide mb-6">
              <Sparkles size={14} className="text-amber-400" />
              <span>Student Focus & Discipline System</span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/30 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <BookOpen size={20} />
              </div>
              <h1 className="text-2xl font-serif font-bold tracking-tight text-white">
                Habit Journal
              </h1>
            </div>
            <p className="text-stone-300 text-sm leading-relaxed mt-2 font-serif italic">
              "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
            </p>
          </div>

          {/* Center Nostalgic Image Preview Card */}
          <div className="relative z-10 my-6 rounded-2xl overflow-hidden border border-amber-400/20 shadow-lg group">
            <div className="relative h-44 w-full">
              <Image
                src="/nostalgic_study_motivation.jpg"
                alt="Study Desk"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-xs text-amber-200/90 font-serif">
                <div className="flex items-center gap-1.5 font-medium text-amber-100">
                  <CheckCircle2 size={13} className="text-amber-400" />
                  <span>The Quiet Joy of Daily Progress</span>
                </div>
                <span className="text-[11px] opacity-75">Every tick in your sheet builds your future.</span>
              </div>
            </div>
          </div>

          {/* Bottom Student Perks */}
          <div className="relative z-10 pt-4 border-t border-stone-700/60 text-xs text-stone-300 space-y-2">
            <div className="flex items-center gap-2">
              <Award size={14} className="text-amber-400 shrink-0" />
              <span>Full spreadsheet grid habit tracking with monthly goals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span>Visual Shelves & Folders drawer with daily works</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login / Register Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-stone-50/50">
          <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
                {isRegister ? "Join as a Student" : "Welcome Back"}
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                {isRegister
                  ? "Create your habit tracking journal & set your monthly targets."
                  : "Log in to check off today's habits and view your progress."}
              </p>
            </div>

            {/* Quick Demo Access Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={demoLoading || loading}
              className="w-full mb-6 py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300/80 text-amber-900 text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow"
            >
              <Sparkles size={16} className="text-amber-600 animate-pulse" />
              {demoLoading ? "Preparing Demo Desk…" : "⚡ 1-Click Student Demo Login"}
            </button>

            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-stone-200 w-full"></div>
              <span className="bg-stone-50 px-3 text-xs uppercase tracking-wider text-stone-400 font-medium">
                or continue with credentials
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
                <span className="font-bold">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Your Name / Student Handle
                  </label>
                  <div className="relative">
                    <UserIcon size={16} className="absolute left-3.5 top-3.5 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Alex Mercer"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 bg-white text-stone-900 text-sm outline-none transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 bg-white text-stone-900 text-sm outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isRegister ? "At least 8 characters" : "••••••••"}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 bg-white text-stone-900 text-sm outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || demoLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-700 via-stone-800 to-amber-900 hover:from-amber-800 hover:to-stone-900 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{isRegister ? "Create Account & Start Tracking" : "Sign In to Your Desk"}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Toggle sign in / sign up */}
            <div className="mt-6 pt-5 border-t border-stone-200/80 text-center">
              <p className="text-sm text-stone-600">
                {isRegister ? "Already registered your journal?" : "Don't have an account yet?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setError(null);
                  }}
                  className="font-semibold text-amber-800 hover:text-amber-950 underline underline-offset-4 transition"
                >
                  {isRegister ? "Sign in instead" : "Create one now"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
