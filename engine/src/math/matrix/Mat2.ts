import { toRadians } from "../../misc/Utils";

export class Mat2 {
  private _values: number[];
  private _rotateMat2: Mat2 = new Mat2();
  private _shearXMat2: Mat2 = new Mat2();
  private _shearYMat2: Mat2 = new Mat2();
  constructor(values?: number[]) {
    if (values) {
      this._values = values;
    } else {
      // Default to identity matrix in column-major order
      this._values = [1, 0, 0, 1];
    }
  }

  scalar(s: number, out?: Mat2): Mat2 {
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

  multiply(mat2: Mat2, out?: Mat2): Mat2 {
    const mat: number[] = mat2.elements;
    const c00: number = mat[0],
      c01: number = mat[1];

    const c10: number = mat[2],
      c11: number = mat[3];

    const r00: number = this._values[0],
      r01: number = this._values[2];

    const r10: number = this._values[1],
      r11: number = this._values[3];

    if (out) {
      const elements: number[] = out.elements;
      elements[0] = r00 * c00 + r01 * c01;
      elements[2] = r00 * c10 + r01 * c11;
      elements[1] = r10 * c00 + r11 * c01;
      elements[3] = r10 * c10 + r11 * c11;
      return out;
    }

    this._values[0] = r00 * c00 + r01 * c01;
    this._values[2] = r00 * c10 + r01 * c11;
    this._values[1] = r10 * c00 + r11 * c01;
    this._values[3] = r10 * c10 + r11 * c11;
    return this;
  }

  transpose(out?: Mat2): Mat2 {
    // diagonal
    const idx0: number = this._values[0];
    const idx3: number = this._values[3];

    const idx1: number = this._values[1];
    const idx2: number = this._values[2];

    if (out) {
      const elements: number[] = out.elements;
      elements[0] = idx0;
      elements[1] = idx2;
      elements[2] = idx1;
      elements[3] = idx3;
      return out;
    }

    this._values[1] = idx2;
    this._values[2] = idx1;
    return this;
  }

  rotate(angle: number, out?: Mat2): Mat2 {
    const rad: number = toRadians(angle);

    this._rotateMat2.elements[0] = Math.cos(rad);
    this._rotateMat2.elements[1] = Math.sin(rad);
    this._rotateMat2.elements[2] = -Math.sin(rad);
    this._rotateMat2.elements[3] = Math.cos(rad);
    if (out) {
      return this.multiply(this._rotateMat2, out);
    }

    return this.multiply(this._rotateMat2);
  }

  shearX(s: number, out?: Mat2): Mat2 {
    // Column 0
    this._shearXMat2.elements[0] = 1;
    this._shearXMat2.elements[1] = 0;
    // Column 1
    this._shearXMat2.elements[2] = s; // The shear factor goes here for X!
    this._shearXMat2.elements[3] = 1;

    // Apply the transformation using the factory pattern
    if (out) {
      return this.multiply(this._shearXMat2, out);
    }
    return this.multiply(this._shearXMat2);
  }

  shearY(s: number, out?: Mat2): Mat2 {
    // Column 0
    this._shearYMat2.elements[0] = 1;
    this._shearYMat2.elements[1] = s; // The shear factor goes here for Y!
    // Column 1
    this._shearYMat2.elements[2] = 0;
    this._shearYMat2.elements[3] = 1;

    // Apply the transformation using the factory pattern
    if (out) {
      return this.multiply(this._shearYMat2, out);
    }
    return this.multiply(this._shearYMat2);
  }

  determinant(): number {
    const m11: number = this._values[0];
    const m21: number = this._values[1];
    const m12: number = this._values[2];
    const m22: number = this._values[3];
    return m11 * m22 - m12 * m21;
  }

  invert(out?: Mat2): Mat2 {
    const det: number = this.determinant();

    if (det === 0.0) {
      console.warn("Prime3D Warning: Cannot invert a singular matrix.");
      return out ? out : this;
    }

    const invDet: number = 1.0 / det;
    const m11: number = this._values[0];
    const m21: number = this._values[1];
    const m12: number = this._values[2];
    const m22: number = this._values[3];

    // Swapping the main diagonal and negating the anti-diagonal
    if (out) {
      const elements: number[] = out.elements;
      elements[0] = m22 * invDet;
      elements[1] = -m21 * invDet;
      elements[2] = -m12 * invDet;
      elements[3] = m11 * invDet;
      return out;
    }

    this._values[0] = m22 * invDet;
    this._values[1] = -m21 * invDet;
    this._values[2] = -m12 * invDet;
    this._values[3] = m11 * invDet;

    return this;
  }

  identity(out?: Mat2): Mat2 {
    const target: Mat2 = out ? out : this;
    const e: number[] = target.elements;

    e[0] = 1;
    e[1] = 0;

    e[2] = 0;
    e[3] = 1;

    return target;
  }

  set elements(values: number[]) {
    this._values = values;
  }

  // A getter is useful when you need to pass the flat array to a WebGL uniform
  get elements(): number[] {
    return this._values;
  }
}
