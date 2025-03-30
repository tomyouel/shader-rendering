varying vec2 vUv;

void main() {
    float value = vUv.y;
    float smoothValue = smoothstep(0.4, 0.6, value);
    
    gl_FragColor = vec4(vec3(smoothValue), 1.0);
}