"use client";

import React, { useRef } from "react";
import { Download, Upload } from "lucide-react";
import { mutate } from "swr";
import { api } from "@/lib/api";

export function BackupButtons() {
  const fileRef = useRef<HTMLInputElement>(null);

  const download = () => {
    const blob = new Blob([api.backup.exportJson()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `habit-journal-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const restore = async (file?: File) => {
    if (!file) return;
    try {
      api.backup.importJson(await file.text());
      await mutate(() => true); // refresh every SWR cache
    } catch (err: any) {
      alert(err.message || "Could not read that file.");
    }
  };

  const btn = "p-1.5 rounded-lg text-stone-400 hover:text-amber-700 hover:bg-amber-50 transition";
  return (
    <div className="flex items-center">
      <button onClick={download} title="Download backup" className={btn}>
        <Download size={15} />
      </button>
      <button onClick={() => fileRef.current?.click()} title="Restore from backup" className={btn}>
        <Upload size={15} />
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        hidden
        onChange={(e) => {
          restore(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
