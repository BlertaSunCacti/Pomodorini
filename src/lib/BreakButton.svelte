<script lang="ts">
  import Button from "./Button.svelte";
  import { timer } from "./stores/timer";

  const { isLongBreak, rhythmLabels } = $props<{
    isLongBreak: boolean;
    rhythmLabels: Record<string, string>;
  }>();

  const { currentSettings } = timer;

  const isActive = $derived(
    !$timer.isWork &&
      $timer.activeBreakButton === (isLongBreak ? "long" : "short")
  );
  const buttonLabel = $derived(
    $timer.isWork || !isActive
      ? `${isLongBreak ? $currentSettings.longBreak : $currentSettings.shortBreak}' break`
      : rhythmLabels[$timer.currentRhythm] || $currentSettings.label
  );
</script>

<Button
  variant="secondary"
  aria-pressed={isActive}
  onclick={() => timer.toggleMode(isLongBreak)}
  label={buttonLabel}
/>
