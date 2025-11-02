import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type WorkoutType = 'crossfit' | 'totalGym' | 'chair-yoga';

type Ctx = {
  workoutType: WorkoutType;
  setWorkoutType: (t: WorkoutType) => void;
};

const KEY = 'workoutType';

const C = createContext<Ctx | null>(null);

export function WorkoutTypeProvider({ children }: { children: React.ReactNode }) {
  const [workoutType, setWorkoutTypeState] = useState<WorkoutType>(() => {
    const v = (typeof localStorage !== 'undefined' && localStorage.getItem(KEY)) as WorkoutType | null;
    return (v === 'crossfit' || v === 'totalGym' || v === 'chair-yoga') ? v : 'crossfit';
  });

  const setWorkoutType = (t: WorkoutType) => {
    setWorkoutTypeState(t);
    try { localStorage.setItem(KEY, t); } catch { /* ignore */ }
  };

  const value = useMemo(() => ({ workoutType, setWorkoutType }), [workoutType]);

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useWorkoutType() {
  const ctx = useContext(C);
  if (!ctx) throw new Error('useWorkoutType must be used within WorkoutTypeProvider');
  return ctx;
}
