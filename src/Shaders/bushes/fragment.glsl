uniform sampler2D uLeavesTexture;
uniform vec3 uLeavesColor;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
    vec3 color = uLeavesColor;

    float leaveShape = texture2D(uLeavesTexture, vUv).r;

    color = vNormal;

    gl_FragColor = vec4(color, leaveShape);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}