<script lang="ts">
  import Timer from "./lib/Timer.svelte";
  import CustomRhythmModal from "./lib/CustomRhythmModal.svelte";
  import Button from "./lib/Button.svelte";
  import BreakButton from "./lib/BreakButton.svelte";
  import RhythmButton from "./lib/RhythmButton.svelte";
  import { timer } from "./lib/stores/timer";
  import { rhythms } from "./lib/stores/rhythms";

  let isCustomModalOpen = $state(false);

  $effect(() => {
    if (typeof document !== "undefined") {
      document.body.classList.toggle("break-mode", !$timer.isWork);
    }
  });

  function capitalizeWords(str: string): string {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  function handleCustomRhythmSave(
    work: number,
    shortBreak: number,
    longBreak: number,
    label: string
  ) {
    timer.updateCustomRhythm(work, shortBreak, longBreak, capitalizeWords(label));
    timer.setRhythm("custom");
  }

  const rhythmLabels = $derived({
    pomodoro: $rhythms.pomodoro.label,
    ultradian: $rhythms.ultradian.label,
    desktime: $rhythms.desktime.label,
    custom: $timer.customSettings.label,
  });
</script>

<main>
  <header>
    <h1>Pomodorini</h1>
  </header>
  <div class="content">
    <Timer />
    <nav class="breaks" aria-label="Break options">
      <BreakButton isLongBreak={false} {rhythmLabels} />
      <BreakButton isLongBreak={true} {rhythmLabels} />
    </nav>
    <section class="other-rhythms" aria-labelledby="rhythms-heading">
      <h2 id="rhythms-heading" class="other-rhythms-label">Try out other working rhythms</h2>
      <div class="other-rhythms-buttons" role="radiogroup" aria-label="Working rhythm options">
        <RhythmButton rhythmType="pomodoro" />
        <RhythmButton rhythmType="ultradian" />
        <RhythmButton rhythmType="desktime" />
        <div class="custom-rhythm-group">
          <Button
            variant="secondary"
            role="radio"
            aria-checked={$timer.currentRhythm === "custom"}
            tabindex={0}
            onclick={() => timer.setRhythm("custom")}
            label={$timer.currentRhythm === "custom"
              ? $timer.customSettings.label
              : $rhythms.custom?.label || "Your own rhythm"}
          />
          <Button
            variant="secondary"
            aria-label="Edit custom rhythm settings"
            tabindex={0}
            onclick={() => (isCustomModalOpen = true)}
            label="Edit"
          />
        </div>
      </div>
    </section>
  </div>
  <footer>
    Made with <img
      src="/Pomodorini/tomato.svg"
      alt="❤️"
      width="16"
      height="16"
      class="footer-tomato"
    /> by Blerta
  </footer>
  {#if isCustomModalOpen}
    <CustomRhythmModal
      isOpen={isCustomModalOpen}
      onClose={() => (isCustomModalOpen = false)}
      onSave={handleCustomRhythmSave}
    />
  {/if}
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
    position: relative;

    @media screen and (width < 480px) {
      max-width: 100%;
    }
  }

  header {
    padding: 1rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  h1 {
    margin-block-start: 0;
    margin-block-end: 0;
    font-size: 3rem;
    color: var(--color-secondary);
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0 1rem;
  }

  .breaks {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  .other-rhythms {
    margin-top: 5rem;
    padding: 1.5rem;
    background: var(--color-secondary);
    border-radius: 1.5rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    width: 100%;
    max-width: 350px;

    @media screen and (width < 480px) {
      margin-top: 2rem;
      padding: 1rem;
      max-width: 100%;
    }
  }

  .other-rhythms-label {
    font-size: 1.1rem;
    font-weight: bold;
    color: var(--color-primary);
    margin-bottom: 1rem;
  }

  :global(body.break-mode) .other-rhythms-label {
    color: var(--color-break);
  }

  .other-rhythms-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .custom-rhythm-group {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
  }

  footer {
    padding: 1rem;
    color: var(--color-secondary);
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
  }

  :global(body.break-mode) footer {
    color: var(--color-secondary);
  }

  :global(body.break-mode) {
    background-color: var(--color-break);
  }

  .footer-tomato {
    vertical-align: middle;
    margin: 0 0.2rem;
  }
</style>
