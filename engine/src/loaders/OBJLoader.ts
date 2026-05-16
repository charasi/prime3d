import { Normal, Position, SubMesh, UV } from "../misc/types";
import { Vec3 } from "../math/vectors/Vec3";
import { Vec2 } from "../math/vectors/Vec2";

export class OBJLoader {
  name: string;
  tempPositions: Position[];
  tempNormals: Normal[];
  tempUVs: UV[];
  activeMaterial: string = "default";

  subMeshes: Map<string, SubMesh>;

  constructor(name: string) {
    this.name = name;
    this.tempPositions = [];
    this.tempNormals = [];
    this.tempUVs = [];

    this.subMeshes = new Map<string, SubMesh>();

    const subMesh: SubMesh = {
      position: [],
      uv: [],
      normal: [],
    };
    this.subMeshes.set("default", subMesh);
  }

  async load(url: string): Promise<Map<string, SubMesh>> {
    const response: Response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const text: string = await response.text();

    this.parse(text);
    return this.subMeshes;
  }

  private parse(file: string): void {
    const lines: string[] = file.split("\n");

    for (let line of lines) {
      line = line.trim();

      if (line.length === 0) continue;

      if (line.startsWith("#")) continue;

      const tokens: string[] = line.split(" ");
      const prefix: string = tokens[0];
      const data: string[] = tokens.slice(1);

      switch (prefix) {
        case "v":
          this.parsePosition(data);
          break;
        case "vt":
          this.parseUV(data);
          break;
        case "vn":
          this.parseNormal(data);
          break;
        case "usemtl":
          this.parseMaterial(data);
          break;
        case "f":
          this.parseFace(data);
          break;
        default:
          break;
      }
    }
  }

  private parsePosition(data: string[]): void {
    const vec3: Vec3 = new Vec3();
    vec3.x = parseFloat(data[0]);
    vec3.y = parseFloat(data[1]);
    vec3.z = parseFloat(data[2]);
    this.tempPositions.push(vec3);
  }

  private parseUV(data: string[]): void {
    const vec2: Vec2 = new Vec2();
    vec2.x = parseFloat(data[0]);
    vec2.y = parseFloat(data[1]);
    this.tempUVs.push(vec2);
  }

  private parseNormal(data: string[]): void {
    const vec3: Vec3 = new Vec3();
    vec3.x = parseFloat(data[0]);
    vec3.y = parseFloat(data[1]);
    vec3.z = parseFloat(data[2]);
    this.tempNormals.push(vec3);
  }

  private parseMaterial(data: string[]): void {
    this.activeMaterial = data[0];

    const bool: boolean = this.subMeshes.has(this.activeMaterial);
    if (!bool) {
      const subMesh: SubMesh = {
        position: [],
        uv: [],
        normal: [],
      };
      this.subMeshes.set(this.activeMaterial, subMesh);
    }
  }

  private parseFace(data: string[]): void {
    const mesh: SubMesh = this.subMeshes.get(this.activeMaterial)!; // Safe because of our Map structure

    for (let face of data) {
      const indices: string[] = face.split("/");

      // 1. Position is ALWAYS guaranteed in an OBJ file
      const posIndex = parseInt(indices[0]) - 1;
      const position = this.tempPositions[posIndex];
      mesh.position.push(position.x, position.y, position.z);

      // 2. Safely handle missing UVs
      if (indices.length > 1 && indices[1] !== "") {
        const uvIndex = parseInt(indices[1]) - 1;
        const uv = this.tempUVs[uvIndex];
        mesh.uv.push(uv.x, uv.y);
      } else {
        // Dummy fallback to keep WebGL happy
        mesh.uv.push(0, 0);
      }

      // 3. Safely handle missing Normals
      if (indices.length > 2 && indices[2] !== "") {
        const normIndex = parseInt(indices[2]) - 1;
        const normal = this.tempNormals[normIndex];
        mesh.normal.push(normal.x, normal.y, normal.z);
      } else {
        // Dummy fallback (pointing straight up)
        mesh.normal.push(0, 1, 0);
      }
    }
  }
}
