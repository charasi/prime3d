import { Vec3 } from "../../math/vectors/Vec3";
import { Vec2 } from "../../math/vectors/Vec2";

export type Position = Vec3;

export type Normal = Vec3;

export type UV = Vec2;

export interface MeshData {
  position: number[];
  normal: number[];
  uv: number[];
}

//export type SubMesh = Mesh;

export interface Material {
  name: string;
  diffuseColor: Vec3; // Wavefront tag: Kd (The base color)
  ambientColor: Vec3; // Wavefront tag: Ka (Shadow color)
  specularColor: Vec3; // Wavefront tag: Ks (Highlight color)
  shininess: number; // Wavefront tag: Ns (How sharp the highlight is)
  diffuseMap?: string; // Wavefront tag: map_Kd (The URL to an image texture)
}
