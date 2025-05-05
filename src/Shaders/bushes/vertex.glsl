varying vec2 vUv;
varying vec3 vNormal;

void main() {

    // Final postion
    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(position, 1.);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Varyings 
    vUv = uv;
    vNormal = normal;
}