export class Mat2 {
  private _values: number[];
  constructor(values?: number[]) {
    if (values) {
      this._values = values;
    } else {
      // Default to identity matrix in column-major order
      this._values = [1, 0, 0, 1];
    }
  }

  scale(s: number, out?: Mat2): Mat2 {
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
      elements[1] = r00 * c00 + r01 * c01;
      elements[3] = r10 * c10 + r11 * c11;
      return out;
    }

    this._values[0] = r00 * c00 + r01 * c01;
    this._values[2] = r00 * c10 + r01 * c11;
    this._values[1] = r00 * c00 + r01 * c01;
    this._values[3] = r10 * c10 + r11 * c11;
    return this;
  }

  set elements(values: number[]) {
    this._values = values;
  }

  // A getter is useful when you need to pass the flat array to a WebGL uniform
  get elements(): number[] {
    return this._values;
  }
}
