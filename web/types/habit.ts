export interface Habit {
  id: string;
  name: string;
  monthlyGoal: number;
  sortOrder: number;
  isArchived: boolean;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string; // ISO yyyy-mm-dd
  completed: boolean;
}

export interface DailyProgressPoint {
  date: string;
  percent: number;
}

export interface WeeklyBucket {
  weekLabel: string;
  completed: number;
  goal: number;
  left: number;
  percent: number;
}

export interface MonthlySummary {
  completed: number;
  total: number;
  percent: number;
}

export interface TopHabit {
  name: string;
  completions: number;
}

export interface HabitProgressRow {
  name: string;
  completed: number;
  left: number;
  percent: number;
}

export interface OverviewResponse {
  dailyProgress: DailyProgressPoint[];
  weekly: WeeklyBucket[];
  monthly: MonthlySummary;
  topHabits: TopHabit[];
  habitProgress: HabitProgressRow[];
}
