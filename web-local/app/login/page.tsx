"use client";

import React, { useState } from "react";
import { BookOpen, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function WelcomePage() {
  const { setName } = useAuth();
  const [name, setLocalName] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f5f1ea] text-stone-800">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) setName(name.trim());
        }}
        className="w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-xl p-8 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <BookOpen size={20} />
          </div>
          <h1 className="text-2xl font-serif font-bold">Habit Journal</h1>
        </div>

        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
          What should we call you?
          <input
            autoFocus
            required
            value={name}
            onChange={(e) => setLocalName(e.target.value)}
            placeholder="e.g. Alex"
            className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm normal-case tracking-normal"
          />
        </label>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-sm font-medium flex items-center justify-center gap-2"
        >
          Start tracking <ArrowRight size={16} />
        </button>

        <p className="flex items-start gap-2 text-xs text-stone-500">
          <ShieldCheck size={14} className="text-emerald-600 shrink-0 mt-0.5" />
          Your habits are stored only in this browser. No account, no server. Use the backup button
          to move them to another device.
        </p>
      </form>
    </div>
  );
}
