uniform sampler2D uNoiseTexture;
uniform vec3 uColor;
uniform vec3 uMossColor;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
    float noise = texture(uNoiseTexture, vNormal.zx).r;
    noise = smoothstep(0.1, .6, noise);

    vec3 color = mix(uMossColor, uColor, noise);
    gl_FragColor = vec4(color, 1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}