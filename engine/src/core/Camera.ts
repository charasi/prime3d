import { Transform } from "./Transform";
import { mat4, vec3 } from "gl-matrix";

export class Camera {
  private _transform: Transform;
  private readonly target: vec3;
  private readonly up: vec3;
  private readonly fov: number;
  private readonly aspect: number;
  private readonly near: number;
  private readonly far: number;
  private readonly _viewMatrix: mat4;
  private readonly _projMatrix: mat4;
  private readonly _worldPosition: vec3;

  constructor(fov: number, aspect: number, near: number, far: number) {
    // 1. Initialize the Spatial Anchor
    this._transform = new Transform();
    this.target = vec3.create(); // Default to looking directly at the origin
    vec3.set(this.target, 0, 0, 0);
    this.up = vec3.create(); // Default to the Y-axis pointing skyward
    vec3.set(this.up, 0, 1, 0);
    this._worldPosition = vec3.create();
    vec3.set(this._worldPosition, 0, 0, 0);

    // 2. Initialize the Lens Parameters
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;

    // 3. Initialize the Memory Caches
    // These are created exactly once to prevent garbage collection spikes
    this._viewMatrix = mat4.create();
    this._projMatrix = mat4.create();
  }

  getViewMatrix(): mat4 {
    // 1. THE FIX: Force the spatial anchor to calculate its matrices before reading them!
    this._transform.updateWorldMatrix();

    // 2. Now it is safe to extract the translation
    mat4.getTranslation(this._worldPosition, this._transform.worldMatrix);

    const eye: vec3 = this._worldPosition;
    const target: vec3 = this.target;
    const up: vec3 = this.up;

    mat4.lookAt(this._viewMatrix, eye, target, up);
    return this._viewMatrix;
  }

  getProjectionMatrix(): mat4 {
    const fov: number = this.fov;
    const aspect: number = this.aspect;
    const near: number = this.near;
    const far: number = this.far;

    mat4.perspective(this._projMatrix, fov, aspect, near, far);

    return this._projMatrix;
  }

  get transform(): Transform {
    return this._transform;
  }
}
