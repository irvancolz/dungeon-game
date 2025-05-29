attribute vec2 aCenter;
attribute vec3 color;

#include ../includes/wind_pars_vertex.glsl

varying vec2 vUv;

#include ../includes/getRotatePivot2d.glsl
#include ../includes/simplexNoise2d.glsl

void main() {

    float noise = simplexNoise2d(uv);
    vec3 newPosition = position;
    // calculate wind
    #include ../includes/wind_vertex.glsl
    newPosition.xz += wind * noise * pow(newPosition.y, 2.);

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;

}