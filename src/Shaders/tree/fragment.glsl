uniform vec3 uColor;

void main() {
    vec3 color = uColor;
    csm_DiffuseColor = vec4(color, 1.);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}