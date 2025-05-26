import { writable } from "svelte/store";

export type Rhythm = {
  label: string;
  work: number;
  shortBreak: number;
  longBreak: number;
};

export type Rhythms = {
  [key: string]: Rhythm;
};

export const defaultRhythms: Rhythms = {
  pomodoro: { label: "Pomodoro", work: 25, shortBreak: 5, longBreak: 15 },
  ultradian: { label: "Ultradian", work: 90, shortBreak: 20, longBreak: 30 },
  desktime: { label: "Desktime", work: 52, shortBreak: 17, longBreak: 30 },
};

const loadSavedRhythms = (): Rhythms => {
  if (typeof window === "undefined") return defaultRhythms;
  const saved = localStorage.getItem("pomodorini-rhythms");
  console.log("Loading saved rhythms:", saved);
  if (!saved) return defaultRhythms;
  try {
    const parsed = JSON.parse(saved);
    console.log("Parsed saved rhythms:", parsed);
    return { ...defaultRhythms, ...parsed };
  } catch (e) {
    console.error("Failed to load saved rhythms:", e);
    return defaultRhythms;
  }
};

export const rhythms = writable<Rhythms>(loadSavedRhythms());

export function addOrUpdateRhythm(key: string, rhythm: Rhythm) {
  console.log("Adding/updating rhythm:", key, rhythm);
  rhythms.update((r) => {
    const updated = { ...r, [key]: rhythm };
    if (typeof window !== "undefined") {
      const toSave = JSON.stringify(updated);
      console.log("Saving to localStorage:", toSave);
      localStorage.setItem("pomodorini-rhythms", toSave);
    }
    return updated;
  });
}
