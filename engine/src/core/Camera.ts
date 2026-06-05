import { Transform } from "./Transform";
import { Vec3 } from "../math/vectors/Vec3";
import { Mat4 } from "../math/matrix/Mat4";

export class Camera {
  private transform: Transform;
  private readonly target: Vec3;
  private readonly up: Vec3;
  private readonly fov: number;
  private readonly aspect: number;
  private readonly near: number;
  private readonly far: number;
  private readonly _viewMatrix: Mat4;
  private readonly _projMatrix: Mat4;
  private readonly _worldPosition: Vec3;

  constructor(fov: number, aspect: number, near: number, far: number) {
    // 1. Initialize the Spatial Anchor
    this.transform = new Transform();
    this.target = new Vec3(0, 0, 0); // Default to looking directly at the origin
    this.up = new Vec3(0, 1, 0); // Default to the Y-axis pointing skyward
    this._worldPosition = new Vec3(0, 0, 0);

    // 2. Initialize the Lens Parameters
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;

    // 3. Initialize the Memory Caches
    // These are created exactly once to prevent garbage collection spikes
    this._viewMatrix = new Mat4();
    this._projMatrix = new Mat4();
  }

  getViewMatrix() {
    const eye: Vec3 = this.transform.worldMatrix.getTranslation(
      this._worldPosition,
    );
    const target: Vec3 = this.target;
    const up: Vec3 = this.up;

    this._viewMatrix.lookAt(eye, target, up);
    return this._viewMatrix;
  }

  getProjectionMatrix(): Mat4 {
    const fov: number = this.fov;
    const aspect: number = this.aspect;
    const near: number = this.near;
    const far: number = this.far;

    this._projMatrix.perspective(fov, aspect, near, far);

    return this._projMatrix;
  }
}
