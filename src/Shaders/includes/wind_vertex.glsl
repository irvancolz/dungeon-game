float time = uTime * uWindSpeed * .002;
vec2 wind = uWindDirection * sin(time) * uWindStrength;