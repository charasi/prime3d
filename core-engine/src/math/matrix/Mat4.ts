export class Mat4 {
  private _values: number[];
  constructor(values?: number[]) {
    if (values) {
      this._values = values;
    } else {
      // Default to identity matrix in column-major order
      this._values = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }
  }

  scale(s: number, out?: Mat4): Mat4 {
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

  set elements(value: number[]) {
    this._values = value;
  }

  // A getter is useful when you need to pass the flat array to a WebGL uniform
  get elements(): number[] {
    return this._values;
  }
}
