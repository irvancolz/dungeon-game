attribute vec3 aCenter;

uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;

#include ../includes/simplexNoise2d.glsl
#include ../includes/getRotatePivot2d.glsl
#include <logdepthbuf_pars_vertex>

void main() {
    float time = uTime * .005;
    float windPower = .1;
    float noise = simplexNoise2d(uv);

    vec3 newPosition = position;

    float angle = atan(newPosition.x - cameraPosition.x, newPosition.z - cameraPosition.z);
    newPosition.xz = getRotatePivot2d(newPosition.xz, angle, aCenter.xz);

    // // Final postion
    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(newPosition, 1.);

    // maybe add randomness in future
    float offset = time * position.y + modelPosition.y + noise;
    // modelPosition.xz += vec2(sin(uv.x + offset), sin(uv.y + offset)) * windPower;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // gl_Position = projectedPosition;
    csm_Position = newPosition;

    #include <logdepthbuf_vertex>  

    vec4 modifiedNormal = modelMatrix * vec4(normal, 0.);

    // Varyings 
    vUv = uv;
    vNormal = modifiedNormal.xyz;
    vPosition = newPosition;
}