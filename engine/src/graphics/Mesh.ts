import { AttributeNames, BufferConfig, MeshData } from "../misc/types";

export class Mesh {
  name: string;
  private _vaoName: string | null = null;
  meshData: MeshData | null = null;

  constructor(name: string, meshData: MeshData) {
    this.name = name;
    this.meshData = meshData;
    this._vaoName = null;
  }

  createVertexData(attrName: AttributeNames): BufferConfig[] {
    if (this.meshData == null) return [];

    const buffers: BufferConfig[] = [];

    const positionData: Float32Array = new Float32Array(this.meshData.position);
    const normalData: Float32Array = new Float32Array(this.meshData.normal);
    const uvData: Float32Array = new Float32Array(this.meshData.uv);

    const positionBuf: BufferConfig = {
      attributeName: attrName.position,
      target: "vertex",
      data: positionData,
      usage: "static",
      size: 3,
    };

    buffers.push(positionBuf);

    const normBuf: BufferConfig = {
      attributeName: attrName.normal,
      target: "vertex",
      data: normalData,
      usage: "static",
      size: 3,
    };

    buffers.push(normBuf);

    if (uvData.length != 0) {
      const uvBuf: BufferConfig = {
        attributeName: attrName.uv,
        target: "vertex",
        data: uvData,
        usage: "static",
        size: 2,
      };

      buffers.push(uvBuf);
    }

    return buffers;
  }

  // A method to clean up CPU memory after the GPU upload is finished
  freeCpuMemory(): void {
    this.meshData = null;
  }

  get vaoName(): string | null {
    return this._vaoName;
  }

  set vaoName(value: string | null) {
    this._vaoName = value;
  }
}
