uniform float uTime;

varying vec2 vUv;

void main() {
    float time = uTime * .005;
    float windPower = .1;
    // Final postion
    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(position, 1.);

    // maybe add randomness in future
    float offset = time * position.y + modelPosition.y;
    modelPosition.xz += vec2(sin(uv.x + offset), sin(uv.y + offset)) * windPower;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Varyings 
    vUv = uv;
}