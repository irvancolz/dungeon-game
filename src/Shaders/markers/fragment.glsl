varying vec2 vUv;
uniform float uProgress;
uniform float uBorderWidth;
uniform float uCenterWidth;

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

    gl_FragColor = vec4(color, 1.);
}