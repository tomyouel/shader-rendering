precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = (fragCoord - 0.5 * u_resolution) / u_resolution.y;

    float r = length(uv);
    float theta = atan(uv.y, uv.x);

    float sum = 0.0;

    for (int i = 0; i < 60; i++) {
        float fi = float(i);
        float freq = 120.0 + fi * 3.0;
        float rad = sin(fi * 0.01 + 0.20);
        float wave = rad + 0.003 * sin(freq * theta + u_time * 10.0);

        float dist = abs(r - wave);
        sum += smoothstep(0.003, 0.0005, dist);
    }

    sum = clamp(sum, 0.0, 1.0);

    vec3 bg = vec3(0.92, 1.0, 0.92);
    vec3 fg = vec3(0.3, 0.6, 0.3);
    vec3 color = mix(bg, fg, sum);

    gl_FragColor = vec4(color, 1.0);
}
