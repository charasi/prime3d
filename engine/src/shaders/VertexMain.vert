#version 300 es
precision mediump float;

layout(location = 0) in vec3 a_position;
layout(location = 1) in vec2 a_uv;
layout(location = 2) in vec3 a_normal;

uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

out vec3 vNormal;
out vec2 vTextureCoord;
out vec3 vFragPos;

void main () {
    vec4 worldPos = u_modelMatrix * vec4(a_position, 1.0);
    //vFragPos = worldPos.xyz;

    // The quick-and-dirty normal pass-through
    vNormal = (u_modelMatrix * vec4(a_normal, 0.0)).xyz;
    vTextureCoord = a_uv;

    gl_Position = u_projectionMatrix * u_viewMatrix * worldPos;
}