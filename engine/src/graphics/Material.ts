import { Vec3 } from "../math/vectors/Vec3";
import { Mat4 } from "../math/matrix/Mat4";
import { Vec4 } from "../math/vectors/Vec4";
import { Vec2 } from "../math/vectors/Vec2";
import { Mat3 } from "../math/matrix/Mat3";
import { ShaderUniformData, UniformType } from "../misc/types";

export class Material {
  private readonly _name: string;
  // Maps the GLSL variable name to the data type and the raw numbers
  private uniforms: Map<string, { type: UniformType; data: any }>;

  constructor(name: string) {
    this._name = name;
    this.uniforms = new Map();
  }

  setVec3(name: string, vec3: Vec3): void {
    const floatArray = new Float32Array(3);

    vec3.toArray(floatArray);

    this.uniforms.set(name, { type: "vec3", data: floatArray });
  }

  setMat4(name: string, matrix: Mat4): void {
    const rawNumbers = matrix.elements;

    const floatArray = new Float32Array(rawNumbers);

    this.uniforms.set(name, { type: "mat4", data: floatArray });
  }

  setFloat(name: string, value: number): void {
    this.uniforms.set(name, { type: "float", data: value });
  }

  setInt(name: string, value: number): void {
    this.uniforms.set(name, { type: "int", data: value });
  }

  setVec4(name: string, vec4: Vec4): void {
    const floatArray = new Float32Array(4);

    vec4.toArray(floatArray);

    this.uniforms.set(name, { type: "vec4", data: floatArray });
  }

  setVec2(name: string, vec2: Vec2): void {
    const floatArray = new Float32Array(2);

    vec2.toArray(floatArray);

    this.uniforms.set(name, { type: "vec2", data: floatArray });
  }

  setMat3(name: string, matrix: Mat3): void {
    const rawNumbers = matrix.elements;

    const floatArray = new Float32Array(rawNumbers);

    this.uniforms.set(name, { type: "mat3", data: floatArray });
  }

  get name(): string {
    return this._name;
  }

  extractUniforms(): ShaderUniformData[] {
    const uniformValues: ShaderUniformData[] = [];
    this.uniforms.forEach((value, key) => {
      const uniformType: UniformType = value.type;
      const shaderUniformData: ShaderUniformData = {
        pgmName: this._name,
        uniformName: key,
        type: uniformType,
        data: value.data,
      };

      uniformValues.push(shaderUniformData);
    });
    return uniformValues;
  }
}
