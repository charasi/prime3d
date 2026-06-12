#version 300 es
precision mediump float;

in vec3 vNormal;
in vec2 vTextureCoord;
in vec3 vFragPos;

uniform vec3 uDiffuseColor;   // Kd
uniform vec3 uAmbientColor;   // Ka
uniform vec3 uSpecularColor;  // Ks
uniform float uShininess;     // Ns
uniform sampler2D uDiffuseMap; // map_Kd (The Earth Image)

out vec4 fragColor;

void main() {

    vec4 texColor = texture(uDiffuseMap, vTextureCoord);

    fragColor = texColor;
}