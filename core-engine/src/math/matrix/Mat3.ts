export class Mat3 {
  private _values: number[];
  constructor(values?: number[]) {
    if (values) {
      this._values = values;
    } else {
      // Default to identity matrix in column-major order
      this._values = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    }
  }

  scale(s: number, out?: Mat3): Mat3 {
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

  set elements(value: number[]) {
    this._values = value;
  }

  // A getter is useful when you need to pass the flat array to a WebGL uniform
  get elements(): number[] {
    return this._values;
  }
}
