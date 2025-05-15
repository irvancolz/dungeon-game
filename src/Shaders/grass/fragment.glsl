uniform vec3 uColor;

varying vec2 vUv;
varying float vGrassHeight;

void main() {

    if(vGrassHeight <= .2) {
        discard;
    }

    vec3 color = uColor;
    gl_FragColor = vec4(color, 1.);
}