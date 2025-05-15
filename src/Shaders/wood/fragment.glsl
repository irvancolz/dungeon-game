uniform vec3 uColor;
uniform vec3 uNoiseColor;

varying vec2 vUv;

#include ../includes/simplexNoise2d.glsl

void main() {

    vec2 uv = vUv;

    float noise = simplexNoise2d(uv);
    // noise = pow(noise, 2.);
    vec3 color = mix(uNoiseColor, uColor, noise);

    gl_FragColor = vec4(color, 1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}