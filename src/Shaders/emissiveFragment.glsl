uniform float uIntensity;
uniform vec3 uColor;

void main() {
    vec3 color = uColor;
    color += color * uIntensity;

    gl_FragColor = vec4(color, 1.);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}