attribute vec2 aCenter;
attribute vec3 color;

uniform float uTime;
uniform float uWindStrength;
uniform float uWindSpeed;
uniform vec2 uWindDirection;

varying vec2 vUv;

#include ../includes/getRotatePivot2d.glsl
#include ../includes/simplexNoise2d.glsl

void main() {

    float noise = simplexNoise2d(uv);
    float time = uTime * .001;
    vec3 newPosition = position;
    // calculate wind
    newPosition.xz += uWindDirection * sin(time * uWindSpeed) * uWindStrength * noise * pow(newPosition.y, 2.);
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;

}