precision mediump float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uGlowColor;

varying vec2 vUv;

void main() {
    vec2 center = vec2(0.5);

    // Distance to the center
    float dist = distance(vUv, center);

    // Glow Intensity (controlled with a smoothstep for smoother falloff)
    float glow = smoothstep(0.5, 0.0, dist);

    // Flickering effect using sine waves
    glow += 0.1 * sin(uTime);

    // Final glow color
    vec3 color = uGlowColor * glow;

    gl_FragColor = vec4(color, glow);
}
