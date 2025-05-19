uniform vec3 uColor;
uniform vec3 uNoiseColor;
uniform sampler2D uAphaTexture;

varying vec2 vUv;

#include ../includes/simplexNoise2d.glsl

void main() {

    float alpha = 1.;
    vec2 uv = vUv;

    float noise = simplexNoise2d(uv);
    vec3 color = mix(uColor, uNoiseColor, noise);

    #if defined (USE_ALPHA)
    alpha = texture2D(uAphaTexture, vUv).r;
    alpha = step(.5, alpha);
    #endif

    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}