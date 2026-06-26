#version 300 es
precision mediump float;

in vec3 vNormal;
in vec2 vTextureCoord;
in vec3 vFragPos;

// --- MATERIAL UNIFORMS ---
// These perfectly match what Material.fromMTL() is sending to the GPU!
uniform vec3 u_diffuseColor;   // Kd
uniform vec3 u_ambientColor;   // Ka
uniform vec3 u_specularColor;  // Ks
uniform float u_shininess;     // Ns

uniform sampler2D u_earthSampler;

out vec4 fragColor;

void main() {
    // For now, we are still just outputting the flat diffuse color
    // to prove the geometry works before we write the lighting math.
    //fragColor = vec4(u_specularColor, 1.0);
    //fragColor = vec4(0.0, 0.0, 1.0, 0.08);
    fragColor = texture(u_earthSampler, vTextureCoord);
}