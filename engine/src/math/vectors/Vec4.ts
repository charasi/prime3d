import { Mat3 } from "../matrix/Mat3";
import { Mat4 } from "../matrix/Mat4";

/**
 * Represents a 4-dimensional vector.
 * In WebGL, this is primarily used for RGBA colors and Homogeneous Coordinates (x, y, z, w).
 * Uses a hybrid memory pattern to prevent unnecessary garbage collection:
 * If an `out` vector is provided, the result is stored there. Otherwise, `this` is mutated.
 */
export class Vec4 {
  /** The x component of the vector (or Red). */
  x: number;
  /** The y component of the vector (or Green). */
  y: number;
  /** The z component of the vector (or Blue). */
  z: number;
  /** The w component of the vector (or Alpha). */
  w: number;

  /**
   * Creates a new 4D vector.
   * @param x - The x value (default: 0).
   * @param y - The y value (default: 0).
   * @param z - The z value (default: 0).
   * @param w - The w value (default: 0).
   */
  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /**
   * Adds another vector to this vector.
   * @param v - The vector to add.
   * @param out - Optional target vector to store the result.
   * @returns The mutated vector (either `out` or `this`) to allow chaining.
   */
  add(v: Vec4, out?: Vec4): Vec4 {
    if (out) {
      out.x = this.x + v.x;
      out.y = this.y + v.y;
      out.z = this.z + v.z;
      out.w = this.w + v.w;
      return out;
    }

    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    this.w += v.w;
    return this;
  }

  /**
   * Subtracts another vector from this vector.
   * @param v - The vector to subtract.
   * @param out - Optional target vector to store the result.
   * @returns The mutated vector (either `out` or `this`).
   */
  subtract(v: Vec4, out?: Vec4): Vec4 {
    if (out) {
      out.x = this.x - v.x;
      out.y = this.y - v.y;
      out.z = this.z - v.z;
      out.w = this.w - v.w;
      return out;
    }

    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    this.w -= v.w;
    return this;
  }

  /**
   * Multiplies this vector by another vector component-wise.
   * @param v - The vector to multiply by.
   * @param out - Optional target vector to store the result.
   * @returns The mutated vector (either `out` or `this`).
   */
  multiply(v: Vec4, out?: Vec4): Vec4 {
    if (out) {
      out.x = this.x * v.x;
      out.y = this.y * v.y;
      out.z = this.z * v.z;
      out.w = this.w * v.w;
      return out;
    }

    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    this.w *= v.w;
    return this;
  }

  /**
   * Divides this vector by another vector component-wise.
   * @param v - The vector to divide by.
   * @param out - Optional target vector to store the result.
   * @returns The mutated vector (either `out` or `this`).
   */
  divide(v: Vec4, out?: Vec4): Vec4 {
    if (v.x === 0 || v.y === 0 || v.z === 0 || v.w === 0) {
      console.warn("Prime3D Warning: Division by zero attempted in Vec4.");
      return out ? out.copy(this) : this;
    }

    if (out) {
      out.x = this.x / v.x;
      out.y = this.y / v.y;
      out.z = this.z / v.z;
      out.w = this.w / v.w;
      return out;
    }

    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
    this.w /= v.w;
    return this;
  }

  /**
   * Scales this vector uniformly by a single scalar value.
   * @param scalar - The number to multiply each component by.
   * @param out - Optional target vector to store the result.
   * @returns The mutated vector (either `out` or `this`).
   */
  scale(scalar: number, out?: Vec4): Vec4 {
    if (out) {
      out.x = this.x * scalar;
      out.y = this.y * scalar;
      out.z = this.z * scalar;
      out.w = this.w * scalar;
      return out;
    }

    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    this.w *= scalar;
    return this;
  }

  /**
   * Copies the x, y, z, and w components from another vector into this one.
   * @param v - The vector to copy from.
   * @returns This vector, allowing for method chaining.
   */
  copy(v: Vec4): Vec4 {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    this.w = v.w;
    return this;
  }

  /**
   * Inverts the direction of the vector.
   * @param out - Optional target vector to store the result.
   * @returns The mutated vector (either `out` or `this`).
   */
  negate(out?: Vec4): Vec4 {
    if (out) {
      out.x = -this.x;
      out.y = -this.y;
      out.z = -this.z;
      out.w = -this.w;
      return out;
    }

    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    this.w = -this.w;
    return this;
  }

  /**
   * Calculates the true magnitude (length) of the vector.
   * @returns The length as a scalar number.
   */
  length(): number {
    const x = this.x * this.x;
    const y = this.y * this.y;
    const z = this.z * this.z;
    const w = this.w * this.w;
    return Math.sqrt(x + y + z + w);
  }

  /**
   * Calculates the squared magnitude of the vector.
   * @returns The squared length.
   */
  squaredLength(): number {
    const x = this.x * this.x;
    const y = this.y * this.y;
    const z = this.z * this.z;
    const w = this.w * this.w;
    return x + y + z + w;
  }

  /**
   * Calculates the true distance between this point and another point `v`.
   * @param v - The target point.
   * @returns The distance as a scalar number.
   */
  distance(v: Vec4): number {
    const x = (this.x - v.x) * (this.x - v.x);
    const y = (this.y - v.y) * (this.y - v.y);
    const z = (this.z - v.z) * (this.z - v.z);
    const w = (this.w - v.w) * (this.w - v.w);
    return Math.sqrt(x + y + z + w);
  }

  /**
   * Calculates the squared distance between this point and another point `v`.
   * @param v - The target point.
   * @returns The squared distance.
   */
  squaredDistance(v: Vec4): number {
    const x = (this.x - v.x) * (this.x - v.x);
    const y = (this.y - v.y) * (this.y - v.y);
    const z = (this.z - v.z) * (this.z - v.z);
    const w = (this.w - v.w) * (this.w - v.w);
    return x + y + z + w;
  }

  /**
   * Scales the vector to a length of exactly 1 while preserving its direction.
   * @param out - Optional target vector to store the result.
   * @returns The normalized vector (either `out` or `this`).
   */
  normalize(out?: Vec4): Vec4 {
    const mag = this.length();

    if (mag === 0) {
      if (out) {
        out.x = 0;
        out.y = 0;
        out.z = 0;
        out.w = 0;
        return out;
      }
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 0;
      return this;
    }

    if (out) {
      out.x = this.x / mag;
      out.y = this.y / mag;
      out.z = this.z / mag;
      out.w = this.w / mag;
      return out;
    }

    this.x /= mag;
    this.y /= mag;
    this.z /= mag;
    this.w /= mag;
    return this;
  }

  /**
   * Calculates the dot product of this vector and another vector.
   * @param v - The other vector.
   * @returns The dot product ($x_1 \cdot x_2 + y_1 \cdot y_2 + z_1 \cdot z_2 + w_1 \cdot w_2$).
   */
  dot(v: Vec4): number {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }

  transformMat4(mat4: Mat4, out?: Vec4): Vec4 {
    const x: number = this.x;
    const y: number = this.y;
    const z: number = this.z;
    const w: number = this.w;

    const mat: number[] = mat4.elements;

    if (out) {
      out.x = mat[0] * x + mat[4] * y + mat[8] * z + mat[12] * w;
      out.y = mat[1] * x + mat[5] * y + mat[9] * z + mat[13] * w;
      out.z = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] * w;
      out.w = mat[3] * x + mat[7] * y + mat[11] * z + mat[15] * w;
      return out;
    }

    this.x = mat[0] * x + mat[4] * y + mat[8] * z + mat[12] * w;
    this.y = mat[1] * x + mat[5] * y + mat[9] * z + mat[13] * w;
    this.z = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] * w;
    this.w = mat[3] * x + mat[7] * y + mat[11] * z + mat[15] * w;
    return this;
  }

  /**
   * Instantiates and returns a brand new vector with the exact same component values.
   * @returns A new Vec4 instance.
   */
  clone(): Vec4 {
    return new Vec4(this.x, this.y, this.z, this.w);
  }

  /**
   * Sets the components of this vector to match another vector.
   * @param v - The vector to pull values from.
   * @returns This vector, allowing for method chaining.
   */
  set(v: Vec4): Vec4 {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    this.w = v.w;
    return this;
  }

  /**
   * Writes the vector's components into an array.
   * @param array - The target array (standard JS array or Float32Array).
   * @param offset - The index to start writing at (default: 0).
   * @returns The NEXT available offset index.
   */
  toArray(array: Float32Array | number[], offset: number = 0): number {
    array[offset] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;
    array[offset + 3] = this.w;
    return offset + 4; // Tells the next vector exactly where to start!
  }
}
