<script lang="ts">
  import Button from "./Button.svelte";
  import { rhythms } from "./stores/rhythms";
  import { timer } from "./stores/timer";

  const { rhythmType } = $props<{
    rhythmType: "pomodoro" | "ultradian" | "desktime" | "custom";
  }>();

  const isChecked = $derived($timer.currentRhythm === rhythmType);
  const rhythm = $derived($rhythms[rhythmType]);
  const buttonLabel = $derived(
    rhythmType === "custom"
      ? $timer.currentRhythm === "custom"
        ? $timer.customSettings.label
        : $rhythms.custom?.label || "My own rhythm"
      : `${rhythm.label} (${rhythm.work}/${rhythm.shortBreak})`
  );
</script>

<Button
  variant="secondary"
  role="radio"
  aria-checked={isChecked}
  onclick={() => timer.setRhythm(rhythmType)}
  label={buttonLabel}
/> 