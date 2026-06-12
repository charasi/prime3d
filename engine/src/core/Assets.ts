import { AttributeNames, Material, MeshData } from "../misc/types";
import { OBJLoader } from "../loaders/OBJLoader";
import { MTLLoader } from "../loaders/MTLLoader";

export class Assets {
  private _attributes: Map<string, AttributeNames>;
  private _subMeshesData: Map<string, Map<string, MeshData>>;
  private _subMaterial: Map<string, Map<string, Material>>;

  constructor() {
    this._attributes = new Map<string, AttributeNames>();
    this._subMeshesData = new Map<string, Map<string, MeshData>>();
    this._subMaterial = new Map<string, Map<string, Material>>();
  }

  async loadObjects(fileName: string, url: string): Promise<void> {
    try {
      const subMeshData: Map<string, MeshData> = await new OBJLoader(
        fileName,
      ).load(url);
      this._subMeshesData.set(fileName, subMeshData);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getAttributeNames(key: string): AttributeNames | undefined {
    return this._attributes.get(key);
  }

  setAttributeNames(key: string, value: AttributeNames): void {
    this._attributes.set(key, value);
  }

  getMeshesData(key: string, meshName: string): MeshData | undefined {
    const value: Map<string, MeshData> | undefined =
      this._subMeshesData.get(key);

    return value?.get(meshName);
  }

  deleteMeshesData(key: string, meshName: string): void {
    this._subMeshesData.get(key)?.delete(meshName);
  }

  async loadMaterial(fileName: string, url: string): Promise<void> {
    try {
      const materials: Map<string, Material> = await new MTLLoader().load(url);
      this._subMaterial.set(fileName, materials);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getMaterial(key: string, materialName: string): Material | undefined {
    const value: Map<string, Material> | undefined = this._subMaterial.get(key);

    return value?.get(materialName);
  }

  deleteMaterial(key: string, materialName: string): void {
    this._subMaterial.get(key)?.delete(materialName);
  }
}
