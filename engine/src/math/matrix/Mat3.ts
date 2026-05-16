import { Vec3 } from "../vectors/Vec3";
import { toRadians } from "../../misc/Utils";
import { Mat4 } from "./Mat4";

export class Mat3 {
  private _values: number[];
  private _rotateXMat3: Mat3 = new Mat3();
  private _rotateYMat3: Mat3 = new Mat3();
  private _rotateZMat3: Mat3 = new Mat3();
  private _rotateAA: Mat3 = new Mat3();
  private _scaleMat3: Mat3 = new Mat3();
  private _scaleAA: Mat3 = new Mat3();
  private _projectAA: Mat3 = new Mat3();
  private _reflectAA: Mat3 = new Mat3();
  private _shearXYMat3: Mat3 = new Mat3();
  private _shearXZMat3: Mat3 = new Mat3();
  private _shearYZMat3: Mat3 = new Mat3();
  private _f: Vec3 = new Vec3();
  private _r: Vec3 = new Vec3();
  private _u: Vec3 = new Vec3();
  constructor(values?: number[]) {
    if (values) {
      this._values = values;
    } else {
      // Default to identity matrix in column-major order
      this._values = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    }
  }

  scalar(s: number, out?: Mat3): Mat3 {
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

  multiply(mat3: Mat3, out?: Mat3): Mat3 {
    const mat: number[] = mat3.elements;
    const c00: number = mat[0],
      c01: number = mat[1],
      c02: number = mat[2];

    const c10: number = mat[3],
      c11: number = mat[4],
      c12: number = mat[5];

    const c20: number = mat[6],
      c21: number = mat[7],
      c22: number = mat[8];

    const r00: number = this._values[0],
      r01: number = this._values[3],
      r02: number = this._values[6];

    const r10: number = this._values[1],
      r11: number = this._values[4],
      r12: number = this._values[7];

    const r20: number = this._values[2],
      r21: number = this._values[5],
      r22: number = this._values[8];

    if (out) {
      const elements: number[] = out.elements;
      elements[0] = r00 * c00 + r01 * c01 + r02 * c02;
      elements[3] = r00 * c10 + r01 * c11 + r02 * c12;
      elements[6] = r00 * c20 + r01 * c21 + r02 * c22;
      elements[1] = r10 * c00 + r11 * c01 + r12 * c02;
      elements[4] = r10 * c10 + r11 * c11 + r12 * c12;
      elements[7] = r10 * c20 + r11 * c21 + r12 * c22;
      elements[2] = r20 * c00 + r21 * c01 + r22 * c02;
      elements[5] = r20 * c10 + r21 * c11 + r22 * c12;
      elements[8] = r20 * c20 + r21 * c21 + r22 * c22;
      return out;
    }

    this._values[0] = r00 * c00 + r01 * c01 + r02 * c02;
    this._values[3] = r00 * c10 + r01 * c11 + r02 * c12;
    this._values[6] = r00 * c20 + r01 * c21 + r02 * c22;
    this._values[1] = r10 * c00 + r11 * c01 + r12 * c02;
    this._values[4] = r10 * c10 + r11 * c11 + r12 * c12;
    this._values[7] = r10 * c20 + r11 * c21 + r12 * c22;
    this._values[2] = r20 * c00 + r21 * c01 + r22 * c02;
    this._values[5] = r20 * c10 + r21 * c11 + r22 * c12;
    this._values[8] = r20 * c20 + r21 * c21 + r22 * c22;
    return this;
  }

  transpose(out?: Mat3): Mat3 {
    // diagonal
    const idx0: number = this._values[0];
    const idx4: number = this._values[4];
    const idx8: number = this._values[8];

    const idx1: number = this._values[1];
    const idx3: number = this._values[3];
    const idx2: number = this._values[2];
    const idx6: number = this._values[6];
    const idx5: number = this._values[5];
    const idx7: number = this._values[7];
    if (out) {
      const elements: number[] = out.elements;
      elements[1] = idx3;
      elements[3] = idx1;
      elements[2] = idx6;
      elements[6] = idx2;
      elements[5] = idx7;
      elements[7] = idx5;
      elements[0] = idx0;
      elements[4] = idx4;
      elements[8] = idx8;
      return out;
    }

    this._values[1] = idx3;
    this._values[3] = idx1;
    this._values[2] = idx6;
    this._values[6] = idx2;
    this._values[5] = idx7;
    this._values[7] = idx5;
    return this;
  }

  rotateXAngle(angle: number) {
    const rad: number = toRadians(angle);

    this._rotateXMat3.elements[0] = 1;
    this._rotateXMat3.elements[1] = 0;
    this._rotateXMat3.elements[2] = 0;
    this._rotateXMat3.elements[3] = 0;
    this._rotateXMat3.elements[4] = Math.cos(rad);
    this._rotateXMat3.elements[5] = Math.sin(rad);
    this._rotateXMat3.elements[6] = 0;
    this._rotateXMat3.elements[7] = -Math.sin(rad);
    this._rotateXMat3.elements[8] = Math.cos(rad);
  }

  rotateYAngle(angle: number) {
    const rad: number = toRadians(angle);

    this._rotateYMat3.elements[0] = Math.cos(rad);
    this._rotateYMat3.elements[1] = 0;
    this._rotateYMat3.elements[2] = -Math.sin(rad);
    this._rotateYMat3.elements[3] = 0;
    this._rotateYMat3.elements[4] = 1;
    this._rotateYMat3.elements[5] = 0;
    this._rotateYMat3.elements[6] = Math.sin(rad);
    this._rotateYMat3.elements[7] = 0;
    this._rotateYMat3.elements[8] = Math.cos(rad);
  }

  rotateZAngle(angle: number) {
    const rad: number = toRadians(angle);

    this._rotateZMat3.elements[0] = Math.cos(rad);
    this._rotateZMat3.elements[1] = Math.sin(rad);
    this._rotateZMat3.elements[2] = 0;
    this._rotateZMat3.elements[3] = -Math.sin(rad);
    this._rotateZMat3.elements[4] = Math.cos(rad);
    this._rotateZMat3.elements[5] = 0;
    this._rotateZMat3.elements[6] = 0;
    this._rotateZMat3.elements[7] = 0;
    this._rotateZMat3.elements[8] = 1;
  }

  rotate(type: string, out?: Mat3): Mat3 {
    let axis: Mat3;
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
    this._rotateAA.elements[3] = n.x * n.y * d - n.z * s;
    this._rotateAA.elements[4] = n.y * n.y * d + c;
    this._rotateAA.elements[5] = n.z * n.y * d + n.x * s;
    this._rotateAA.elements[6] = n.x * n.z * d + n.y * s;
    this._rotateAA.elements[7] = n.y * n.z * d - n.x * s;
    this._rotateAA.elements[8] = n.z * n.z * d + c;
  }

  scale(vec3: Vec3, out?: Mat3): Mat3 {
    this._scaleMat3.elements[0] = vec3.x;
    this._scaleMat3.elements[4] = vec3.y;
    this._scaleMat3.elements[8] = vec3.z;

    return this.multiply(this._scaleMat3, out);
  }

  scaleAA(s: number, n: Vec3, out?: Mat3): Mat3 {
    n.normalize();

    const k: number = s - 1;
    const xy: number = k * n.x * n.y;
    const xz: number = k * n.x * n.z;
    const yz: number = k * n.y * n.z;

    this._scaleAA.elements[0] = 1 + k * n.x * n.x;
    this._scaleAA.elements[1] = xy;
    this._scaleAA.elements[2] = xz;
    this._scaleAA.elements[3] = xy;
    this._scaleAA.elements[4] = 1 + k * n.y * n.y;
    this._scaleAA.elements[5] = yz;
    this._scaleAA.elements[6] = xz;
    this._scaleAA.elements[7] = yz;
    this._scaleAA.elements[8] = 1 + k * n.z * n.z;

    if (out) {
      return this.multiply(this._scaleAA, out);
    }

    return this.multiply(this._scaleAA);
  }

  projectAA(n: Vec3, out?: Mat3): Mat3 {
    // 1. Local normalization to protect the input vector from mutation
    const mag: number = n.length();
    const nx: number = mag === 0 ? 0 : n.x / mag;
    const ny: number = mag === 0 ? 0 : n.y / mag;
    const nz: number = mag === 0 ? 0 : n.z / mag;

    // 2. Precompute the squares and mixed products for performance
    const xx: number = nx * nx;
    const yy: number = ny * ny;
    const zz: number = nz * nz;
    const xy: number = nx * ny;
    const xz: number = nx * nz;
    const yz: number = ny * nz;

    // 3. Populate the column-major array (All 9 elements)
    // Column 0
    this._projectAA.elements[0] = 1 - xx;
    this._projectAA.elements[1] = -xy;
    this._projectAA.elements[2] = -xz;

    // Column 1
    this._projectAA.elements[3] = -xy;
    this._projectAA.elements[4] = 1 - yy;
    this._projectAA.elements[5] = -yz;

    // Column 2
    this._projectAA.elements[6] = -xz;
    this._projectAA.elements[7] = -yz;
    this._projectAA.elements[8] = 1 - zz;

    // 4. Multiply and route output
    if (out) {
      return this.multiply(this._projectAA, out);
    }
    return this.multiply(this._projectAA);
  }

  reflectAA(n: Vec3, out?: Mat3): Mat3 {
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

    // Populate the column-major array
    this._reflectAA.elements[0] = 1 - xx;
    this._reflectAA.elements[1] = -xy;
    this._reflectAA.elements[2] = -xz;

    this._reflectAA.elements[3] = -xy;
    this._reflectAA.elements[4] = 1 - yy;
    this._reflectAA.elements[5] = -yz;

    this._reflectAA.elements[6] = -xz;
    this._reflectAA.elements[7] = -yz;
    this._reflectAA.elements[8] = 1 - zz;

    if (out) {
      return this.multiply(this._reflectAA, out);
    }
    return this.multiply(this._reflectAA);
  }

  shearXY(s: number, t: number, out?: Mat3): Mat3 {
    // Shears X and Y based on Z.
    // The s and t factors drop into the Z column (Column 2: indices 6-8).
    const e = this._shearXYMat3.elements;
    e[0] = 1;
    e[3] = 0;
    e[6] = s;
    e[1] = 0;
    e[4] = 1;
    e[7] = t;
    e[2] = 0;
    e[5] = 0;
    e[8] = 1;

    if (out) {
      return this.multiply(this._shearXYMat3, out);
    }
    return this.multiply(this._shearXYMat3);
  }

  shearXZ(s: number, t: number, out?: Mat3): Mat3 {
    // Shears X and Z based on Y.
    // The s and t factors drop into the Y column (Column 1: indices 3-5).
    const e = this._shearXZMat3.elements;
    e[0] = 1;
    e[3] = s;
    e[6] = 0;
    e[1] = 0;
    e[4] = 1;
    e[7] = 0;
    e[2] = 0;
    e[5] = t;
    e[8] = 1;

    if (out) {
      return this.multiply(this._shearXZMat3, out);
    }
    return this.multiply(this._shearXZMat3);
  }

  shearYZ(s: number, t: number, out?: Mat3): Mat3 {
    // Shears Y and Z based on X.
    // The s and t factors drop into the X column (Column 0: indices 0-2).
    const e = this._shearYZMat3.elements;
    e[0] = 1;
    e[3] = 0;
    e[6] = 0;
    e[1] = s;
    e[4] = 1;
    e[7] = 0;
    e[2] = t;
    e[5] = 0;
    e[8] = 1;

    if (out) {
      return this.multiply(this._shearYZMat3, out);
    }
    return this.multiply(this._shearYZMat3);
  }

  determinant(): number {
    const m11: number = this._values[0];
    const m21: number = this._values[1];
    const m31: number = this._values[2];
    const m12: number = this._values[3];
    const m22: number = this._values[4];
    const m32: number = this._values[5];
    const m13: number = this._values[6];
    const m23: number = this._values[7];
    const m33: number = this._values[8];

    const r1: number = m11 * (m22 * m33 - m23 * m32);
    const r2: number = m12 * (m21 * m33 - m23 * m31);
    const r3: number = m13 * (m21 * m32 - m22 * m31);
    return r1 - r2 + r3;
  }

  invert(out?: Mat3): Mat3 {
    // Step 1a: Calculate the determinant using your existing method
    const det: number = this.determinant();

    // Step 1b: The Singularity Gate
    if (det === 0.0) {
      console.warn("Prime3D Warning: Cannot invert a singular matrix.");
      // Bailing out safely. Returning the target matrix unmutated.
      // (Alternatively, you could set this to an Identity matrix here as a fallback)
      return out ? out : this;
    }

    // Step 1c: The Multiplier (Scalar Inverse)
    const invDet: number = 1.0 / det;

    // Step 2: Cofactors and Adjoint
    const m11: number = this._values[0];
    const m21: number = this._values[1];
    const m31: number = this._values[2];
    const m12: number = this._values[3];
    const m22: number = this._values[4];
    const m32: number = this._values[5];
    const m13: number = this._values[6];
    const m23: number = this._values[7];
    const m33: number = this._values[8];

    // cofactors
    const c11: number = m22 * m33 - m23 * m32;
    const c21: number = -(m12 * m33 - m13 * m32);
    const c31: number = m12 * m23 - m13 * m22;
    const c12: number = -(m21 * m33 - m23 * m31);
    const c22: number = m11 * m33 - m13 * m31;
    const c32: number = -(m11 * m23 - m13 * m21);
    const c13: number = m21 * m32 - m22 * m31;
    const c23: number = -(m11 * m32 - m12 * m31);
    const c33: number = m11 * m22 - m12 * m21;

    if (out) {
      out.elements[0] = c11 * invDet;
      out.elements[1] = c12 * invDet;
      out.elements[2] = c13 * invDet;
      out.elements[3] = c21 * invDet;
      out.elements[4] = c22 * invDet;
      out.elements[5] = c23 * invDet;
      out.elements[6] = c31 * invDet;
      out.elements[7] = c32 * invDet;
      out.elements[8] = c33 * invDet;
      return out;
    }

    this._values[0] = c11 * invDet;
    this._values[1] = c12 * invDet;
    this._values[2] = c13 * invDet;
    this._values[3] = c21 * invDet;
    this._values[4] = c22 * invDet;
    this._values[5] = c23 * invDet;
    this._values[6] = c31 * invDet;
    this._values[7] = c32 * invDet;
    this._values[8] = c33 * invDet;

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
    const x: number = this._values[3];
    const y: number = this._values[4];
    const z: number = this._values[5];
    if (out) {
      out.x = x;
      out.y = y;
      out.z = z;
      return out;
    }
    return new Vec3(x, y, z);
  }

  getForward(out?: Vec3): Vec3 {
    const x: number = this._values[6];
    const y: number = this._values[7];
    const z: number = this._values[8];
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

    // 5. Injection: Write back to the matrix (Column-Major)
    // Column 0: Right
    this._values[0] = this._r.x;
    this._values[1] = this._r.y;
    this._values[2] = this._r.z;

    // Column 1: Up
    this._values[3] = this._u.x;
    this._values[4] = this._u.y;
    this._values[5] = this._u.z;

    // Column 2: Forward
    this._values[6] = this._f.x;
    this._values[7] = this._f.y;
    this._values[8] = this._f.z;
  }

  normalFromMat4(mat4: Mat4, out?: Mat3): Mat3 {
    const mat: number[] = mat4.elements;

    // Step 1: Extraction
    // Pull the 3x3 grid from the column-major 4x4 array, skipping the 4th dimension (w and translation)
    const m11: number = mat[0];
    const m21: number = mat[1];
    const m31: number = mat[2];

    const m12: number = mat[4];
    const m22: number = mat[5];
    const m32: number = mat[6];

    const m13: number = mat[8];
    const m23: number = mat[9];
    const m33: number = mat[10];

    // Step 2: The Singularity Gate (Determinant)
    // Sarrus' Rule using the extracted 3x3 variables
    const r1: number = m11 * (m22 * m33 - m23 * m32);
    const r2: number = m12 * (m21 * m33 - m23 * m31);
    const r3: number = m13 * (m21 * m32 - m22 * m31);
    const det: number = r1 - r2 + r3;

    if (det === 0.0) {
      console.warn(
        "Prime3D Warning: Cannot extract normal matrix from a singular matrix.",
      );
      return out ? out : this;
    }

    const invDet: number = 1.0 / det;

    // Step 3: The Cofactors (The Checkerboard Rule)
    const c11: number = m22 * m33 - m23 * m32;
    const c21: number = -(m12 * m33 - m13 * m32);
    const c31: number = m12 * m23 - m13 * m22;
    const c12: number = -(m21 * m33 - m23 * m31);
    const c22: number = m11 * m33 - m13 * m31;
    const c32: number = -(m11 * m23 - m13 * m21);
    const c13: number = m21 * m32 - m22 * m31;
    const c23: number = -(m11 * m32 - m12 * m31);
    const c33: number = m11 * m22 - m12 * m21;

    // Step 4: The Engine Shortcut & Routing
    // By assigning c21 to index 1, c31 to index 2, etc., we are NOT transposing the cofactors.
    // Cofactors * invDet without transposing = The Inverse Transpose!
    const target = out ? out : this;

    target.elements[0] = c11 * invDet;
    target.elements[1] = c21 * invDet;
    target.elements[2] = c31 * invDet;

    target.elements[3] = c12 * invDet;
    target.elements[4] = c22 * invDet;
    target.elements[5] = c32 * invDet;

    target.elements[6] = c13 * invDet;
    target.elements[7] = c23 * invDet;
    target.elements[8] = c33 * invDet;

    return target;
  }

  identity(out?: Mat3): Mat3 {
    const target: Mat3 = out ? out : this;
    const e: number[] = target.elements;

    e[0] = 1;
    e[1] = 0;
    e[2] = 0;

    e[3] = 0;
    e[4] = 1;
    e[5] = 0;

    e[6] = 0;
    e[7] = 0;
    e[8] = 1;

    return target;
  }

  set elements(value: number[]) {
    this._values = value;
  }

  // A getter is useful when you need to pass the flat array to a WebGL uniform
  get elements(): number[] {
    return this._values;
  }
}
