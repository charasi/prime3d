#version 300 es
precision mediump float;

// --- MATERIAL UNIFORMS ---
uniform vec4  u_ObjectId;

layout(location = 0) out vec4 fragColor;

void main() {
    fragColor = u_ObjectId;
}