attribute vec3 aCenter;

varying vec2 vUv;
varying vec3 vPosition;

#include ../includes/simplexNoise2d.glsl
#include ../includes/getRotatePivot2d.glsl
#include <logdepthbuf_pars_vertex>
#include ../includes/wind_pars_vertex.glsl

void main() {

    vec3 newPosition = position;

    float angle = atan(newPosition.x - cameraPosition.x, newPosition.z - cameraPosition.z);
    newPosition.xz = getRotatePivot2d(newPosition.xz, angle, aCenter.xz);
    // // Final postion
    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(newPosition, 1.);

    // maybe add randomness in future
    #include ../includes/wind_vertex.glsl
    float noise = simplexNoise2d(modelPosition.xz);
    modelPosition.xz += wind * noise * .1;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // gl_Position = projectedPosition;
    csm_PositionRaw = projectedPosition;

    #include <logdepthbuf_vertex>  

    vec4 modifiedNormal = modelMatrix * vec4(normal, 0.);

    // Varyings 
    vUv = uv;
    vNormal = modifiedNormal.xyz;
    vPosition = newPosition;
}