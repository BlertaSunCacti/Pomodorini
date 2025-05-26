<script lang="ts">
  let { progress, isWork } = $props<{
    progress: number;
    isWork: boolean;
  }>();

  let fillY: number = $state(0);
  let fillHeight: number = $state(0);

  $effect(() => {
    fillY = 456 - progress * 400;
    fillHeight = progress * 400;
  });
</script>

<svg width="100" height="100" viewBox="0 0 512 512" class="tomato-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progress * 100)} aria-valuetext={`${Math.round(progress * 100)}% ${isWork ? 'focus time' : 'break time'} completed`}>
  <defs>
    <mask id="tomato-mask">
      <rect x="0" y="0" width="512" height="512" fill="black" />
      <rect x="56" y={fillY} width="400" height={fillHeight} fill="white" />
    </mask>
  </defs>

  <!-- Background tomato (empty) -->
  <circle
    cx="256"
    cy="256"
    r="200"
    fill="var(--color-primary)"
    fill-opacity="0.2"
  />

  <!-- Progress fill -->
  <circle
    cx="256"
    cy="256"
    r="200"
    fill="var(--color-primary)"
    mask="url(#tomato-mask)"
  />

  <!-- Highlight -->
  <circle
    cx="200"
    cy="200"
    r="40"
    fill="var(--color-primary-light)"
    fill-opacity="0.3"
  />

  <!-- Stem -->
  <path
    d="M256 56C256 56 280 80 280 120C280 160 256 200 256 200"
    stroke="var(--color-break)"
    stroke-width="24"
    stroke-linecap="round"
    class:break-mode={!isWork}
  />

  <!-- Leaf -->
  <path
    d="M280 120C320 120 360 160 360 200"
    stroke="var(--color-break)"
    stroke-width="24"
    stroke-linecap="round"
    class:break-mode={!isWork}
  />
</svg>

<style>
  .tomato-progress {
    transition: transform 0.3s ease;
  }

  .tomato-progress:hover {
    transform: scale(1.05);
  }

  .break-mode {
    stroke: var(--color-break);
  }

  rect {
    will-change: transform, height;
  }

  circle {
    transition: fill-opacity 0.3s ease;
  }
</style>
