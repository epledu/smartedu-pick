"use client";

/**
 * useGoals
 *
 * Custom React hook that wraps CRUD operations for savings/spending goals.
 * Provides local state management for the goal list, loading, and error.
 */
import { useState, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GoalCategory {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

export type GoalStatus = "ACTIVE" | "COMPLETED" | "FAILED" | "PAUSED";

export interface Goal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  remaining: number;
  percent: number;
  daysRemaining: number;
  categoryId: string | null;
  category: GoalCategory | null;
  startDate: string;
  endDate: string;
  status: GoalStatus;
  icon: string | null;
  color: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalData {
  title: string;
  targetAmount: number;
  currentAmount?: number;
  categoryId?: string;
  startDate: string;
  endDate: string;
  icon?: string;
  color?: string;
}

export interface UpdateGoalData {
  title?: string;
  targetAmount?: number;
  currentAmount?: number;
  status?: GoalStatus;
  endDate?: string;
  icon?: string;
  color?: string;
  categoryId?: string | null;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all goals for the current user
  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/goals");
      if (!res.ok) throw new Error("Failed to fetch goals");
      const data: Goal[] = await res.json();
      setGoals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new goal and prepend it to the list
  const createGoal = useCallback(async (data: CreateGoalData): Promise<Goal | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to create goal");
      }
      const goal: Goal = await res.json();
      setGoals((prev) => [goal, ...prev]);
      return goal;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a goal and refresh it in the list
  const updateGoal = useCallback(async (
    id: string,
    data: UpdateGoalData
  ): Promise<Goal | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/goals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to update goal");
      }
      const goal: Goal = await res.json();
      setGoals((prev) => prev.map((g) => (g.id === id ? goal : g)));
      return goal;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove a goal from the list
  const deleteGoal = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to delete goal");
      }
      setGoals((prev) => prev.filter((g) => g.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    goals,
    loading,
    error,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
  };
}
