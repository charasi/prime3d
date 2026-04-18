import { Mat2 } from "../matrix/Mat2";
import { Mat3 } from "../matrix/Mat3";
import { Mat4 } from "../matrix/Mat4";

/**
 * Represents a 2-dimensional vector or point in 2D space.
 * Heavily used in WebGL for UV texture coordinates and 2D UI rendering.
 * Uses a hybrid memory pattern to prevent unnecessary garbage collection:
 * If an `out` vector is provided, the result is stored there. Otherwise, `this` is mutated.
 */
class Vec2 {
  /** The x component of the vector. */
  x: number;
  /** The y component of the vector. */
  y: number;

  /**
   * Creates a new 2D vector.
   * @param x - The x value (default: 0).
   * @param y - The y value (default: 0).
   */
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Adds another vector to this vector.
   * @param v - The vector to add.
   * @param out - Optional target vector to store the result.
   * @returns The mutated vector (either `out` or `this`) to allow chaining.
   */
  add(v: Vec2, out?: Vec2): Vec2 {
    if (out) {
      out.x = this.x + v.x;
      out.y = this.y + v.y;
      return out;
    }

    this.x += v.x;
    this.y += v.y;
    return this;
  }

  /**
   * Subtracts another vector from this vector.
   * @param v - The vector to subtract.
   * @param out - Optional target vector to store the result.
   * @returns The mutated vector (either `out` or `this`).
   */
  subtract(v: Vec2, out?: Vec2): Vec2 {
    if (out) {
      out.x = this.x - v.x;
      out.y = this.y - v.y;
      return out;
    }

    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  /**
   * Multiplies this vector by another vector component-wise.
   * @param v - The vector to multiply by.
   * @param out - Optional target vector to store the result.
   * @returns The mutated vector (either `out` or `this`).
   */
  multiply(v: Vec2, out?: Vec2): Vec2 {
    if (out) {
      out.x = this.x * v.x;
      out.y = this.y * v.y;
      return out;
    }

    this.x *= v.x;
    this.y *= v.y;
    return this;
  }

  /**
   * Divides this vector by another vector component-wise.
   * Includes a soft fail-safe to prevent spreading NaN/Infinity on zero division.
   * @param v - The vector to divide by.
   * @param out - Optional target vector to store the result.
   * @returns The mutated vector (either `out` or `this`).
   */
  divide(v: Vec2, out?: Vec2): Vec2 {
    if (v.x === 0 || v.y === 0) {
      console.warn("Prime3D Warning: Division by zero attempted in Vec2.");
      return out ? out.copy(this) : this;
    }

    if (out) {
      out.x = this.x / v.x;
      out.y = this.y / v.y;
      return out;
    }

    this.x /= v.x;
    this.y /= v.y;
    return this;
  }

  /**
   * Scales this vector uniformly by a single scalar value.
   * @param scalar - The number to multiply each component by.
   * @param out - Optional target vector to store the result.
   * @returns The mutated vector (either `out` or `this`).
   */
  scale(scalar: number, out?: Vec2): Vec2 {
    if (out) {
      out.x = this.x * scalar;
      out.y = this.y * scalar;
      return out;
    }

    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /**
   * Copies the x and y components from another vector into this one.
   * @param v - The vector to copy from.
   * @returns This vector, allowing for method chaining.
   */
  copy(v: Vec2): Vec2 {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  /**
   * Inverts the direction of the vector.
   * @param out - Optional target vector to store the result.
   * @returns The mutated vector (either `out` or `this`).
   */
  negate(out?: Vec2): Vec2 {
    if (out) {
      out.x = -this.x;
      out.y = -this.y;
      return out;
    }

    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  /**
   * Calculates the true magnitude (length) of the vector.
   * Uses $\sqrt{x^2 + y^2}$.
   * @returns The length as a scalar number.
   */
  length(): number {
    const x: number = this.x * this.x;
    const y: number = this.y * this.y;
    return Math.sqrt(x + y);
  }

  /**
   * Calculates the squared magnitude of the vector.
   * Skips the expensive square root operation. Ideal for performance-heavy comparisons.
   * @returns The squared length ($x^2 + y^2$).
   */
  squaredLength(): number {
    const x: number = this.x * this.x;
    const y: number = this.y * this.y;
    return x + y;
  }

  /**
   * Calculates the true distance between this point and another point `v`.
   * @param v - The target point.
   * @returns The distance as a scalar number.
   */
  distance(v: Vec2): number {
    const x: number = (this.x - v.x) * (this.x - v.x);
    const y: number = (this.y - v.y) * (this.y - v.y);
    return Math.sqrt(x + y);
  }

  /**
   * Calculates the squared distance between this point and another point `v`.
   * Skips the square root operation. Ideal for rapid collision detection checks.
   * @param v - The target point.
   * @returns The squared distance.
   */
  squaredDistance(v: Vec2): number {
    const x: number = (this.x - v.x) * (this.x - v.x);
    const y: number = (this.y - v.y) * (this.y - v.y);
    return x + y;
  }

  /**
   * Scales the vector to a length of exactly 1 while preserving its direction.
   * @param out - Optional target vector to store the result.
   * @returns The normalized vector (either `out` or `this`).
   */
  normalize(out?: Vec2): Vec2 {
    const mag: number = this.length();

    if (mag === 0) {
      if (out) {
        out.x = 0;
        out.y = 0;
        return out;
      }
      this.x = 0;
      this.y = 0;
      return this;
    }

    if (out) {
      out.x = this.x / mag;
      out.y = this.y / mag;
      return out;
    }

    this.x /= mag;
    this.y /= mag;
    return this;
  }

  /**
   * Calculates the dot product of this vector and another vector.
   * @param v - The other vector.
   * @returns The dot product ($x_1 \cdot x_2 + y_1 \cdot y_2$).
   */
  dot(v: Vec2): number {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * Calculates the 2D pseudo-cross product of this vector and another vector.
   * In 2D space, the cross product returns a scalar representing the Z magnitude.
   * @param v - The vector to cross with.
   * @returns The 2D cross product scalar.
   */
  cross(v: Vec2): number {
    return this.x * v.y - this.y * v.x;
  }

  transformMat2(mat2: Mat2, out?: Vec2): Vec2 {
    const x: number = this.x;
    const y: number = this.y;
    const mat: number[] = mat2.elements;
    if (out) {
      out.x = mat[0] * x + mat[2] * y;
      out.y = mat[1] * x + mat[3] * y;
      return out;
    }

    this.x = mat[0] * x + mat[2] * y;
    this.y = mat[1] * x + mat[3] * y;
    return this;
  }

  transformMat3(mat3: Mat3, out?: Vec2) {
    const x: number = this.x;
    const y: number = this.y;

    const mat: number[] = mat3.elements;

    if (out) {
      out.x = mat[0] * x + mat[3] * y + mat[6];
      out.y = mat[1] * x + mat[4] * y + mat[7];
      return out;
    }

    this.x = mat[0] * x + mat[3] * y + mat[6];
    this.y = mat[1] * x + mat[4] * y + mat[7];
    return this;
  }

  transformMat4(mat4: Mat4, out?: Vec2) {
    const x: number = this.x;
    const y: number = this.y;

    const mat: number[] = mat4.elements;

    if (out) {
      out.x = mat[0] * x + mat[4] * y + mat[12];
      out.y = mat[1] * x + mat[5] * y + mat[13];
      return out;
    }

    this.x = mat[0] * x + mat[4] * y + mat[12];
    this.y = mat[1] * x + mat[5] * y + mat[13];
    return this;
  }

  /**
   * Instantiates and returns a brand new vector with the exact same component values.
   * @returns A new Vec2 instance.
   */
  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  /**
   * Sets the components of this vector to match another vector.
   * @param v - The vector to pull values from.
   * @returns This vector, allowing for method chaining.
   */
  set(v: Vec2): Vec2 {
    this.x = v.x;
    this.y = v.y;
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
    return offset + 2; // Tells the next vector exactly where to start!
  }
}
