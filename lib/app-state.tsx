"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  useCallback,
  ReactNode,
} from "react";

type Feedback = "up" | "down" | null;

interface Metrics {
  /** KPI: total number of times the save/bookmark button has been clicked (any direction) */
  saveClicks: number;
  /** KPI: total number of times the 추천/비추천 buttons have been clicked (any direction) */
  feedbackClicks: number;
}

interface StoredState {
  savedIds: string[];
  feedback: Record<string, Feedback>;
  metrics: Metrics;
}

const STORAGE_KEY = "runcourse-app-state";
const EMPTY_STATE: StoredState = {
  savedIds: [],
  feedback: {},
  metrics: { saveClicks: 0, feedbackClicks: 0 },
};

let state: StoredState = EMPTY_STATE;
let initialized = false;
const listeners = new Set<() => void>();

function loadFromStorage(): StoredState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    return {
      savedIds: parsed.savedIds ?? [],
      feedback: parsed.feedback ?? {},
      metrics: {
        saveClicks: parsed.metrics?.saveClicks ?? 0,
        feedbackClicks: parsed.metrics?.feedbackClicks ?? 0,
      },
    };
  } catch {
    return EMPTY_STATE;
  }
}

function persist() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function commit(next: StoredState) {
  state = next;
  persist();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): StoredState {
  if (!initialized) {
    state = loadFromStorage();
    initialized = true;
  }
  return state;
}

function getServerSnapshot(): StoredState {
  return EMPTY_STATE;
}

function toggleSavedId(id: string) {
  const savedIds = state.savedIds.includes(id)
    ? state.savedIds.filter((x) => x !== id)
    : [...state.savedIds, id];
  commit({
    ...state,
    savedIds,
    metrics: { ...state.metrics, saveClicks: state.metrics.saveClicks + 1 },
  });
}

function setFeedbackValue(id: string, value: Feedback) {
  commit({
    ...state,
    feedback: { ...state.feedback, [id]: value },
    metrics: {
      ...state.metrics,
      feedbackClicks: state.metrics.feedbackClicks + 1,
    },
  });
}

interface AppState {
  savedIds: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  feedback: Record<string, Feedback>;
  setFeedback: (id: string, value: Feedback) => void;
  metrics: Metrics;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isSaved = useCallback(
    (id: string) => snapshot.savedIds.includes(id),
    [snapshot.savedIds]
  );

  const value: AppState = {
    savedIds: snapshot.savedIds,
    toggleSaved: toggleSavedId,
    isSaved,
    feedback: snapshot.feedback,
    setFeedback: setFeedbackValue,
    metrics: snapshot.metrics,
  };

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
