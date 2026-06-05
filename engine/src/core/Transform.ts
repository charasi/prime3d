import { Vec3 } from "../math/vectors/Vec3";
import { Mat4 } from "../math/matrix/Mat4";
import { Mat3 } from "../math/matrix/Mat3";

export class Transform {
  private readonly _position: Vec3;
  private readonly _rotation: Mat3;
  private readonly _scale: Vec3;
  private readonly _localMatrix: Mat4;
  private readonly _worldMatrix: Mat4;
  private _isDirty: boolean;

  constructor() {
    this._position = new Vec3(0, 0, 0);
    this._scale = new Vec3(1, 1, 1);
    this._rotation = new Mat3();
    this._localMatrix = new Mat4();
    this._worldMatrix = new Mat4();
    this._isDirty = true;
  }

  getLocalMatrix(): Mat4 {
    if (!this._isDirty) {
      return this._localMatrix;
    }
    this._localMatrix.fromRotationTranslationScale(
      this._rotation,
      this._position,
      this._scale,
    );

    this._isDirty = false;
    return this._localMatrix;
  }

  updateWorldMatrix(parentWorldMatrix?: Mat4): void {
    this.getLocalMatrix();
    if (parentWorldMatrix) {
      // Child Object: Inherit absolute position
      parentWorldMatrix.multiply(this._localMatrix, this._worldMatrix);
      return;
    }

    // Root Object: World space equals Local space
    this._localMatrix.copy(this._worldMatrix);
  }

  translate(v: Vec3): Vec3 {
    this._position.add(v);
    this._isDirty = true;
    return this._position;
  }

  rotate(angle: number, axis: Vec3): void {
    this._rotation.rotateAA(angle, axis);
    this._isDirty = true;
  }

  setScale(v: Vec3): void {
    this._scale.copy(v);
    this._isDirty = true;
  }

  get position(): Vec3 {
    return this._position;
  }

  get rotation(): Mat3 {
    return this._rotation;
  }

  get scale(): Vec3 {
    return this._scale;
  }

  get localMatrix(): Mat4 {
    return this._localMatrix;
  }

  get worldMatrix(): Mat4 {
    return this._worldMatrix;
  }

  get isDirty(): boolean {
    return this._isDirty;
  }

  set isDirty(value: boolean) {
    this._isDirty = value;
  }
}
