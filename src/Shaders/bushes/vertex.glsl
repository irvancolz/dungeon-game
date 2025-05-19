uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/simplexNoise2d.glsl

void main() {
    float time = uTime * .005;
    float windPower = .1;
    float noise = simplexNoise2d(uv);

    vec3 newPosition = position;

    // Final postion
    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(newPosition, 1.);

    // maybe add randomness in future
    float offset = time * position.y + modelPosition.y + noise;
    modelPosition.xz += vec2(sin(uv.x + offset), sin(uv.y + offset)) * windPower;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Varyings 
    vUv = uv;
    vNormal = normalize(normal);
    vPosition = newPosition;
}