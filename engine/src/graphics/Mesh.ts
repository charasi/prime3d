import { AttributeNames, BufferConfig, SubMesh } from "../misc/types";

export class Mesh {
  name: string;
  mesh: SubMesh;

  constructor(name: string, subMesh: SubMesh) {
    this.name = name;
    this.mesh = subMesh;
  }

  createVertexData(attrName: AttributeNames): BufferConfig[] {
    if (this.mesh == null) return [];

    const buffers: BufferConfig[] = [];

    const positionData: Float32Array = new Float32Array(this.mesh.position);
    const normalData: Float32Array = new Float32Array(this.mesh.normal);
    const uvData: Float32Array = new Float32Array(this.mesh.uv);

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
}
