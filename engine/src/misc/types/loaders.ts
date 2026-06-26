import { vec2, vec3 } from "gl-matrix";

export type Position = vec3;

export type Normal = vec3;

export type UV = vec2;

export interface MeshData {
  position: number[];
  normal: number[];
  uv: number[];
}

//export type SubMesh = Mesh;

export interface MTLConfig {
  name: string;
  diffuseColor: vec3; // Wavefront tag: Kd (The base color)
  ambientColor: vec3; // Wavefront tag: Ka (Shadow color)
  specularColor: vec3; // Wavefront tag: Ks (Highlight color)
  shininess: number; // Wavefront tag: Ns (How sharp the highlight is)
  diffuseMap?: string; // Wavefront tag: map_Kd (The URL to an image texture)
}
