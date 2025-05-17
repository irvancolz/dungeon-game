varying vec2 vUv;
uniform vec3 uColor;
#include ../includes/simplexNoise2d.glsl

void main() {

    vec2 uv = vUv * 1.5;

    float noise = simplexNoise2d(uv);
    // noise = step(.w, noise);
    // vec3 color = mix(uColor, uNoiseColor, noise);

    vec3 color = uColor;

    gl_FragColor = vec4(color, 1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}