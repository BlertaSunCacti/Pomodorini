<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  const {
    variant = "primary",
    type = "button",
    disabled = false,
    label = "",
    ...rest
  } = $props<{
    variant?: "primary" | "secondary";
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    label?: string;
  } & HTMLButtonAttributes>();
</script>

<button
  {type}
  {disabled}
  {...rest}
  class="button {variant}"
>
  {label}
</button>

<style>
  .button {
    padding: 0.5rem 1.2rem;
    font-size: 1rem;
    font-weight: bold;
    font-family: "Orbitron", sans-serif;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition:
      background 0.2s,
      border-color 0.2s;
  }

  .button.primary {
    background: var(--color-primary);
    color: var(--color-secondary);
    border: 1px solid var(--color-primary);
  }

  .button.secondary {
    background: var(--color-secondary);
    color: var(--color-primary);
    border: 1px solid var(--color-secondary);
  }

  :global(body.break-mode) .button.primary {
    background: var(--color-break);
    border-color: var(--color-break);
  }

  .button:disabled {
    background: var(--color-primary-light);
    border-color: var(--color-primary-light);
    cursor: not-allowed;
  }

  :global(body.break-mode) .button:disabled {
    background: var(--color-break-light);
    border-color: var(--color-break-light);
  }

  .button:not(:disabled):hover {
    background: var(--color-primary-dark);
    border-color: var(--color-primary-dark);
  }

  :global(body.break-mode) .button:not(:disabled):hover {
    background: var(--color-break-dark);
    border-color: var(--color-break-dark);
  }

  .button.secondary:not(:disabled):hover {
    background: var(--color-secondary);
    border-color: var(--color-primary);
  }

  :global(body.break-mode) .button.secondary:not(:disabled):hover {
    border-color: var(--color-break);
  }
</style>
