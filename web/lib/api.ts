import type { Habit, HabitEntry, OverviewResponse } from "@/types/habit";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...authHeaders(), ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  habits: {
    list: () => request<Habit[]>("/habits"),
    create: (data: Partial<Habit>) => request<Habit>("/habits", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Habit>) =>
      request<Habit>(`/habits/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    remove: (id: string) => request<void>(`/habits/${id}`, { method: "DELETE" }),
    reorder: (rows: { id: string; sortOrder: number }[]) =>
      request<void>("/habits/reorder/bulk", { method: "PATCH", body: JSON.stringify(rows) }),
  },
  entries: {
    listForMonth: (year: number, month: number) =>
      request<HabitEntry[]>(`/entries?year=${year}&month=${month}`),
    toggle: (habitId: string, date: string, completed: boolean) =>
      request<HabitEntry>("/entries/toggle", {
        method: "PUT",
        body: JSON.stringify({ habitId, date, completed }),
      }),
  },
  overview: {
    get: (year: number, month: number) => request<OverviewResponse>(`/overview?year=${year}&month=${month}`),
  },
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: { id: string; email: string; displayName?: string } }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (email: string, password: string, displayName?: string) =>
      request<{ token: string; user: { id: string; email: string; displayName?: string } }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, displayName }),
      }),
  },
};
