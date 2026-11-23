<script setup lang="ts">
import { type Component, computed } from "vue";

/**
 * The Text One lockup (manual, slides 7–8): the T icon, TEXT ONE in Plus Jakarta Sans ExtraBold,
 * a fine rule and ".com" — the same lockup the public site draws in its header. The icon is the
 * logo's own SVG (public/logo.svg), filled with currentColor so it can sit on white, cream or
 * purple without a box. `size` is the wordmark's font size; the manual's minimum is 120px wide
 * for the lockup and 24px for the icon alone. Anything in the default slot follows the lockup
 * (an app's name, for example).
 */
const props = withDefaults(
  defineProps<{
    size?: number;
    iconOnly?: boolean;
    as?: string | Component;
    /** Accessible name; the drawing itself is hidden from assistive technology. */
    label?: string;
    /** White on the brand's purple (a feature panel, the login): the manual's reversed lockup. */
    inverse?: boolean;
  }>(),
  { size: 18, as: "span", label: "Text One.com" },
);
const style = computed(() => ({ "--tx-lockup-size": `${props.size}px` }));
</script>

<template>
  <component
    :is="as"
    class="tx-lockup"
    :class="{ 'tx-lockup--inverse': inverse }"
    :style="style"
    :role="as === 'span' && !$slots.default ? 'img' : undefined"
    :aria-label="label"
  >
    <svg
      class="tx-lockup__icon"
      viewBox="0 0 868 1032"
      aria-hidden="true"
      focusable="false"
    >
      <g
        transform="translate(-29.710842,1091.962179) scale(0.1,-0.1)"
        fill="currentColor"
        stroke="currentColor"
        stroke-width="50"
      >
        <path d="M7195 10856 c-982 -364 -1745 -836 -2385 -1476 -504 -503 -845 -1010 -1128 -1678 l-31 -72 38 -20 39 -19 16 24 c35 53 240 287 347 395 672 680 1763 1238 3020 1545 301 73 807 163 824 147 3 -3 5 -132 5 -287 l0 -283 -87 -6 c-1166 -90 -2046 -300 -2808 -670 -491 -238 -732 -413 -1180 -855 -400 -396 -628 -590 -901 -767 -103 -68 -311 -176 -372 -195 l-42 -12 0 -359 1 -358 47 0 c262 0 680 101 947 229 l126 60 -4 -2092 c-3 -1907 -4 -2102 -20 -2203 -49 -322 -136 -525 -291 -680 -190 -189 -414 -264 -898 -300 l-78 -6 0 -159 0 -159 2260 0 2260 0 0 160 c0 88 -3 160 -7 160 -5 0 -71 5 -148 10 -724 52 -1020 322 -1117 1020 -9 63 -13 796 -15 2878 l-3 2792 772 0 c425 0 845 -5 933 -10 705 -45 1103 -363 1228 -980 l13 -65 212 -3 c197 -2 212 -1 212 15 0 19 -124 1377 -190 2073 -22 234 -40 442 -40 463 l0 37 -205 0 -205 0 0 510 c0 503 0 510 -20 510 -40 0 -433 -70 -587 -105 -222 -50 -263 -58 -267 -54 -2 2 -18 175 -35 384 -17 209 -34 413 -38 453 -3 42 -10 72 -17 72 -6 -1 -87 -29 -181 -64z m155 -464 c18 -221 30 -405 28 -408 -7 -6 -145 -44 -163 -44 -8 0 -15 9 -15 20 0 29 -81 534 -86 539 -11 11 -371 -139 -620 -258 -824 -396 -1631 -979 -2159 -1561 -84 -92 -77 -79 39 75 158 209 285 355 491 560 614 616 1352 1079 2275 1430 91 35 168 60 171 57 4 -4 21 -188 39 -410z m-296 -19 c10 -37 67 -434 64 -449 -2 -11 -65 -36 -208 -84 -765 -252 -1501 -633 -2112 -1092 -255 -191 -470 -382 -745 -661 -106 -107 -193 -191 -193 -188 0 10 132 217 197 308 586 824 1660 1629 2828 2119 172 72 162 69 169 47z m1206 -762 l0 -458 -52 -7 c-29 -3 -83 -6 -120 -6 l-68 0 0 330 0 330 -47 -6 c-932 -109 -2016 -451 -2760 -869 -131 -73 -97 -45 73 60 652 404 1277 680 2000 884 318 89 936 220 967 204 4 -2 7 -210 7 -462z" />
        <path d="M536 9118 c-5 -34 -46 -472 -161 -1723 -36 -390 -68 -738 -71 -773 l-7 -62 212 2 213 3 28 110 c142 560 439 821 1045 921 85 14 215 17 857 21 l758 5 10 41 c25 101 127 396 179 518 142 333 335 654 556 923 l37 46 -1825 0 -1826 0 -5 -32z" />
      </g>
    </svg>
    <span v-if="!iconOnly" class="tx-lockup__words" aria-hidden="true">
      <span class="tx-lockup__name">TEXT ONE</span>
      <span class="tx-lockup__dotcom">.com</span>
    </span>
    <span v-if="$slots.default" class="tx-lockup__suffix"><slot /></span>
  </component>
</template>
