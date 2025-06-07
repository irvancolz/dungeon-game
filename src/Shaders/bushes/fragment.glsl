uniform sampler2D uLeavesTexture;
uniform sampler2D uMatcapTexture;
uniform vec3 uLeavesColor;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

#include <logdepthbuf_pars_fragment>

void main() {
    #include <logdepthbuf_fragment>

    vec3 lightDirection = normalize(vec3(3.5, 2., -1.25));

    vec3 color = vec3(1.);
    float alpha = 1.;
    vec3 shadowColor = uLeavesColor * .5;

    float leaveShape = texture2D(uLeavesTexture, vUv).r;
    leaveShape = step(.5, leaveShape);
    alpha = leaveShape;

    float lightIntensity = dot(vNormal, lightDirection);
    lightIntensity = smoothstep(-.8, .5, lightIntensity);

    color = mix(shadowColor, uLeavesColor, lightIntensity);

    if(alpha < .5) {
        discard;
    }

    // csm_DiffuseColor = vec4(color, 1.);
    gl_FragColor = vec4(color, alpha);
}