precision mediump float;

uniform float uTime;
uniform vec2 uResolution;

void main() {
    vec3 color;
    float luminance, z = uTime;

    vec2 fragCoord = gl_FragCoord.xy;

    for(int i = 0; i < 10; i++) {
        vec2 uv, p = fragCoord / uResolution;
        uv = p;
        p -= 0.5;
        p.x *= uResolution.x / uResolution.y;
        z += 0.07;
        luminance = length(p);
        uv += p / luminance * (sin(z) + 1.0) * abs(sin(luminance * 9.0 - z - z));
        color[i] = 0.01 / length(mod(uv, 1.0) - 0.5);
    }

    gl_FragColor = vec4(color / luminance, uTime);
}
