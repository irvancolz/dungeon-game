uniform sampler2D uLeavesTexture;
uniform vec3 uLeavesColor;

varying vec3 vNormal;
varying vec2 vUv;

void main() {
    vec3 color = uLeavesColor;

    float leaveShape = texture2D(uLeavesTexture, vUv).r;

    gl_FragColor = vec4(color, leaveShape);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}