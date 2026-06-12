#version 300 es
precision mediump float;

// attributes
in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTextureCoord;

// uniforms
uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

// out
out vec3 vNormal;
out vec2 vTextureCoord;
out vec3 vFragPos;

vec4 a_position = vec4(aVertexPosition, 1.0);
vec4 a_normal = vec4(aVertexNormal, 0.0);
vec2 a_uv = aTextureCoord;



void main () {

    gl_Position = uProjectionMatrix * uViewMatrix * uWorldMatrix * a_position;
    vTextureCoord = a_uv;
    vFragPos = (uWorldMatrix * a_position).xyz;
    vNormal = (uWorldMatrix * a_normal).xyz;
}

