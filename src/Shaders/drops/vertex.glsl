attribute vec3 aCenter;

varying vec2 vUv;

#include ../includes/getRotatePivot2d.glsl

void main() {

    vec3 newPosition = position;

    // always face camera
    float angle = atan(newPosition.x - cameraPosition.x, newPosition.z - cameraPosition.z);
    newPosition.xz = getRotatePivot2d(newPosition.xz, angle, vec2(0., 0.));
    newPosition += aCenter;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Varyings 
    vUv = uv;
}