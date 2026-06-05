import { toRadians } from "../../misc/Utils";
import { Vec3 } from "../vectors/Vec3";
import { Mat3 } from "./Mat3";

export class Mat4 {
  private _values: number[];
  private _rotateXMat3: Mat4 = new Mat4();
  private _rotateYMat3: Mat4 = new Mat4();
  private _rotateZMat3: Mat4 = new Mat4();
  private _rotateAA: Mat4 = new Mat4();
  private _scaleMat4: Mat4 = new Mat4();
  private _scaleAA: Mat4 = new Mat4();
  private _projectAA: Mat4 = new Mat4();
  private _reflectAA: Mat4 = new Mat4();
  private _shearXYMat4: Mat4 = new Mat4();
  private _shearXZMat4: Mat4 = new Mat4();
  private _shearYZMat4: Mat4 = new Mat4();
  private _translateMat4: Mat4 = new Mat4();
  private _f: Vec3 = new Vec3();
  private _r: Vec3 = new Vec3();
  private _u: Vec3 = new Vec3();
  constructor(values?: number[]) {
    if (values) {
      this._values = values;
    } else {
      // Default to identity matrix in column-major order
      this._values = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }
  }

  scalar(s: number, out?: Mat4): Mat4 {
    if (out) {
      const elements: number[] = out.elements;

      for (let i = 0; i < elements.length; i++) {
        elements[i] = s * this._values[i];
      }

      return out;
    }

    for (let i = 0; i < this._values.length; i++) {
      this._values[i] = s * this._values[i];
    }

    return this;
  }

  multiply(mat4: Mat4, out?: Mat4): Mat4 {
    const mat: number[] = mat4.elements;

    const c00: number = mat[0],
      c01: number = mat[1],
      c02: number = mat[2],
      c03: number = mat[3];

    const c10: number = mat[4],
      c11: number = mat[5],
      c12: number = mat[6],
      c13: number = mat[7];

    const c20: number = mat[8],
      c21: number = mat[9],
      c22: number = mat[10],
      c23: number = mat[11];

    const c30: number = mat[12],
      c31: number = mat[13],
      c32: number = mat[14],
      c33: number = mat[15];

    const r00: number = this._values[0],
      r01: number = this._values[4],
      r02: number = this._values[8],
      r03: number = this._values[12];

    const r10: number = this._values[1],
      r11: number = this._values[5],
      r12: number = this._values[9],
      r13: number = this._values[13];

    const r20: number = this._values[2],
      r21: number = this._values[6],
      r22: number = this._values[10],
      r23: number = this._values[14];

    const r30: number = this._values[3],
      r31: number = this._values[7],
      r32: number = this._values[11],
      r33: number = this._values[15];

    if (out) {
      const elements: number[] = out.elements;
      elements[0] = r00 * c00 + r01 * c01 + r02 * c02 + r03 * c03;
      elements[4] = r00 * c10 + r01 * c11 + r02 * c12 + r03 * c13;
      elements[8] = r00 * c20 + r01 * c21 + r02 * c22 + r03 * c23;
      elements[12] = r00 * c30 + r01 * c31 + r02 * c32 + r03 * c33;
      elements[1] = r10 * c00 + r11 * c01 + r12 * c02 + r13 * c03;
      elements[5] = r10 * c10 + r11 * c11 + r12 * c12 + r13 * c13;
      elements[9] = r10 * c20 + r11 * c21 + r12 * c22 + r13 * c23;
      elements[13] = r10 * c30 + r11 * c31 + r12 * c32 + r13 * c33;
      elements[2] = r20 * c00 + r21 * c01 + r22 * c02 + r23 * c03;
      elements[6] = r20 * c10 + r21 * c11 + r22 * c12 + r23 * c13;
      elements[10] = r20 * c20 + r21 * c21 + r22 * c22 + r23 * c23;
      elements[14] = r20 * c30 + r21 * c31 + r22 * c32 + r23 * c33;
      elements[3] = r30 * c00 + r31 * c01 + r32 * c02 + r33 * c03;
      elements[7] = r30 * c10 + r31 * c11 + r32 * c12 + r33 * c13;
      elements[11] = r30 * c20 + r31 * c21 + r32 * c22 + r33 * c23;
      elements[15] = r30 * c30 + r31 * c31 + r32 * c32 + r33 * c33;
      return out;
    }

    this._values[0] = r00 * c00 + r01 * c01 + r02 * c02 + r03 * c03;
    this._values[4] = r00 * c10 + r01 * c11 + r02 * c12 + r03 * c13;
    this._values[8] = r00 * c20 + r01 * c21 + r02 * c22 + r03 * c23;
    this._values[12] = r00 * c30 + r01 * c31 + r02 * c32 + r03 * c33;
    this._values[1] = r10 * c00 + r11 * c01 + r12 * c02 + r13 * c03;
    this._values[5] = r10 * c10 + r11 * c11 + r12 * c12 + r13 * c13;
    this._values[9] = r10 * c20 + r11 * c21 + r12 * c22 + r13 * c23;
    this._values[13] = r10 * c30 + r11 * c31 + r12 * c32 + r13 * c33;
    this._values[2] = r20 * c00 + r21 * c01 + r22 * c02 + r23 * c03;
    this._values[6] = r20 * c10 + r21 * c11 + r22 * c12 + r23 * c13;
    this._values[10] = r20 * c20 + r21 * c21 + r22 * c22 + r23 * c23;
    this._values[14] = r20 * c30 + r21 * c31 + r22 * c32 + r23 * c33;
    this._values[3] = r30 * c00 + r31 * c01 + r32 * c02 + r33 * c03;
    this._values[7] = r30 * c10 + r31 * c11 + r32 * c12 + r33 * c13;
    this._values[11] = r30 * c20 + r31 * c21 + r32 * c22 + r33 * c23;
    this._values[15] = r30 * c30 + r31 * c31 + r32 * c32 + r33 * c33;
    return this;
  }

  transpose(out?: Mat4): Mat4 {
    // diagonal
    const idx0: number = this._values[0];
    const idx5: number = this._values[5];
    const idx10: number = this._values[10];
    const idx15: number = this._values[15];

    const idx1: number = this._values[1];
    const idx2: number = this._values[2];
    const idx3: number = this._values[3];
    const idx4: number = this._values[4];
    const idx6: number = this._values[6];
    const idx7: number = this._values[7];
    const idx8: number = this._values[8];
    const idx9: number = this._values[9];
    const idx11: number = this._values[11];
    const idx12: number = this._values[12];
    const idx13: number = this._values[13];
    const idx14: number = this._values[14];
    if (out) {
      out.elements[0] = idx0;
      out.elements[1] = idx4;
      out.elements[2] = idx8;
      out.elements[3] = idx12;
      out.elements[4] = idx1;
      out.elements[5] = idx5;
      out.elements[6] = idx9;
      out.elements[7] = idx13;
      out.elements[8] = idx2;
      out.elements[9] = idx6;
      out.elements[10] = idx10;
      out.elements[11] = idx14;
      out.elements[12] = idx3;
      out.elements[13] = idx7;
      out.elements[14] = idx11;
      out.elements[15] = idx15;
      return out;
    }

    this._values[1] = idx4;
    this._values[2] = idx8;
    this._values[3] = idx12;
    this._values[4] = idx1;
    this._values[6] = idx9;
    this._values[7] = idx13;
    this._values[8] = idx2;
    this._values[9] = idx6;
    this._values[11] = idx14;
    this._values[12] = idx3;
    this._values[13] = idx7;
    this._values[14] = idx11;
    return this;
  }

  rotateXAngle(angle: number) {
    const rad: number = toRadians(angle);

    this._rotateXMat3.elements[0] = 1;
    this._rotateXMat3.elements[1] = 0;
    this._rotateXMat3.elements[2] = 0;
    this._rotateXMat3.elements[3] = 0;
    this._rotateXMat3.elements[4] = 0;
    this._rotateXMat3.elements[5] = Math.cos(rad);
    this._rotateXMat3.elements[6] = Math.sin(rad);
    this._rotateXMat3.elements[7] = 0;
    this._rotateXMat3.elements[8] = 0;
    this._rotateXMat3.elements[9] = -Math.sin(rad);
    this._rotateXMat3.elements[10] = Math.cos(rad);
    this._rotateXMat3.elements[11] = 0;
    this._rotateXMat3.elements[12] = 0;
    this._rotateXMat3.elements[13] = 0;
    this._rotateXMat3.elements[14] = 0;
    this._rotateXMat3.elements[15] = 1;
  }

  rotateYAngle(angle: number) {
    const rad: number = toRadians(angle);

    this._rotateYMat3.elements[0] = Math.cos(rad);
    this._rotateYMat3.elements[1] = 0;
    this._rotateYMat3.elements[2] = -Math.sin(rad);
    this._rotateYMat3.elements[3] = 0;
    this._rotateYMat3.elements[4] = 0;
    this._rotateYMat3.elements[5] = 1;
    this._rotateYMat3.elements[6] = 0;
    this._rotateYMat3.elements[7] = 0;
    this._rotateYMat3.elements[8] = Math.sin(rad);
    this._rotateYMat3.elements[9] = 0;
    this._rotateYMat3.elements[10] = Math.cos(rad);
    this._rotateYMat3.elements[11] = 0;
    this._rotateYMat3.elements[12] = 0;
    this._rotateYMat3.elements[13] = 0;
    this._rotateYMat3.elements[14] = 0;
    this._rotateYMat3.elements[15] = 1;
  }

  rotateZAngle(angle: number) {
    const rad: number = toRadians(angle);

    this._rotateZMat3.elements[0] = Math.cos(rad);
    this._rotateZMat3.elements[1] = Math.sin(rad);
    this._rotateZMat3.elements[2] = 0;
    this._rotateZMat3.elements[3] = 0;
    this._rotateZMat3.elements[4] = -Math.sin(rad);
    this._rotateZMat3.elements[5] = Math.cos(rad);
    this._rotateZMat3.elements[6] = 0;
    this._rotateZMat3.elements[7] = 0;
    this._rotateZMat3.elements[8] = 0;
    this._rotateZMat3.elements[9] = 0;
    this._rotateZMat3.elements[10] = 1;
    this._rotateZMat3.elements[11] = 0;
    this._rotateZMat3.elements[12] = 0;
    this._rotateZMat3.elements[13] = 0;
    this._rotateZMat3.elements[14] = 0;
    this._rotateZMat3.elements[15] = 1;
  }

  rotate(type: string, out?: Mat4): Mat4 {
    let axis: Mat4;
    switch (type) {
      case "x":
        axis = this._rotateXMat3;
        break;
      case "y":
        axis = this._rotateYMat3;
        break;
      case "z":
        axis = this._rotateZMat3;
        break;
      case "a":
        axis = this._rotateAA;
        break;
      default:
        return this;
    }

    if (out) {
      return this.multiply(axis, out);
    }

    return this.multiply(axis);
  }

  rotateAA(angle: number, n: Vec3): void {
    n.normalize();
    const rad: number = toRadians(angle);
    const c: number = Math.cos(rad);
    const s: number = Math.sin(rad);
    const d: number = 1 - c;

    this._rotateAA.elements[0] = n.x * n.x * d + c;
    this._rotateAA.elements[1] = n.y * n.x * d + n.z * s;
    this._rotateAA.elements[2] = n.z * n.x * d - n.y * s;
    this._rotateAA.elements[3] = 0;
    this._rotateAA.elements[4] = n.x * n.y * d - n.z * s;
    this._rotateAA.elements[5] = n.y * n.y * d + c;
    this._rotateAA.elements[6] = n.z * n.y * d + n.x * s;
    this._rotateAA.elements[7] = 0;
    this._rotateAA.elements[8] = n.x * n.z * d + n.y * s;
    this._rotateAA.elements[9] = n.y * n.z * d - n.x * s;
    this._rotateAA.elements[10] = n.z * n.z * d + c;
    this._rotateAA.elements[11] = 0;
    this._rotateAA.elements[12] = 0;
    this._rotateAA.elements[13] = 0;
    this._rotateAA.elements[14] = 0;
    this._rotateAA.elements[15] = 1;
  }

  scale(vec3: Vec3, out?: Mat4): Mat4 {
    this._scaleMat4.elements[0] = vec3.x;
    this._scaleMat4.elements[5] = vec3.y;
    this._scaleMat4.elements[10] = vec3.z;
    this._scaleMat4.elements[15] = 1;

    return this.multiply(this._scaleMat4, out);
  }

  scaleAA(s: number, n: Vec3, out?: Mat4): Mat4 {
    n.normalize();

    const k: number = s - 1;
    const xy: number = k * n.x * n.y;
    const xz: number = k * n.x * n.z;
    const yz: number = k * n.y * n.z;

    this._scaleAA.elements[0] = 1 + k * n.x * n.x;
    this._scaleAA.elements[1] = xy;
    this._scaleAA.elements[2] = xz;
    this._scaleAA.elements[3] = 0;
    this._scaleAA.elements[4] = xy;
    this._scaleAA.elements[5] = 1 + k * n.y * n.y;
    this._scaleAA.elements[6] = yz;
    this._scaleAA.elements[7] = 0;
    this._scaleAA.elements[8] = xz;
    this._scaleAA.elements[9] = yz;
    this._scaleAA.elements[10] = 1 + k * n.z * n.z;
    this._scaleAA.elements[11] = 0;
    this._scaleAA.elements[12] = 0;
    this._scaleAA.elements[13] = 0;
    this._scaleAA.elements[14] = 0;
    this._scaleAA.elements[15] = 1;

    if (out) {
      return this.multiply(this._scaleAA, out);
    }

    return this.multiply(this._scaleAA);
  }

  ortho(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number,
    out?: Mat4,
  ): Mat4 {
    const rl: number = 1 / (right - left);
    const tb: number = 1 / (top - bottom);
    const fn: number = 1 / (far - near);

    if (out) {
      out.elements[0] = 2 * rl;
      out.elements[1] = 0;
      out.elements[2] = 0;
      out.elements[3] = 0;
      out.elements[4] = 0;
      out.elements[5] = 2 * tb;
      out.elements[6] = 0;
      out.elements[7] = 0;
      out.elements[8] = 0;
      out.elements[9] = 0;
      out.elements[10] = -2 * fn;
      out.elements[11] = 0;
      out.elements[12] = -(right + left) * rl;
      out.elements[13] = -(top + bottom) * tb;
      out.elements[14] = -(far + near) * fn;
      out.elements[15] = 1;
      return out;
    }

    this._values[0] = 2 * rl;
    this._values[1] = 0;
    this._values[2] = 0;
    this._values[3] = 0;
    this._values[4] = 0;
    this._values[5] = 2 * tb;
    this._values[6] = 0;
    this._values[7] = 0;
    this._values[8] = 0;
    this._values[9] = 0;
    this._values[10] = -2 * fn;
    this._values[11] = 0;
    this._values[12] = -(right + left) * rl;
    this._values[13] = -(top + bottom) * tb;
    this._values[14] = -(far + near) * fn;
    this._values[15] = 1;
    return this;
  }

  projectAA(n: Vec3, out?: Mat4): Mat4 {
    // 1. Local normalization
    const mag: number = n.length();
    const nx: number = mag === 0 ? 0 : n.x / mag;
    const ny: number = mag === 0 ? 0 : n.y / mag;
    const nz: number = mag === 0 ? 0 : n.z / mag;

    // 2. Precompute
    const xx: number = nx * nx;
    const yy: number = ny * ny;
    const zz: number = nz * nz;
    const xy: number = nx * ny;
    const xz: number = nx * nz;
    const yz: number = ny * nz;

    // 3. Populate the upper-left 3x3 grid within the 4x4 column-major array
    // Column 0
    this._projectAA.elements[0] = 1 - xx;
    this._projectAA.elements[1] = -xy;
    this._projectAA.elements[2] = -xz;
    this._projectAA.elements[3] = 0;

    this._projectAA.elements[4] = -xy;
    this._projectAA.elements[5] = 1 - yy;
    this._projectAA.elements[6] = -yz;
    this._projectAA.elements[7] = 0;

    // Column 2
    this._projectAA.elements[8] = -xz;
    this._projectAA.elements[9] = -yz;
    this._projectAA.elements[10] = 1 - zz;
    this._projectAA.elements[11] = 0;
    // index 11 (w) is already 0

    // Column 3 (indices 12, 13, 14, 15) remains the default [0, 0, 0, 1]
    this._projectAA.elements[12] = 0;
    this._projectAA.elements[13] = 0;
    this._projectAA.elements[14] = 0;
    this._projectAA.elements[15] = 1;

    // 4. Multiply and route output
    if (out) {
      return this.multiply(this._projectAA, out);
    }
    return this.multiply(this._projectAA);
  }

  reflectAA(n: Vec3, out?: Mat4): Mat4 {
    // Local normalization
    const mag: number = n.length();
    const nx: number = mag === 0 ? 0 : n.x / mag;
    const ny: number = mag === 0 ? 0 : n.y / mag;
    const nz: number = mag === 0 ? 0 : n.z / mag;

    // Precompute the squares and mixed products, doubled for reflection (-2)
    const xx: number = nx * nx * 2;
    const yy: number = ny * ny * 2;
    const zz: number = nz * nz * 2;
    const xy: number = nx * ny * 2;
    const xz: number = nx * nz * 2;
    const yz: number = ny * nz * 2;

    // Populate the upper-left 3x3 grid
    this._reflectAA.elements[0] = 1 - xx;
    this._reflectAA.elements[1] = -xy;
    this._reflectAA.elements[2] = -xz;

    this._reflectAA.elements[4] = -xy;
    this._reflectAA.elements[5] = 1 - yy;
    this._reflectAA.elements[6] = -yz;

    this._reflectAA.elements[8] = -xz;
    this._reflectAA.elements[9] = -yz;
    this._reflectAA.elements[10] = 1 - zz;

    if (out) {
      return this.multiply(this._reflectAA, out);
    }
    return this.multiply(this._reflectAA);
  }

  shearXY(s: number, t: number, out?: Mat4): Mat4 {
    // Shears X and Y based on Z.
    // The s and t factors drop into the Z column (Column 2: indices 8-11).
    const e = this._shearXYMat4.elements;
    e[0] = 1;
    e[4] = 0;
    e[8] = s;
    e[12] = 0;
    e[1] = 0;
    e[5] = 1;
    e[9] = t;
    e[13] = 0;
    e[2] = 0;
    e[6] = 0;
    e[10] = 1;
    e[14] = 0;
    e[3] = 0;
    e[7] = 0;
    e[11] = 0;
    e[15] = 1;

    if (out) {
      return this.multiply(this._shearXYMat4, out);
    }
    return this.multiply(this._shearXYMat4);
  }

  shearXZ(s: number, t: number, out?: Mat4): Mat4 {
    // Shears X and Z based on Y.
    // The s and t factors drop into the Y column (Column 1: indices 4-7).
    const e = this._shearXZMat4.elements;
    e[0] = 1;
    e[4] = s;
    e[8] = 0;
    e[12] = 0;
    e[1] = 0;
    e[5] = 1;
    e[9] = 0;
    e[13] = 0;
    e[2] = 0;
    e[6] = t;
    e[10] = 1;
    e[14] = 0;
    e[3] = 0;
    e[7] = 0;
    e[11] = 0;
    e[15] = 1;

    if (out) {
      return this.multiply(this._shearXZMat4, out);
    }
    return this.multiply(this._shearXZMat4);
  }

  shearYZ(s: number, t: number, out?: Mat4): Mat4 {
    // Shears Y and Z based on X.
    // The s and t factors drop into the X column (Column 0: indices 0-3).
    const e = this._shearYZMat4.elements;
    e[0] = 1;
    e[4] = 0;
    e[8] = 0;
    e[12] = 0;
    e[1] = s;
    e[5] = 1;
    e[9] = 0;
    e[13] = 0;
    e[2] = t;
    e[6] = 0;
    e[10] = 1;
    e[14] = 0;
    e[3] = 0;
    e[7] = 0;
    e[11] = 0;
    e[15] = 1;

    if (out) {
      return this.multiply(this._shearYZMat4, out);
    }
    return this.multiply(this._shearYZMat4);
  }

  translate(v: Vec3, out?: Mat4): Mat4 {
    this._translateMat4.elements[12] = v.x;
    this._translateMat4.elements[13] = v.y;
    this._translateMat4.elements[14] = v.z;

    if (out) {
      return this.multiply(this._translateMat4, out);
    }
    return this.multiply(this._translateMat4);
  }

  determinant(): number {
    // Column 0
    const m11: number = this._values[0];
    const m21: number = this._values[1];
    const m31: number = this._values[2];
    const m41: number = this._values[3];

    // Column 1
    const m12: number = this._values[4];
    const m22: number = this._values[5];
    const m32: number = this._values[6];
    const m42: number = this._values[7];

    // Column 2
    const m13: number = this._values[8];
    const m23: number = this._values[9];
    const m33: number = this._values[10];
    const m43: number = this._values[11];

    // Column 3
    const m14: number = this._values[12];
    const m24: number = this._values[13];
    const m34: number = this._values[14];
    const m44: number = this._values[15];

    // 1. Precompute the six 2x2 determinants for the bottom two rows (rows 3 and 4)
    const b00: number = m31 * m42 - m32 * m41;
    const b01: number = m31 * m43 - m33 * m41;
    const b02: number = m31 * m44 - m34 * m41;
    const b03: number = m32 * m43 - m33 * m42;
    const b04: number = m32 * m44 - m34 * m42;
    const b05: number = m33 * m44 - m34 * m43;

    // 2. Calculate the four 3x3 cofactors for the top row, reusing the precomputed 2x2s
    const d11: number = m22 * b05 - m23 * b04 + m24 * b03;
    const d12: number = m21 * b05 - m23 * b02 + m24 * b01;
    const d13: number = m21 * b04 - m22 * b02 + m24 * b00;
    const d14: number = m21 * b03 - m22 * b01 + m23 * b00;

    // 3. Multiply the top row by its cofactors with strict alternating signs (+, -, +, -)
    return m11 * d11 - m12 * d12 + m13 * d13 - m14 * d14;
  }

  invert(out?: Mat4): Mat4 {
    const m11: number = this._values[0];
    const m21: number = this._values[1];
    const m31: number = this._values[2];
    const m41: number = this._values[3];

    const m12: number = this._values[4];
    const m22: number = this._values[5];
    const m32: number = this._values[6];
    const m42: number = this._values[7];

    const m13: number = this._values[8];
    const m23: number = this._values[9];
    const m33: number = this._values[10];
    const m43: number = this._values[11];

    const m14: number = this._values[12];
    const m24: number = this._values[13];
    const m34: number = this._values[14];
    const m44: number = this._values[15];

    // 1. Precompute Bottom Blocks (Rows 3 & 4)
    const b00: number = m31 * m42 - m32 * m41;
    const b01: number = m31 * m43 - m33 * m41;
    const b02: number = m31 * m44 - m34 * m41;
    const b03: number = m32 * m43 - m33 * m42;
    const b04: number = m32 * m44 - m34 * m42;
    const b05: number = m33 * m44 - m34 * m43;

    // 2. Precompute Top Blocks (Rows 1 & 2)
    const t00: number = m11 * m22 - m12 * m21;
    const t01: number = m11 * m23 - m13 * m21;
    const t02: number = m11 * m24 - m14 * m21;
    const t03: number = m12 * m23 - m13 * m22;
    const t04: number = m12 * m24 - m14 * m22;
    const t05: number = m13 * m24 - m14 * m23;

    // 3. Row 1 Cofactors (used to find the determinant)
    const d11: number = m22 * b05 - m23 * b04 + m24 * b03;
    const d12: number = m21 * b05 - m23 * b02 + m24 * b01;
    const d13: number = m21 * b04 - m22 * b02 + m24 * b00;
    const d14: number = m21 * b03 - m22 * b01 + m23 * b00;

    const det: number = m11 * d11 - m12 * d12 + m13 * d13 - m14 * d14;

    if (det === 0.0) {
      console.warn("Prime3D Warning: Cannot invert a singular matrix.");
      return out ? out : this;
    }

    const invDet: number = 1.0 / det;

    const c11: number = d11;
    const c12: number = -d12;
    const c13: number = d13;
    const c14: number = -d14;

    // 4. Row 2 Cofactors
    const c21: number = -(m12 * b05 - m13 * b04 + m14 * b03);
    const c22: number = m11 * b05 - m13 * b02 + m14 * b01;
    const c23: number = -(m11 * b04 - m12 * b02 + m14 * b00);
    const c24: number = m11 * b03 - m12 * b01 + m13 * b00;

    // 5. Row 3 Cofactors
    const c31: number = m42 * t05 - m43 * t04 + m44 * t03;
    const c32: number = -(m41 * t05 - m43 * t02 + m44 * t01);
    const c33: number = m41 * t04 - m42 * t02 + m44 * t00;
    const c34: number = -(m41 * t03 - m42 * t01 + m43 * t00);

    // 6. Row 4 Cofactors
    const c41: number = -(m32 * t05 - m33 * t04 + m34 * t03);
    const c42: number = m31 * t05 - m33 * t02 + m34 * t01;
    const c43: number = -(m31 * t04 - m32 * t02 + m34 * t00);
    const c44: number = m31 * t03 - m32 * t01 + m33 * t00;

    // 7. Adjoint Transpose & Scalar Multiplication Routing
    if (out) {
      const elements: number[] = out.elements;
      elements[0] = c11 * invDet;
      elements[1] = c21 * invDet;
      elements[2] = c31 * invDet;
      elements[3] = c41 * invDet;

      elements[4] = c12 * invDet;
      elements[5] = c22 * invDet;
      elements[6] = c32 * invDet;
      elements[7] = c42 * invDet;

      elements[8] = c13 * invDet;
      elements[9] = c23 * invDet;
      elements[10] = c33 * invDet;
      elements[11] = c43 * invDet;

      elements[12] = c14 * invDet;
      elements[13] = c24 * invDet;
      elements[14] = c34 * invDet;
      elements[15] = c44 * invDet;
      return out;
    }

    this._values[0] = c11 * invDet;
    this._values[1] = c21 * invDet;
    this._values[2] = c31 * invDet;
    this._values[3] = c41 * invDet;

    this._values[4] = c12 * invDet;
    this._values[5] = c22 * invDet;
    this._values[6] = c32 * invDet;
    this._values[7] = c42 * invDet;

    this._values[8] = c13 * invDet;
    this._values[9] = c23 * invDet;
    this._values[10] = c33 * invDet;
    this._values[11] = c43 * invDet;

    this._values[12] = c14 * invDet;
    this._values[13] = c24 * invDet;
    this._values[14] = c34 * invDet;
    this._values[15] = c44 * invDet;

    return this;
  }

  getRight(out?: Vec3): Vec3 {
    const x: number = this._values[0];
    const y: number = this._values[1];
    const z: number = this._values[2];
    if (out) {
      out.x = x;
      out.y = y;
      out.z = z;
      return out;
    }
    return new Vec3(x, y, z);
  }

  getUp(out?: Vec3): Vec3 {
    const x: number = this._values[4];
    const y: number = this._values[5];
    const z: number = this._values[6];
    if (out) {
      out.x = x;
      out.y = y;
      out.z = z;
      return out;
    }
    return new Vec3(x, y, z);
  }

  getForward(out?: Vec3): Vec3 {
    const x: number = this._values[8];
    const y: number = this._values[9];
    const z: number = this._values[10];
    if (out) {
      out.x = x;
      out.y = y;
      out.z = z;
      return out;
    }
    return new Vec3(x, y, z);
  }

  getTranslation(out?: Vec3): Vec3 {
    const x: number = this._values[12];
    const y: number = this._values[13];
    const z: number = this._values[14];
    if (out) {
      out.x = x;
      out.y = y;
      out.z = z;
      return out;
    }
    return new Vec3(x, y, z);
  }

  orthogonalize(): void {
    // 1. Extraction
    this.getForward(this._f);
    this.getRight(this._r);
    this.getUp(this._u);

    // 2. The Anchor
    this._f.normalize();

    // 3. The First Cross: Up x Forward = Right
    this._u.cross(this._f, this._r);
    this._r.normalize(); // Length repair

    // 4. The Second Cross: Forward x Right = Up
    this._f.cross(this._r, this._u);
    this._u.normalize(); // Length repair

    // 5. Injection: Write back to the matrix (Column-Major 4x4)
    // Column 0: Right (skipping index 3)
    this._values[0] = this._r.x;
    this._values[1] = this._r.y;
    this._values[2] = this._r.z;

    // Column 1: Up (skipping index 7)
    this._values[4] = this._u.x;
    this._values[5] = this._u.y;
    this._values[6] = this._u.z;

    // Column 2: Forward (skipping index 11)
    this._values[8] = this._f.x;
    this._values[9] = this._f.y;
    this._values[10] = this._f.z;
  }

  copyFromMat3(mat3: Mat3, out?: Mat4): Mat4 {
    const m3: number[] = mat3.elements;

    // Use the provided output matrix, or mutate this one if none is provided
    const target = out ? out : this;
    const m4: number[] = target.elements;

    // Column 0: Right Vector
    m4[0] = m3[0];
    m4[1] = m3[1];
    m4[2] = m3[2];
    m4[3] = 0; // Lock w to 0 (Direction)

    // Column 1: Up Vector
    m4[4] = m3[3];
    m4[5] = m3[4];
    m4[6] = m3[5];
    m4[7] = 0; // Lock w to 0 (Direction)

    // Column 2: Forward Vector
    m4[8] = m3[6];
    m4[9] = m3[7];
    m4[10] = m3[8];
    m4[11] = 0; // Lock w to 0 (Direction)

    // Column 3: Translation Vector & Homogeneous w
    m4[12] = 0; // Clear X translation
    m4[13] = 0; // Clear Y translation
    m4[14] = 0; // Clear Z translation
    m4[15] = 1; // Lock w to 1 (Point / Affine Anchor)

    return target;
  }

  perspective(
    fov: number,
    aspect: number,
    near: number,
    far: number,
    out?: Mat4,
  ): Mat4 {
    fov = toRadians(fov);
    const f: number = fov / 2;
    const nf: number = 1 / (near - far);

    if (out) {
      out.elements[0] = f / aspect;
      out.elements[1] = 0;
      out.elements[2] = 0;
      out.elements[3] = 0;
      out.elements[4] = 0;
      out.elements[5] = f;
      out.elements[6] = 0;
      out.elements[7] = 0;
      out.elements[8] = 0;
      out.elements[9] = 0;
      out.elements[10] = (near + far) * nf;
      out.elements[11] = -1;
      out.elements[12] = 0;
      out.elements[13] = 0;
      out.elements[14] = 2 * near * far * nf;
      out.elements[15] = 0;
      return out;
    }

    this._values[0] = f / aspect;
    this._values[1] = 0;
    this._values[2] = 0;
    this._values[3] = 0;
    this._values[4] = 0;
    this._values[5] = f;
    this._values[6] = 0;
    this._values[7] = 0;
    this._values[8] = 0;
    this._values[9] = 0;
    this._values[10] = (near + far) * nf;
    this._values[11] = -1;
    this._values[12] = 0;
    this._values[13] = 0;
    this._values[14] = 2 * near * far * nf;
    this._values[15] = 0;

    return this;
  }

  lookAt(eye: Vec3, target: Vec3, up: Vec3, out?: Mat4): Mat4 {
    // 1. Z-Axis (Forward)
    // WebGL is a Right-Handed system and looks down the negative Z-axis.
    // Therefore, the camera's positive Z-axis points backwards from the target to the eye.
    eye.subtract(target, this._f);

    // Fail-safe: If the eye and target are at the exact same position, default to looking down -Z
    if (this._f.squaredLength() === 0) {
      this._f.z = 1;
    }
    this._f.normalize();

    // 2. X-Axis (Right)
    // Cross the global Up vector with the Z-axis to get the perpendicular X-axis
    up.cross(this._f, this._r);

    // Fail-safe: If the camera is looking straight up or straight down, the cross product is zero.
    // We nudge the Right vector to the global X-axis to prevent the matrix from collapsing.
    if (this._r.squaredLength() === 0) {
      this._r.x = 1;
      this._r.y = 0;
      this._r.z = 0;
    }
    this._r.normalize();

    // 3. Y-Axis (True Up)
    // Cross the Z-axis and X-axis to get the perfectly orthogonal local Y-axis.
    // Because _f and _r are already unit length and orthogonal, _u will naturally be unit length.
    this._f.cross(this._r, this._u);
    this._u.normalize();

    // 4. Translation Offsets (The "Move the World" trick)
    // The View Matrix moves the world in the opposite direction of the camera.
    // We use the dot product to project the eye position onto our new orthogonal axes and negate it.
    const tx: number = -this._r.dot(eye);
    const ty: number = -this._u.dot(eye);
    const tz: number = -this._f.dot(eye);

    // 5. Injection (Column-Major Order)
    const targetMat = out ? out : this;
    const e = targetMat.elements;

    // Column 0: X-Axis (Right)
    e[0] = this._r.x;
    e[1] = this._u.x;
    e[2] = this._f.x;
    e[3] = 0;

    // Column 1: Y-Axis (Up)
    e[4] = this._r.y;
    e[5] = this._u.y;
    e[6] = this._f.y;
    e[7] = 0;

    // Column 2: Z-Axis (Forward)
    e[8] = this._r.z;
    e[9] = this._u.z;
    e[10] = this._f.z;
    e[11] = 0;

    // Column 3: Translation
    e[12] = tx;
    e[13] = ty;
    e[14] = tz;
    e[15] = 1;

    return targetMat;
  }

  identity(out?: Mat4): Mat4 {
    const target: Mat4 = out ? out : this;
    const e: number[] = target.elements;

    // Column 0
    e[0] = 1;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;

    // Column 1
    e[4] = 0;
    e[5] = 1;
    e[6] = 0;
    e[7] = 0;

    // Column 2
    e[8] = 0;
    e[9] = 0;
    e[10] = 1;
    e[11] = 0;

    // Column 3
    e[12] = 0;
    e[13] = 0;
    e[14] = 0;
    e[15] = 1;

    return target;
  }

  fromRotationTranslationScale(
    rot: Mat3,
    pos: Vec3,
    scale: Vec3,
    out?: Mat4,
  ): Mat4 {
    const target = out ? out : this;
    const e = target.elements;
    const r = rot.elements;

    const sx = scale.x;
    const sy = scale.y;
    const sz = scale.z;

    // Column 0: Right Vector (Rotated and Scaled)
    e[0] = r[0] * sx;
    e[1] = r[1] * sx;
    e[2] = r[2] * sx;
    e[3] = 0;

    // Column 1: Up Vector (Rotated and Scaled)
    e[4] = r[3] * sy;
    e[5] = r[4] * sy;
    e[6] = r[5] * sy;
    e[7] = 0;

    // Column 2: Forward Vector (Rotated and Scaled)
    e[8] = r[6] * sz;
    e[9] = r[7] * sz;
    e[10] = r[8] * sz;
    e[11] = 0;

    // Column 3: Translation and W-Lock
    e[12] = pos.x;
    e[13] = pos.y;
    e[14] = pos.z;
    e[15] = 1;

    return target;
  }

  copy(out: Mat4): Mat4 {
    const e: number[] = out.elements;
    e[0] = this._values[0];
    e[1] = this._values[1];
    e[2] = this._values[2];
    e[3] = this._values[3];
    e[4] = this._values[4];
    e[5] = this._values[5];
    e[6] = this._values[6];
    e[7] = this._values[7];
    e[8] = this._values[8];
    e[9] = this._values[9];
    e[10] = this._values[10];
    e[11] = this._values[11];
    e[12] = this._values[12];
    e[13] = this._values[13];
    e[14] = this._values[14];
    e[15] = this._values[15];
    return out;
  }

  set elements(value: number[]) {
    this._values = value;
  }

  // A getter is useful when you need to pass the flat array to a WebGL uniform
  get elements(): number[] {
    return this._values;
  }
}
