uniform sampler2D uLeavesTexture;
uniform vec3 uLeavesColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/simplexNoise2d.glsl

void main() {
    vec3 color = uLeavesColor;
    vec2 uv = vUv;

    float noise = simplexNoise2d(uv * 4.) * .03;

    float leaveShape = texture2D(uLeavesTexture, uv).r;

    // float dist = length(vPosition);
    // dist = smoothstep(.01, .35, dist);
    // dist += noise;
    // dist = 1. - pow(dist, 2.);

    // color = vec3(dist);
    // color = mix(uLeavesColor, vec3(0.01, 0.2, 0.01), dist);
    // color = uLeavesColor;
    // color = vec3(1., 0., 0.);

    gl_FragColor = vec4(color, leaveShape);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}