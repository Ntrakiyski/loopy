// player/Fade.ts

export type Curve = "linear" | "easeInExpo" | "easeOutExpo" | "crossfade";

// A value representing how much to "dip" the volume during a crossfade.
// 0.5 means the volume will dip to 50% at the midpoint of the fade.
const CROSSFADE_AMOUNT = 0.5;

export const curveFn: Record<Curve, (t: number) => number> = {
  linear: t => t,
  easeInExpo: t => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
  easeOutExpo: t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  
  // NEW CROSSFADE CURVE:
  // This is a parabolic curve. It starts at 1, dips to CROSSFADE_AMOUNT, and ends at 1.
  // We use this for BOTH fade-in and fade-out to create the seamless effect.
  crossfade: t => 1 - CROSSFADE_AMOUNT * Math.sin(Math.PI * t),
};