import { vec3, mat3, mat4 } from "gl-matrix";
import { toRadians } from "../misc/Utils";

export class Transform {
  private readonly _position: vec3;
  private readonly _rotation: mat3;
  //private readonly _rotationX: mat4;
  // private readonly _rotationY: mat4;
  //private readonly _rotationZ: mat4;
  private _rotationX: number = 0;
  private _rotationY: number = 0;
  private _rotationZ: number = 0;
  private readonly _eulerA: mat4;
  private readonly _scale: vec3;
  private readonly _localMatrix: mat4;
  private readonly _worldMatrix: mat4;
  private _isDirty: boolean;

  constructor() {
    this._position = vec3.create();
    this._scale = vec3.create();
    vec3.set(this._scale, 1, 1, 1);
    this._rotation = mat3.create();
    //this._rotationX = mat4.create();
    //this._rotationY = mat4.create();
    // this._rotationZ = mat4.create();
    this._eulerA = mat4.create();
    this._localMatrix = mat4.create();
    this._worldMatrix = mat4.create();
    this._isDirty = true;
  }

  getLocalMatrix(): mat4 {
    if (!this._isDirty) {
      return this._localMatrix;
    }
    mat4.identity(this._localMatrix);

    // 1. Apply Translation
    mat4.translate(this._localMatrix, this._localMatrix, this._position);

    // 2. Apply Rotation (Safely casting your mat3 into a mat4)
    //const r = this._eulerA;

    //mat4.multiply(this._localMatrix, this._localMatrix, r);
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

  updateWorldMatrix(parentWorldMatrix?: mat4): void {
    this.getLocalMatrix();
    if (parentWorldMatrix) {
      // Child Object: Inherit absolute position
      mat4.multiply(this._worldMatrix, parentWorldMatrix, this._localMatrix);
      return;
    }

    // Root Object: World space equals Local space
    // mat4.copy(out, source)
    mat4.copy(this._worldMatrix, this._localMatrix);
  }

  translate(v: vec3): vec3 {
    vec3.add(this._position, this._position, v);
    this._isDirty = true;
    return this._position;
  }

  rotate(angle: number): void {
    const rad: number = toRadians(angle);
    mat3.rotate(this._rotation, this._rotation, rad);
    this._isDirty = true;
  }

  /**
  rotateX(angle: number): void {
    const rad: number = toRadians(angle);
    mat4.rotateX(this._rotationX, this._rotationX, rad);
    this._isDirty = true;
  }

  rotateY(angle: number): void {
    const rad: number = toRadians(angle);
    mat4.rotateY(this._rotationY, this._rotationY, rad);
    this._isDirty = true;
  }

  rotateZ(angle: number): void {
    const rad: number = toRadians(angle);
    mat4.rotateZ(this._rotationZ, this._rotationZ, rad);
    this._isDirty = true;
  }*/

  rotateEulerAngles(xDelta: number, yDelta: number, zDelta: number): void {
    this._rotationX += xDelta;
    this._rotationY += yDelta;
    this._rotationZ += zDelta;
    this._isDirty = true;
  }

  fromRotation(angle: number): void {
    const rad: number = toRadians(angle);
    mat3.fromRotation(this._rotation, rad);
    this._isDirty = true;
  }

  scaleBy(n: number): void {
    vec3.scale(this._scale, this._scale, n);
    this._isDirty = true;
  }

  get position(): vec3 {
    return this._position;
  }

  get rotation(): mat3 {
    return this._rotation;
  }

  get scale(): vec3 {
    return this._scale;
  }

  get localMatrix(): mat4 {
    return this._localMatrix;
  }

  get worldMatrix(): mat4 {
    return this._worldMatrix;
  }

  get isDirty(): boolean {
    return this._isDirty;
  }

  set isDirty(value: boolean) {
    this._isDirty = value;
  }
}
