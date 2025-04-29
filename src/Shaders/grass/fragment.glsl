uniform vec3 uColor;
uniform sampler2D uCemeteryTexture;
uniform vec3 uPlayerPosition;

varying vec2 vUv;
varying vec2 vWorldUv;
varying vec3 vPosition;

void main() {

    vec3 color = uColor;

    vec3 cemeteryColor = texture(uCemeteryTexture, vWorldUv).rgb;
    cemeteryColor = smoothstep(.2, 1., cemeteryColor);

    // color = cemeteryColor;
    if(cemeteryColor.g <= 0.) {
        discard;
    }

    gl_FragColor = vec4(color, 1.);
}