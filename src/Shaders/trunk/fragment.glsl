uniform vec3 uColor;

varying vec2 vUv;

void main() {

    vec3 color = uColor;
    // gl_FragColor = vec4(color, 1.);

    csm_DiffuseColor = vec4(color, 1.);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}