attribute vec2 aCenter;
attribute vec3 color;

uniform vec3 uPlayerPosition;
uniform float uFieldSize;
#include ../includes/wind_pars_vertex.glsl

varying vec2 vUv;

#include ../includes/getRotatePivot2d.glsl
#include ../includes/simplexNoise2d.glsl

void main() {

    float noise = simplexNoise2d(uv);
    vec3 newPosition = position;
    vec2 newCenter = aCenter;
    newCenter -= uPlayerPosition.xz;

    // move grass around player
    float halfField = uFieldSize * .5;
    newCenter.x = mod(newCenter.x + halfField, uFieldSize) - halfField;
    newCenter.y = mod(newCenter.y + halfField, uFieldSize) - halfField;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.);
    modelPosition.xz += newCenter;

    // calculate wind
    #include ../includes/wind_vertex.glsl
    modelPosition.xz += wind * noise * pow(modelPosition.y, 2.);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // gl_Position = projectedPosition;
    csm_PositionRaw = projectedPosition;

    vUv = uv;

}