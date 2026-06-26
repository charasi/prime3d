import { MTLConfig, ShaderUniformData, UniformType } from "../misc/types";
import { mat3, mat4, vec2, vec3, vec4 } from "gl-matrix";

export class Material {
  private readonly _name: string;
  // Maps the GLSL variable name to the data type and the raw numbers
  private uniforms: Map<string, { type: UniformType; data: any }>;
  public diffuseMapPath?: string;

  constructor(name: string) {
    this._name = name;
    this.uniforms = new Map();
  }

  /**
   * Factory method to generate a ready-to-render engine Material
   * directly from parsed MTL properties.
   */
  static fromMTL(config: MTLConfig): Material {
    const mat = new Material(config.name);

    // Map the raw data to the uniform names you are tracking in your Uber Shader.
    // Adjust "u_Ka", "u_Kd", etc., to match your actual GLSL uniform names.
    mat.setVec3("u_ambientColor", config.ambientColor);
    mat.setVec3("u_diffuseColor", config.diffuseColor);
    mat.setVec3("u_specularColor", config.specularColor);
    mat.setFloat("u_shininess", config.shininess);

    if (config.diffuseMap) {
      // Store the texture path. The actual WebGL texture binding
      // will be handled by your rendering pipeline later.
      mat.diffuseMapPath = config.diffuseMap;
    }

    return mat;
  }

  setVec3(name: string, v: vec3): void {
    let uniform = this.uniforms.get(name);
    if (!uniform) {
      uniform = { type: "vec3", data: vec3.create() };
      this.uniforms.set(name, uniform);
    }
    vec3.copy(uniform.data as vec3, v);
  }

  setMat4(name: string, m: mat4): void {
    let uniform = this.uniforms.get(name);
    if (!uniform) {
      uniform = { type: "mat4", data: mat4.create() };
      this.uniforms.set(name, uniform);
    }
    mat4.copy(uniform.data as mat4, m);
  }

  setFloat(name: string, value: number): void {
    this.uniforms.set(name, { type: "float", data: value });
  }

  setInt(name: string, value: number): void {
    this.uniforms.set(name, { type: "int", data: value });
  }

  setVec4(name: string, v: vec4): void {
    let uniform = this.uniforms.get(name);
    if (!uniform) {
      uniform = { type: "vec4", data: vec4.create() };
      this.uniforms.set(name, uniform);
    }
    vec4.copy(uniform.data as vec4, v);
  }

  setVec2(name: string, v: vec2): void {
    let uniform = this.uniforms.get(name);
    if (!uniform) {
      uniform = { type: "vec2", data: vec2.create() };
      this.uniforms.set(name, uniform);
    }
    vec2.copy(uniform.data as vec2, v);
  }

  setMat3(name: string, m: mat3): void {
    let uniform = this.uniforms.get(name);
    if (!uniform) {
      uniform = { type: "mat3", data: mat3.create() };
      this.uniforms.set(name, uniform);
    }
    mat3.copy(uniform.data as mat3, m);
  }

  get name(): string {
    return this._name;
  }

  extractUniforms(targetProgramName: string): ShaderUniformData[] {
    const uniformValues: ShaderUniformData[] = [];

    this.uniforms.forEach((value, key) => {
      uniformValues.push({
        pgmName: targetProgramName, // ✅ Safely targets the active shader
        uniformName: key,
        type: value.type,
        data: value.data,
      });
    });

    return uniformValues;
  }
}
