import { vec3, mat3, mat4 } from "gl-matrix";
import { toRadians } from "../misc/Utils";

/**
 * Defines the position, rotation, and scale of an object in 3D space.
 * This engine uses a Right-Handed coordinate system where +Y is Up and +Z is points
 * toward screen and +X is right.
 * The transformation matrix is calculated in TRS order (Translation, Rotation, Scale).
 */
export class Transform {
  // position of object
  private readonly _position: vec3;
  private readonly _scale: vec3;
  private readonly _rotation: mat3;

  // angle to rotate the X,Y, and Z axes
  private _rotationX: number = 0;
  private _rotationY: number = 0;
  private _rotationZ: number = 0;

  private readonly _localMatrix: mat4;
  private readonly _worldMatrix: mat4;
  // if object position, rotation, or scale is set then set to true
  // skip updates if these attributes are not set
  private _isDirty: boolean;

  constructor() {
    this._position = vec3.create();
    this._scale = vec3.create();
    vec3.set(this._scale, 1, 1, 1);
    this._rotation = mat3.create();

    this._localMatrix = mat4.create();
    this._worldMatrix = mat4.create();
    this._isDirty = true;
  }

  /**
   *
   * @private
   * Updates object local matrix
   * to be multiplied with parent matrix
   */
  private updateLocalMatrix(): mat4 {
    if (!this._isDirty) {
      return this._localMatrix;
    }

    mat4.identity(this._localMatrix);

    // 1. Apply Translation
    mat4.translate(this._localMatrix, this._localMatrix, this._position);

    mat4.rotateX(
      this._localMatrix,
      this._localMatrix,
      toRadians(this._rotationX),
    );
    mat4.rotateY(
      this._localMatrix,
      this._localMatrix,
      toRadians(this._rotationY),
    );
    mat4.rotateZ(
      this._localMatrix,
      this._localMatrix,
      toRadians(this._rotationZ),
    );

    // 3. Apply Scale
    mat4.scale(this._localMatrix, this._localMatrix, this._scale);

    this._isDirty = false;
    return this._localMatrix;
  }

  /**
   * updates object world matrix
   * @param parentWorldMatrix object parent matrix
   */
  updateWorldMatrix(parentWorldMatrix?: mat4): void {
    this.updateLocalMatrix();
    if (parentWorldMatrix) {
      // Child Object: Inherit absolute position
      mat4.multiply(this._worldMatrix, parentWorldMatrix, this._localMatrix);
      return;
    }

    // Root Object: World space equals Local space
    mat4.copy(this._worldMatrix, this._localMatrix);
  }

  rotateEulerAngles(xDelta: number, yDelta: number, zDelta: number): void {
    this._rotationX += xDelta;
    this._rotationY += yDelta;
    this._rotationZ += zDelta;
    this._isDirty = true;
  }

  /**
   * get object position
   */
  get position(): vec3 {
    return this._position;
  }

  /**
   * set object position
   */
  set position(v: vec3) {
    vec3.copy(this._position, v);
    this._isDirty = true;
  }

  /**
   * get object scale
   */
  get scale(): vec3 {
    return this._scale;
  }

  /**
   * set object scale
   */
  set scale(v: vec3) {
    vec3.copy(this._scale, v);
    this._isDirty = true;
  }

  /**
   * get object world matrix
   */
  get worldMatrix(): mat4 {
    return this._worldMatrix;
  }
}
