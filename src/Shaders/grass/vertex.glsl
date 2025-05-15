uniform sampler2D uGroundTexture;
uniform float uFieldSize;

varying float vGrassHeight;
varying vec2 vUv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.);

    // place height based on texture
    vec2 worldUv = (modelPosition.xz + uFieldSize * .5) / uFieldSize;
    worldUv.x = 1. - worldUv.x;

    float grassHeight = texture2D(uGroundTexture, worldUv).g;
    modelPosition.y = modelPosition.y * grassHeight;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // varying
    vUv = worldUv;
    vGrassHeight = grassHeight;
}