#include ../includes/getRotatePivot2d.glsl

attribute vec2 aCenter;

uniform vec3 uPlayerPosition;
uniform float uGrassDistance;

varying vec2 vUv;

mat2 rotate2d(float _angle) {
    return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
}

void main() {

    // handle rotation
    vec2 center = aCenter;
    center -= uPlayerPosition.xz;

    float halfDistance = uGrassDistance * .5;
    center.x = mod(center.x - halfDistance, uGrassDistance) - halfDistance;
    center.y = mod(center.y - halfDistance, uGrassDistance) - halfDistance;
    vec4 modelCenter = modelMatrix * vec4(center.x, 0., center.y, 1.);

    // Final postion
    vec4 modelPosition = modelMatrix * vec4(position, 1.);
    modelPosition.xz += center;

    float angle = atan(modelCenter.x - cameraPosition.x, modelCenter.z - cameraPosition.z);
    modelPosition.xz = getRotatePivot2d(modelPosition.xz, angle, modelCenter.xz);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Varyings 
    vUv = uv;
}