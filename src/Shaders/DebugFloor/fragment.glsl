varying vec2 vUv;
uniform float uSize;
uniform float uLineWidth;
uniform vec3 uBoardColor;
uniform vec3 uLineColor;

mat2 rotate2d(float _angle) {
    return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
}

void main() {
    vec2 uv = vUv;
    uv *= uSize;
    vec2 lineWidth = vec2(uLineWidth);

    // grid
    vec4 uvDDXY = vec4(dFdx(uv), dFdy(uv));
    vec2 uvDeriv = vec2(length(uvDDXY.xz), length(uvDDXY.yw));

    bool invertLine = lineWidth.x > 0.5; // assuming uniform lineWidth for both components
    vec2 targetWidth = invertLine ? (1.0 - lineWidth) : lineWidth;

    vec2 drawWidth = clamp(targetWidth, uvDeriv, vec2(0.5));
    vec2 lineAA = uvDeriv * 1.5;

    vec2 gridUV = abs(fract(uv) * 2.0 - 1.0);
    gridUV = invertLine ? gridUV : (1.0 - gridUV);

    vec2 grid2 = smoothstep(drawWidth + lineAA, drawWidth - lineAA, gridUV);
    grid2 *= clamp(targetWidth / drawWidth, 0.0, 1.0);
    grid2 = mix(grid2, targetWidth, clamp(uvDeriv * 2.0 - 1.0, 0.0, 1.0));
    grid2 = invertLine ? (1.0 - grid2) : grid2;

    float grid = mix(grid2.x, 1.0, grid2.y);

    vec3 color = mix(uBoardColor, uLineColor, grid);

    gl_FragColor = vec4(color, 1.);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}