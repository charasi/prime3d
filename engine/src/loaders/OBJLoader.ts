import { MeshData, Normal, Position, UV } from "../misc/types";
import { vec2, vec3 } from "gl-matrix";

export class OBJLoader {
  name: string;
  tempPositions: Position[];
  tempNormals: Normal[];
  tempUVs: UV[];

  // Track both the object state and material state
  activeObject: string = "default_object";
  activeMaterial: string;

  subMeshes: Map<string, MeshData>;

  constructor(name: string) {
    this.name = name;
    this.tempPositions = [];
    this.tempNormals = [];
    this.tempUVs = [];
    this.subMeshes = new Map<string, MeshData>();

    // Initialize the baseline fallback key
    this.activeMaterial = `${this.name}_${this.activeObject}_default`;

    const subMesh: MeshData = {
      position: [],
      uv: [],
      normal: [],
    };
    this.subMeshes.set(this.activeMaterial, subMesh);
  }

  async load(url: string): Promise<Map<string, MeshData>> {
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
        case "o":
        case "g":
          this.parseObject(data);
          break;
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

  private parseObject(data: string[]): void {
    // Update the state machine when a new object or group is declared
    this.activeObject = data[0];
  }

  private parsePosition(data: string[]): void {
    const v: vec3 = vec3.create();
    vec3.set(v, parseFloat(data[0]), parseFloat(data[1]), parseFloat(data[2]));
    this.tempPositions.push(v);
  }

  private parseUV(data: string[]): void {
    const v: vec2 = vec2.create();
    vec2.set(v, parseFloat(data[0]), parseFloat(data[1]));
    this.tempUVs.push(v);
  }

  private parseNormal(data: string[]): void {
    const v: vec3 = vec3.create();
    vec3.set(v, parseFloat(data[0]), parseFloat(data[1]), parseFloat(data[2]));
    this.tempNormals.push(v);
  }

  private parseMaterial(data: string[]): void {
    // Generate the compound key: e.g., "earth_door_Material.002"
    // For materials that apply to the whole mesh, it will be "earth_default_object_Material.002"
    //this.activeMaterial = `${this.name}_${data[0]}`;
    this.activeMaterial = `${this.name}_${this.activeObject}_${data[0]}`;

    const bool: boolean = this.subMeshes.has(this.activeMaterial);
    if (!bool) {
      const subMesh: MeshData = {
        position: [],
        uv: [],
        normal: [],
      };
      this.subMeshes.set(this.activeMaterial, subMesh);
    }
  }

  private parseFace(data: string[]): void {
    const meshData: MeshData = this.subMeshes.get(this.activeMaterial)!;

    for (let face of data) {
      const indices: string[] = face.split("/");

      const posIndex: number = parseInt(indices[0]) - 1;
      const position: vec3 = this.tempPositions[posIndex];
      meshData.position.push(position[0], position[1], position[2]);

      if (indices.length > 1 && indices[1] !== "") {
        const uvIndex = parseInt(indices[1]) - 1;
        const uv = this.tempUVs[uvIndex];
        meshData.uv.push(uv[0], uv[1]);
      } else {
        meshData.uv.push(0, 0);
      }

      if (indices.length > 2 && indices[2] !== "") {
        const normIndex: number = parseInt(indices[2]) - 1;
        const normal: vec3 = this.tempNormals[normIndex];
        meshData.normal.push(normal[0], normal[1], normal[2]);
      } else {
        meshData.normal.push(0, 1, 0);
      }
    }
  }
}
