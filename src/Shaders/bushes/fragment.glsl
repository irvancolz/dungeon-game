uniform sampler2D uLeavesTexture;
uniform sampler2D uMatcapTexture;
uniform vec3 uLeavesColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

#include <logdepthbuf_pars_fragment>

void main() {
    #include <logdepthbuf_fragment>
    vec3 color = uLeavesColor;
    vec3 normal = normalize(vNormal);
    vec2 uv = vUv;

    float leaveShape = texture2D(uLeavesTexture, uv).r;

    color = texture2D(uMatcapTexture, normal.xy).rgb;

    gl_FragColor = vec4(color, leaveShape);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}