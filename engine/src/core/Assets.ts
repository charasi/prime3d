import { AttributeNames, MeshData, MTLConfig } from "../misc/types";
import { OBJLoader } from "../loaders/OBJLoader";
import { MTLLoader } from "../loaders/MTLLoader";

export class Assets {
  //private _attributes: Map<string, AttributeNames>;
  private _subMeshesData: Map<string, Map<string, MeshData>>;
  private _subMaterial: Map<string, Map<string, MTLConfig>>;

  constructor() {
    //this._attributes = new Map<string, AttributeNames>();
    this._subMeshesData = new Map<string, Map<string, MeshData>>();
    this._subMaterial = new Map<string, Map<string, MTLConfig>>();
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

  /**
  getAttributeNames(key: string): AttributeNames | undefined {
    return this._attributes.get(key);
  }

  setAttributeNames(key: string, value: AttributeNames): void {
    this._attributes.set(key, value);
  }

  deleteAttributeNames(key: string): void {
    this._attributes.delete(key);
  }

  deleteAllAttributeNames(): void {
    this._attributes.clear();
  }*/

  getMeshData(key: string, meshName: string): MeshData | undefined {
    const value: Map<string, MeshData> | undefined =
      this._subMeshesData.get(key);

    return value?.get(meshName);
  }

  getAllMeshDataInFile(fileName: string): Map<string, MeshData> | undefined {
    return this._subMeshesData.get(fileName);
  }

  deleteMeshData(key: string, meshName: string): void {
    this._subMeshesData.get(key)?.delete(meshName);
  }

  async loadMaterial(fileName: string, url: string): Promise<void> {
    try {
      const materials: Map<string, MTLConfig> = await new MTLLoader(
        fileName,
      ).load(url);
      this._subMaterial.set(fileName, materials);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getMaterialData(key: string, materialName: string): MTLConfig | undefined {
    const value: Map<string, MTLConfig> | undefined =
      this._subMaterial.get(key);

    return value?.get(materialName);
  }

  getMaterialDataInFile(fileName: string): Map<string, MTLConfig> | undefined {
    return this._subMaterial.get(fileName);
  }

  deleteMaterialData(key: string, materialName: string): void {
    this._subMaterial.get(key)?.delete(materialName);
  }

  deleteAllMeshData(): void {
    this._subMeshesData.clear();
  }

  deleteAllMeshDataInFile(fileName: string): void {
    this._subMeshesData.delete(fileName);
  }

  deleteAllMaterialData(): void {
    this._subMeshesData.clear();
  }

  deleteAllMaterialDataInFile(fileName: string): void {
    this._subMeshesData.delete(fileName);
  }
}
