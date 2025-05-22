varying vec2 vUv;
uniform float uProgress;
uniform float uBorderWidth;
uniform float uCenterWidth;
uniform float uClearProgress;

#include ../includes/simplexNoise2d.glsl

void main() {
    vec2 uv = vUv;

    vec3 color = vec3(1.);

    float borderX = distance(uv.x, .5);
    borderX = step(borderX, uBorderWidth);

    float borderY = distance(uv.y, .5);
    borderY = step(borderY, uBorderWidth);

    float border = borderX * borderY;

    float centerX = distance(uv.x, .5);
    centerX = step(centerX, uCenterWidth);

    float centerY = distance(uv.y, .5);
    centerY = step(centerY, uCenterWidth);

    float center = 1. - centerX * centerY;

    color = vec3(center * border);

    float noise = simplexNoise2d(uv * 2.) * .1;
    float h = length(uv + noise);
    h = step(h, uClearProgress);

    float alpha = h;

    gl_FragColor = vec4(color, alpha);
}