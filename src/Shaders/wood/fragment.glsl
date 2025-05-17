uniform vec3 uColor;
uniform vec3 uNoiseColor;

varying vec2 vUv;

#include ../includes/simplexNoise2d.glsl

void main() {

    vec2 uv = vUv * 4.;

    float noise = simplexNoise2d(uv);
    vec3 color = mix(uColor, uNoiseColor, noise);

    gl_FragColor = vec4(color, 1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}