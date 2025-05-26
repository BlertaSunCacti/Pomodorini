import { derived, writable, get } from "svelte/store";
import { rhythms, type Rhythm, addOrUpdateRhythm } from "./rhythms";

export type RhythmType = "pomodoro" | "ultradian" | "desktime" | "custom";

interface RhythmSettings extends Rhythm {
  cyclesUntilLongBreak: number;
}

type BreakButton = "short" | "long" | null;

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  progress: number;

  isWork: boolean;
  activeBreakButton: BreakButton;
  cycleCount: number;
  currentRhythm: RhythmType;
  customSettings: RhythmSettings;
}

const DEFAULT_CUSTOM_SETTINGS: RhythmSettings = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
  label: "My Schedule",
  cyclesUntilLongBreak: 4,
};

function getSettings(state: TimerState): RhythmSettings {
  const rhythmConfig = get(rhythms)[state.currentRhythm];
  if (!rhythmConfig) {
    console.error(`No rhythm config found for ${state.currentRhythm}`);
    return {
      ...DEFAULT_CUSTOM_SETTINGS,
      cyclesUntilLongBreak: state.customSettings.cyclesUntilLongBreak,
    };
  }
  return {
    ...rhythmConfig,
    cyclesUntilLongBreak: state.customSettings.cyclesUntilLongBreak,
  };
}

function getTotalSeconds(state: TimerState, currentSettings: RhythmSettings): number {
  return state.isWork
    ? currentSettings.work * 60
    : (state.activeBreakButton === "long"
        ? currentSettings.longBreak
        : currentSettings.shortBreak) * 60;
}

function calculateProgress(
  state: TimerState,
  currentSettings: RhythmSettings,
  remainingSeconds: number
): number {
  const totalSeconds = getTotalSeconds(state, currentSettings);
  return state.isWork ? 1 - remainingSeconds / totalSeconds : remainingSeconds / totalSeconds;
}

function getInitialTimerState(
  state: TimerState,
  currentSettings: RhythmSettings
): Partial<TimerState> {
  return {
    minutes: state.isWork
      ? currentSettings.work
      : state.activeBreakButton === "long"
        ? currentSettings.longBreak
        : currentSettings.shortBreak,
    seconds: 0,
    progress: state.isWork ? 0 : 1,
  };
}

function transitionState(
  state: TimerState,
  settings: RhythmSettings,
  isLongBreak: boolean = false
): TimerState {
  const newState = { ...state };

  if (state.isWork) {
    newState.isWork = false;
    newState.activeBreakButton = isLongBreak ? "long" : "short";
    if (isLongBreak) {
      newState.cycleCount = 0;
    }
  } else {
    if (state.activeBreakButton === (isLongBreak ? "long" : "short")) {
      newState.isWork = true;
      newState.activeBreakButton = null;
    } else {
      newState.activeBreakButton = isLongBreak ? "long" : "short";
      if (isLongBreak) {
        newState.cycleCount = 0;
      }
    }
  }

  return {
    ...newState,
    ...getInitialTimerState(newState, settings),
  };
}

function createTimerStore() {
  const savedRhythms = get(rhythms);
  const initialState: TimerState = {
    minutes: savedRhythms.pomodoro.work,
    seconds: 0,
    isRunning: false,
    progress: 0,

    isWork: true,
    activeBreakButton: null,
    cycleCount: 0,
    currentRhythm: "pomodoro" as RhythmType,
    customSettings: {
      ...(savedRhythms.custom || DEFAULT_CUSTOM_SETTINGS),
      cyclesUntilLongBreak: 4,
    },
  };

  const store = writable<TimerState>(initialState);
  let interval: number | null = null;
  let animationFrameId: number | null = null;
  let startTime: number | null = null;
  let initialTotalSeconds: number | null = null;

  const { subscribe, update } = store;

  const currentSettings = derived(store, (state) => getSettings(state));
  const formattedTime = derived(
    store,
    (state) =>
      `${state.minutes.toString().padStart(2, "0")}:${state.seconds.toString().padStart(2, "0")}`
  );
  const sessionLabel = derived([store, currentSettings], ([state, settings]) =>
    state.isWork
      ? `Focus Time (Cycle ${state.cycleCount + 1}/${settings.cyclesUntilLongBreak})`
      : "Break Time"
  );

  function startTimer() {
    update((state) => {
      if (!state.isRunning) {
        const settings = getSettings(state);
        const totalSeconds = getTotalSeconds(state, settings);
        startTime = performance.now();
        initialTotalSeconds = totalSeconds;
        interval = setInterval(tick, 1000);
        if (animationFrameId === null) {
          updateProgress();
        }
        return { ...state, isRunning: true };
      }
      return state;
    });
  }

  function pauseTimer() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    update((state) => {
      if (startTime !== null && initialTotalSeconds !== null) {
        const elapsedSeconds = (performance.now() - startTime) / 1000;
        const remainingSeconds = Math.max(0, initialTotalSeconds - elapsedSeconds);
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = Math.floor(remainingSeconds % 60);
        return {
          ...state,
          isRunning: false,
          minutes,
          seconds,
        };
      }
      return { ...state, isRunning: false };
    });
    startTime = null;
    initialTotalSeconds = null;
  }

  function updateProgress() {
    animationFrameId = requestAnimationFrame(() => {
      update((state) => {
        if (!state.isRunning || startTime === null || initialTotalSeconds === null) return state;

        const elapsedSeconds = (performance.now() - startTime) / 1000;
        const remainingSeconds = Math.max(0, initialTotalSeconds - elapsedSeconds);
        const settings = getSettings(state);
        const newProgress = calculateProgress(state, settings, remainingSeconds);

        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = Math.floor(remainingSeconds % 60);

        return {
          ...state,
          minutes,
          seconds,
          progress: Math.max(0, Math.min(1, newProgress)),
        };
      });

      if (interval !== null) {
        updateProgress();
      }
    });
  }

  function tick() {
    update((state) => {
      if (startTime === null || initialTotalSeconds === null) return state;

      const elapsedSeconds = (performance.now() - startTime) / 1000;
      if (elapsedSeconds >= initialTotalSeconds) {
        const settings = getSettings(state);
        const newState = transitionState(
          state,
          settings,
          state.cycleCount % settings.cyclesUntilLongBreak === 0
        );
        pauseTimer();
        return newState;
      }
      return state;
    });
  }

  function resetTimer() {
    pauseTimer();
    update((state) => ({
      ...state,
      ...getInitialTimerState(state, getSettings(state)),
    }));
  }

  function toggleMode(isLongBreak: boolean = false) {
    update((state) => {
      const settings = getSettings(state);
      const newState = transitionState(state, settings, isLongBreak);

      const initialState = getInitialTimerState(newState, settings);
      Object.assign(newState, initialState);

      startTime = null;
      initialTotalSeconds = null;

      return newState;
    });
    pauseTimer();
  }

  function setRhythm(type: RhythmType) {
    console.log("Setting rhythm to:", type);
    console.log("Current rhythms store state:", get(rhythms));
    pauseTimer();
    update((state) => {
      console.log("Current timer state:", state);
      const newState: TimerState = {
        ...state,
        currentRhythm: type,
        isWork: true,
        activeBreakButton: null,
      };

      if (type === "custom") {
        const savedCustom = get(rhythms).custom;
        console.log("Saved custom rhythm:", savedCustom);
        if (savedCustom) {
          newState.customSettings = {
            ...savedCustom,
            cyclesUntilLongBreak: state.customSettings.cyclesUntilLongBreak,
          };
          console.log("Updated custom settings:", newState.customSettings);
        }
      }

      const finalState = {
        ...newState,
        ...getInitialTimerState(newState, getSettings(newState)),
      };
      console.log("Final timer state:", finalState);
      return finalState;
    });
  }

  function updateCustomRhythm(work: number, shortBreak: number, longBreak: number, label: string) {
    console.log("Updating custom rhythm:", {
      work,
      shortBreak,
      longBreak,
      label,
    });
    pauseTimer();
    update((state) => {
      const newCustomSettings: RhythmSettings = {
        work,
        shortBreak,
        longBreak,
        label,
        cyclesUntilLongBreak: state.customSettings.cyclesUntilLongBreak,
      };

      const customRhythm = { work, shortBreak, longBreak, label };
      console.log("Saving custom rhythm to store:", customRhythm);
      addOrUpdateRhythm("custom", customRhythm);

      const newState: TimerState = {
        ...state,
        customSettings: newCustomSettings,
        currentRhythm: "custom" as RhythmType,
        isWork: true,
        activeBreakButton: null,
      };
      const finalState = {
        ...newState,
        ...getInitialTimerState(newState, newCustomSettings),
      };
      console.log("Final timer state after custom update:", finalState);
      return finalState;
    });
  }

  return {
    subscribe,
    currentSettings,
    formattedTime,
    sessionLabel,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleMode,
    setRhythm,
    updateCustomRhythm,
  };
}

export type TimerStore = ReturnType<typeof createTimerStore>;
export const timer = createTimerStore();
