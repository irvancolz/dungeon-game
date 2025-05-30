uniform vec3 uColor;

varying vec2 vUv;

void main() {

    vec3 color = uColor;

    csm_DiffuseColor = vec4(color, 1.);
    // gl_FragColor = vec4(color, 1.);
}