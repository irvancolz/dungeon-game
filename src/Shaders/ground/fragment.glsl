uniform sampler2D uMapTexture;
uniform vec3 uColor;
uniform vec3 uEdgeColor;

varying vec2 vUv;

void main() {

    float colorMix = texture2D(uMapTexture, vUv).g;

    vec3 color = mix(uEdgeColor, uColor, colorMix);

    gl_FragColor = vec4(color, 1.);
    // csm_DiffuseColor = vec4(color, 1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}