export function mix(x, y, a) {
  return x * (1 - a) + y * a;
}

export function smoothstep(edge0, edge1, x) {
  let t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
