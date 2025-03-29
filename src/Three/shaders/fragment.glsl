precision mediump float;

        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec3 uGlowColor;

        void main() {
            vec2 uv = gl_FragCoord.xy / uResolution;
            vec2 center = vec2(0.1);

            float dist = distance(uv, center);

            float glow = smoothstep(0.05, 0.1, dist); 
            glow += 0.5 + cos(uTime);

            vec3 color = uGlowColor * glow;

            gl_FragColor = vec4(color, glow);
        }