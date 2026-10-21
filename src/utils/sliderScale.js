// Logarithmic scale of BaseDualSlider and BaseMonoSlider. With it on, the range inputs move in positions from 0
// to SLIDER_POSITIONS, and these turn a position into a value and back.
// smooth "start": the start of the slider gets more room (finer for the low values), "end": the end gets it.
// power: how strong, 0 is linear. A log scale with an offset, so a min of 0 works.
export const SLIDER_POSITIONS = 1000;

// 0..1 -> 0..1, slow at the start
function curve(t, power) {
  return (Math.exp(power * t) - 1) / (Math.exp(power) - 1);
}
function curveInverse(u, power) {
  return Math.log(1 + u * (Math.exp(power) - 1)) / power;
}

// { min, max, step, smooth, power }
export function sliderValue(position, scale) {
  let t = Math.min(1, Math.max(0, position / SLIDER_POSITIONS));
  let u = t;
  if (scale.power > 0) u = scale.smooth === "end" ? 1 - curve(1 - t, scale.power) : curve(t, scale.power);
  // snapped to the step from min, like a range input does
  let value = scale.min + Math.round(u * (scale.max - scale.min) / scale.step) * scale.step;
  let decimals = (String(scale.step).split(".")[1] || "").length;
  value = Number(value.toFixed(decimals));
  return Math.min(scale.max, Math.max(scale.min, value));
}

export function sliderPosition(value, scale) {
  let u = Math.min(1, Math.max(0, (value - scale.min) / (scale.max - scale.min)));
  let t = u;
  if (scale.power > 0) t = scale.smooth === "end" ? 1 - curveInverse(1 - u, scale.power) : curveInverse(u, scale.power);
  return t * SLIDER_POSITIONS;
}
