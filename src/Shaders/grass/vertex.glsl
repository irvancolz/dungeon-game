#include ../includes/getRotatePivot2d.glsl

uniform vec3 uPlayerPosition;
uniform float uGrassDistance;
uniform float uMaxHeightRatio;

attribute vec2 aCenter;

varying vec2 vUv;

vec2 keepAroundRadius(vec2 uv, vec2 center, float radius) {

    float dist = distance(center, uv);
    if(dist <= radius) {
        return uv;
    }

    vec3 v3Center = vec3(center.x, 0, center.y);
    vec3 v3Uv = vec3(uv.x, 0, uv.y);

    return cross(v3Center, v3Uv).xz;
}

void main() {

    float heightMultiplier = uMaxHeightRatio;

    vec2 center = aCenter;
    center -= uPlayerPosition.xz;

    // keep around player
    float radius = uGrassDistance * .5;
    center.x = mod(center.x + radius, uGrassDistance) - radius;
    center.y = mod(center.y + radius, uGrassDistance) - radius;

    // Final postion
    vec4 modelPosition = modelMatrix * vec4(position, 1.);

      // make grass shorter on edge
    // float edge = 1. - distance(modelPosition.xz, uPlayerPosition.xz) / uGrassDistance;
    // edge = pow(abs(edge), 2.);
    // heightMultiplier *= edge;

    modelPosition.y *= heightMultiplier;
    modelPosition.xz += center;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Varyings 
    vUv = uv;
}