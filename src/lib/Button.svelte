<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  const {
    variant = "primary",
    type = "button",
    disabled = false,
    label = "",
    ...rest
  } = $props<
    {
      variant?: "primary" | "secondary";
      type?: "button" | "submit" | "reset";
      disabled?: boolean;
      label?: string;
    } & HTMLButtonAttributes
  >();
</script>

<button {type} {disabled} {...rest} class="button {variant}">
  {label}
</button>

<style>
  .button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    font-family: "Orbitron", sans-serif;
    border: 1px solid transparent;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease-in;
    transform-origin: center;
    will-change: transform;
    @media screen and (width < 480px) {
      padding: 0.6rem 1.2rem;
      font-size: 0.9rem;
    }
  }

  .button.primary {
    background: var(--color-primary);
    color: var(--color-secondary);
    border: 1px solid var(--color-primary);
  }

  :global(body.break-mode) .button.primary {
    background: var(--color-break);
    border: 1px solid var(--color-break);
  }

  :global(body.break-mode) .button.primary:hover {
    border: 1px solid var(--color-break);
  }

  .button.secondary {
    background: var(--color-secondary);
    color: var(--color-primary);
    border: 1px solid var(--color-secondary);
  }

  .button.secondary:hover {
    border: 1px solid var(--color-primary);
  }

  :global(body.break-mode) .button.secondary {
    background: var(--color-secondary);
    color: var(--color-break);
  }

  :global(body.break-mode) .button.secondary:hover {
    border: 1px solid var(--color-break);
  }
</style>
