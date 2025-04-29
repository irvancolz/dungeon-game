#include ../includes/getRotatePivot2d.glsl

uniform vec3 uPlayerPosition;
uniform float uGrassDistance;
uniform float uMaxHeightRatio;
uniform float uFieldSize;
uniform float uGroundHeight;
uniform sampler2D uCemeteryTexture;

attribute vec2 aCenter;

varying vec2 vUv;
varying vec3 vPosition;
varying vec2 vWorldUv;

void main() {

    float heightMultiplier = uMaxHeightRatio;

    vec2 center = aCenter;
    center -= uPlayerPosition.xz;

    // keep around player
    float radius = uGrassDistance * .5;
    // center.x = mod(center.x + radius, uGrassDistance) - radius;
    // center.y = mod(center.y + radius, uGrassDistance) - radius;

    // Final postion
    vec4 modelPosition = modelMatrix * vec4(position, 1.);

    // place height based on texture
    vec2 worldUv = (modelPosition.xz + uFieldSize * .5) / uFieldSize;
    worldUv.x = 1. - worldUv.x;

// i can use uv though, but as long it works for now
    float height = texture(uCemeteryTexture, worldUv).r;
    modelPosition.y += height * uGroundHeight;

    // modelPosition.y *= heightMultiplier;
    // modelPosition.xz += center;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Varyings 
    vUv = uv;
    vWorldUv = worldUv;
    vPosition = modelPosition.xyz;

}