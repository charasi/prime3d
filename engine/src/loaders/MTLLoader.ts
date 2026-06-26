import { MTLConfig } from "../misc/types";
import { vec3 } from "gl-matrix";

export class MTLLoader {
  name: string;
  private _materials: Map<string, MTLConfig>;
  private activeMaterial: string = "";

  constructor(name: string) {
    this.name = name;
    this._materials = new Map<string, MTLConfig>();
  }

  async load(url: string): Promise<Map<string, MTLConfig>> {
    const response: Response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const text: string = await response.text();
    this.parse(text);

    return this._materials;
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
        case "newmtl":
          this.parseNewMaterial(data);
          break;
        case "Ns":
          this.parseShininess(data);
          break;
        case "Ka":
          this.parseAmbientColor(data);
          break;
        case "Kd":
          this.parseDiffuseColor(data);
          break;
        case "Ks":
          this.parseSpecularColor(data);
          break;
        case "map_Kd":
          this.parseDiffuseMap(data);
          break;
        default:
          break;
      }
    }
  }

  private parseNewMaterial(data: string[]): void {
    // Prefix the raw name with the model name to guarantee uniqueness
    this.activeMaterial = `${this.name}_${data[0]}`;

    const material: MTLConfig = {
      name: this.activeMaterial,
      diffuseColor: vec3.create(),
      ambientColor: vec3.create(),
      specularColor: vec3.create(),
      shininess: 0,
    };

    this._materials.set(this.activeMaterial, material);
  }

  private parseShininess(data: string[]): void {
    const material = this._materials.get(this.activeMaterial)!;
    material.shininess = parseFloat(data[0]);
  }

  private parseAmbientColor(data: string[]): void {
    const material: MTLConfig = this._materials.get(this.activeMaterial)!;
    vec3.set(
      material.ambientColor,
      parseFloat(data[0]) || 0,
      parseFloat(data[1]) || 0,
      parseFloat(data[2]) || 0,
    );
  }

  private parseDiffuseColor(data: string[]): void {
    const material: MTLConfig = this._materials.get(this.activeMaterial)!;
    vec3.set(
      material.diffuseColor,
      parseFloat(data[0]) || 0,
      parseFloat(data[1]) || 0,
      parseFloat(data[2]) || 0,
    );
  }

  private parseSpecularColor(data: string[]): void {
    const material: MTLConfig = this._materials.get(this.activeMaterial)!;
    vec3.set(
      material.specularColor,
      parseFloat(data[0]) || 0,
      parseFloat(data[1]) || 0,
      parseFloat(data[2]) || 0,
    );
  }

  private parseDiffuseMap(data: string[]): void {
    //debugger;
    const material: MTLConfig = this._materials.get(this.activeMaterial)!;
    const fullPath: string = data.join(" ");
    const normalizedPath = fullPath.replace(/\\/g, "/");
    const parts = normalizedPath.split("/");
    //material.diffuseMap = parts[parts.length - 1];
    material.diffuseMap = fullPath;
  }
}
