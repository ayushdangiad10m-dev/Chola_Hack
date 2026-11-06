import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Invalid date";
  }
}

export function formatRelativeDeadline(deadline: string | Date | null | undefined, referenceDate?: Date): {
  text: string;
  isUrgent: boolean;
  isOverdue: boolean;
} {
  if (!deadline) return { text: "No deadline", isUrgent: false, isOverdue: false };
  try {
    const target = typeof deadline === "string" ? new Date(deadline) : deadline;
    const now = referenceDate || new Date("2026-11-05T00:00:00Z");
    const diffMs = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)}d overdue`, isUrgent: true, isOverdue: true };
    }
    if (diffDays === 0) {
      return { text: "Due today", isUrgent: true, isOverdue: false };
    }
    if (diffDays === 1) {
      return { text: "Due tomorrow", isUrgent: true, isOverdue: false };
    }
    if (diffDays <= 3) {
      return { text: `${diffDays} days left`, isUrgent: true, isOverdue: false };
    }
    return { text: `${diffDays} days left`, isUrgent: false, isOverdue: false };
  } catch {
    return { text: "Invalid date", isUrgent: false, isOverdue: false };
  }
}
