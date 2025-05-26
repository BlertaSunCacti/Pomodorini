<script lang="ts">
  import { onDestroy } from "svelte";
  import { rhythms } from "./stores/rhythms";
  import Button from "./Button.svelte";

  const { isOpen, onClose, onSave } = $props<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (work: number, shortBreak: number, longBreak: number, label: string) => void;
  }>();

  let rhythmLabel = $state("My Schedule");
  let workMinutes = $state(25);
  let shortBreakMinutes = $state(5);
  let longBreakMinutes = $state(15);

  $effect(() => {
    if (isOpen) {
      const currentCustom = $rhythms.custom;
      if (currentCustom) {
        rhythmLabel = currentCustom.label;
        workMinutes = currentCustom.work;
        shortBreakMinutes = currentCustom.shortBreak;
        longBreakMinutes = currentCustom.longBreak;
      }
    }
  });

  function toggleModalClass(open: boolean) {
    if (typeof document !== "undefined") {
      document.body.classList.toggle("modal-open", open);
    }
  }

  $effect(() => {
    if (isOpen) {
      toggleModalClass(true);
    } else {
      toggleModalClass(false);
    }
  });

  onDestroy(() => {
    toggleModalClass(false);
  });

  function handleClose() {
    toggleModalClass(false);
    onClose();
  }

  function handleInput(event: Event, type: "label" | "work" | "shortBreak" | "longBreak") {
    if (type === "label") {
      const input = event.target as HTMLInputElement;
      const cursorPosition = input.selectionStart;
      const oldValue = input.value;
      const newValue = oldValue
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");

      if (oldValue !== newValue) {
        input.value = newValue;
        requestAnimationFrame(() => {
          input.setSelectionRange(cursorPosition, cursorPosition);
        });
      }
    }
  }

  function handleSubmit(event: Event) {
    event.preventDefault();
    onSave(
      workMinutes,
      shortBreakMinutes,
      longBreakMinutes,
      rhythmLabel
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
    );
    handleClose();
  }
</script>

{#if isOpen}
<div
  class="modal-backdrop"
  role="button"
  tabindex="0"
  onclick={handleClose}
  onkeydown={(e) => ["Escape"].includes(e.key) && handleClose()}
  aria-label="Close modal backdrop"
  aria-labelledby="modal-title"
>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="modal-content"
    onclick={(e) => e.stopPropagation()}
    role="dialog"
    aria-modal="true"
    tabindex={0}
  >
    <form onsubmit={handleSubmit} aria-label="Custom rhythm settings">
      <fieldset>
        <legend id="modal-title" class="modal-title">Custom Rhythm</legend>
        <div class="input-group">
          <label for="label">Rhythm Name</label>
          <input
            type="text"
            id="label"
            bind:value={rhythmLabel}
            oninput={(e) => handleInput(e, "label")}
            placeholder="e.g., Deep Work, Study Mode, etc."
            maxlength="20"
            required
            aria-required="true"
          />
        </div>
        <div class="input-group">
          <label for="work">Work Duration (minutes)</label>
          <input
            type="number"
            id="work"
            bind:value={workMinutes}
            min="1"
            max="120"
            required
            aria-required="true"
            aria-label="Work duration in minutes"
          />
        </div>
        <div class="input-group">
          <label for="shortBreak">Short Break (minutes)</label>
          <input
            type="number"
            id="shortBreak"
            bind:value={shortBreakMinutes}
            min="1"
            max="60"
            required
            aria-required="true"
            aria-label="Short break duration in minutes"
          />
        </div>
        <div class="input-group">
          <label for="longBreak">Long Break (minutes)</label>
          <input
            type="number"
            id="longBreak"
            bind:value={longBreakMinutes}
            min="1"
            max="60"
            required
            aria-required="true"
            aria-label="Long break duration in minutes"
          />
        </div>
      </fieldset>
      <div class="modal-actions">
        <Button
          type="button"
          variant="secondary"
          onclick={handleClose}
          aria-label="Cancel and close modal"
          label="Cancel"
        />
        <Button
          type="submit"
          variant="primary"
          aria-label="Save custom rhythm settings"
          label="Save"
        />
      </div>
    </form>
  </div>
</div>

{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    outline: none;
  }

  .modal-content {
    background: var(--color-secondary);
    padding: 2rem;
    border-radius: 1rem;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);

    @media screen and (width < 480px) {
      width: 95%;
      padding: 1.5rem;
    }
  }
  fieldset {
    border: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }

  .modal-title {
    color: var(--color-primary);
    margin: 0 0 1.5rem 0;
    font-size: 1.5rem;
    text-align: center;
    font-weight: bold;
    width: 100%;
    padding: 0;
  }

  :global(body.break-mode) .modal-title {
    color: var(--color-break);
  }

  .input-group {
    margin-bottom: 1.2rem;
    width: 100%;
    box-sizing: border-box;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--color-primary);
    font-weight: bold;
  }

  :global(body.break-mode) label {
    color: var(--color-break);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
    @media screen and (width < 480px) {
      flex-direction: column;
      gap: 0.8rem;
    }
  }

  input {
    width: 100%;
    padding: 0.8rem;
    border: 2px solid var(--color-primary);
    border-radius: 0.5rem;
    font-size: 1rem;
    font-family: "Orbitron", sans-serif;
    background: var(--color-secondary);
    color: var(--color-primary);
    box-sizing: border-box;
    appearance: textfield;
    -moz-appearance: textfield;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  :global(body.break-mode) input {
    border-color: var(--color-break);
    color: var(--color-break);
  }

  :global(body.break-mode) input:focus {
    border-color: var(--color-break);
  }
</style>
