uniform sampler2D uMapTexture;
uniform float uMaxHeight;

varying vec2 vUv;

void main() {
    float map = texture(uMapTexture, uv).r;
    map = smoothstep(0.01, .3, map);
    vec3 newPosition = position;
    // mesh is rotated, due to flipped texture
    newPosition.z += mix(0., uMaxHeight, map);

    // Final postion
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // gl_Position = projectedPosition;
    csm_Position = newPosition;

    // Varyings 
    vUv = uv;
}