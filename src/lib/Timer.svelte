<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { timer } from "./stores/timer";
  import TomatoProgress from "./TomatoProgress.svelte";
  import Button from "./Button.svelte";

  const { formattedTime, sessionLabel } = timer;

  onMount(() => {
    timer.resetTimer();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === "Space") {
        e.preventDefault();
        $timer.isRunning ? timer.pauseTimer() : timer.startTimer();
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        timer.resetTimer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  onDestroy(() => {
    timer.pauseTimer();
  });
</script>

<section class="timer-container" aria-label="Timer">
  <div class="timer-wrapper">
    <TomatoProgress progress={$timer.progress} isWork={$timer.isWork} />
    <div
      class="timer-display"
      role="timer"
      aria-label={$timer.isWork
        ? "Focus time remaining"
        : "Break time remaining"}
    >
      {$formattedTime}
    </div>
  </div>
  <div class="controls" role="toolbar" aria-label="Timer controls">
    {#if $timer.isRunning}
      <Button
        aria-label="Pause timer"
        onclick={timer.pauseTimer}
        label="Pause"
      />
    {:else}
      <Button
        aria-label="Start timer"
        onclick={timer.startTimer}
        label="Start"
      />
    {/if}
    <Button 
      aria-label="Reset timer" 
      onclick={timer.resetTimer}
      label="Reset"
    />
  </div>
</section>

<div class="session-label" role="status" aria-live="polite">
  {$sessionLabel}
</div>

<style>
  .timer-container {
    min-width: 350px;
    margin: 60px auto;
    padding: 2rem;
    background: var(--color-secondary);
    border-radius: 1.5rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    text-align: center;
  }

  .timer-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .timer-display {
    font-size: 5rem;
    font-weight: bold;
    font-family: "Orbitron", sans-serif;
    margin-bottom: 1.5rem;
    letter-spacing: 2px;
    color: var(--color-primary);
  }

  :global(body.break-mode) .timer-display {
    color: var(--color-break);
  }

  .controls {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .session-label {
    margin-top: 1rem;
    font-size: 1.1rem;
    font-weight: bold;
    color: var(--color-secondary);
  }
</style>
