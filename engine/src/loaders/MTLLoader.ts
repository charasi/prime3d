import { Vec3 } from "../math/vectors/Vec3";
import { Material } from "../misc/types";

export class MTLLoader {
  materials: Map<string, Material>;
  private activeMaterial: string = "";

  constructor() {
    this.materials = new Map<string, Material>();
  }

  async load(url: string): Promise<Map<string, Material>> {
    const response: Response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const text: string = await response.text();
    this.parse(text);

    return this.materials;
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
          // Safely ignore Ke, Ni, d, illum, etc.
          break;
      }
    }
  }

  private parseNewMaterial(data: string[]): void {
    this.activeMaterial = data[0];

    // Initialize a blank slate for the new material
    const material: Material = {
      name: this.activeMaterial,
      diffuseColor: new Vec3(),
      ambientColor: new Vec3(),
      specularColor: new Vec3(),
      shininess: 0,
    };

    this.materials.set(this.activeMaterial, material);
  }

  private parseShininess(data: string[]): void {
    const material = this.materials.get(this.activeMaterial)!;
    material.shininess = parseFloat(data[0]);
  }

  private parseAmbientColor(data: string[]): void {
    const material = this.materials.get(this.activeMaterial)!;
    material.ambientColor.x = parseFloat(data[0]);
    material.ambientColor.y = parseFloat(data[1]);
    material.ambientColor.z = parseFloat(data[2]);
  }

  private parseDiffuseColor(data: string[]): void {
    const material = this.materials.get(this.activeMaterial)!;
    material.diffuseColor.x = parseFloat(data[0]);
    material.diffuseColor.y = parseFloat(data[1]);
    material.diffuseColor.z = parseFloat(data[2]);
  }

  private parseSpecularColor(data: string[]): void {
    const material = this.materials.get(this.activeMaterial)!;
    material.specularColor.x = parseFloat(data[0]);
    material.specularColor.y = parseFloat(data[1]);
    material.specularColor.z = parseFloat(data[2]);
  }

  private parseDiffuseMap(data: string[]): void {
    const material = this.materials.get(this.activeMaterial)!;

    // 1. Rejoin the string in case the filename had spaces in it
    const fullPath = data.join(" ");

    // 2. Normalize any Windows backslashes into standard forward slashes
    const normalizedPath = fullPath.replace(/\\/g, "/");

    // 3. Split by the slash and grab the very last item (the actual filename)
    const parts = normalizedPath.split("/");
    const filename = parts[parts.length - 1];

    // 4. Save just the safe filename
    material.diffuseMap = filename;
  }
}
