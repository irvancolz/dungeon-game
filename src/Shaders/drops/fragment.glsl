uniform sampler2D uAlphaTexture;

varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    vec3 color = vec3(1., 0., 0.);

    float alpha = texture(uAlphaTexture, uv).r;

    gl_FragColor = vec4(color, alpha);

}