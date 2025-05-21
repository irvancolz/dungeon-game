uniform vec3 uCenter;

varying vec2 vUv;

#include ../includes/getRotatePivot2d.glsl

void main() {

    // Final position
    vec4 modelPosition = modelMatrix * vec4(position, 1.);

    // always face camera
    float angle = atan(modelPosition.x - cameraPosition.x, modelPosition.z - cameraPosition.z);
    modelPosition.xz = getRotatePivot2d(modelPosition.xz, angle, uCenter.xz);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Varyings 
    vUv = uv;
}