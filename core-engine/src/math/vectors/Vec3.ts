import { Mat3 } from "../matrix/Mat3";
import { Mat4 } from "../matrix/Mat4";

/**
 * Represents a 3-dimensional vector or point in 3D space.
 * Uses a hybrid memory pattern to prevent unnecessary garbage collection:
 * If an `out` vector is provided, the result is stored there. Otherwise, `this` is mutated.
 */
class Vec3 {
  /** The x component of the vector. */
  x: number;
  /** The y component of the vector. */
  y: number;
  /** The z component of the vector. */
  z: number;

  /**
   * Creates a new 3D vector.
   * @param x - The x value (default: 0).
   * @param y - The y value (default: 0).
   * @param z - The z value (default: 0).
   */
  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Adds another vector to this vector.
   * @param v - The vector to add.
   * @param out - Optional target vector to store the result.
   * @returns The mutated vector (either `out` or `this`) to allow chaining.
   */
  add(v: Vec3, out?: Vec3): Vec3 {
    if (out) {
      out.x = this.x + v.x;
      out.y = this.y + v.y;
      out.z = this.z + v.z;
      return out;
    }

    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  /**
   * Subtracts another vector from this vector.
   * Mathematically useful for finding the direction from `v` to `this`.
   * @param v - The vector to subtract.
   * @param out - Optional target vector to store the result.
   * @returns The mutated vector (either `out` or `this`).
   */
  subtract(v: Vec3, out?: Vec3): Vec3 {
    if (out) {
      out.x = this.x - v.x;
      out.y = this.y - v.y;
      out.z = this.z - v.z;
      return out;
    }

    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  /**
   * Multiplies this vector by another vector component-wise.
   * Useful for non-uniform scaling or color blending.
   * @param v - The vector to multiply by.
   * @param out - Optional target vector to store the result.
   * @returns The mutated vector (either `out` or `this`).
   */
  multiply(v: Vec3, out?: Vec3): Vec3 {
    if (out) {
      out.x = this.x * v.x;
      out.y = this.y * v.y;
      out.z = this.z * v.z;
      return out;
    }

    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    return this;
  }

  /**
   * Divides this vector by another vector component-wise.
   * Includes a soft fail-safe to prevent spreading NaN/Infinity on zero division.
   * @param v - The vector to divide by.
   * @param out - Optional target vector to store the result.
   * @returns The mutated vector (either `out` or `this`).
   */
  divide(v: Vec3, out?: Vec3): Vec3 {
    // Fast inline check. If any component is 0, we have a problem.
    if (v.x === 0 || v.y === 0 || v.z === 0) {
      console.warn("Prime3D Warning: Division by zero attempted.");
      return out ? out.copy(this) : this;
    }

    if (out) {
      out.x = this.x / v.x;
      out.y = this.y / v.y;
      out.z = this.z / v.z;
      return out;
    }

    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
    return this;
  }

  /**
   * Helper to throw a strict error on division by zero.
   * Currently bypassed in favor of a soft warning in the hot path.
   * @param v - The divisor vector to check.
   */
  /**
     private verifyDivByZero(v: Vec3) {
     if (v.x === 0 || v.y === 0 || v.z === 0) {
     throw new Error("Cannot Divide Vector by Zero!");
     }
     }*/

  /**
   * Scales this vector uniformly by a single scalar value.
   * @param scalar - The number to multiply each component by.
   * @param out - Optional target vector to store the result.
   * @returns The mutated vector (either `out` or `this`).
   */
  scale(scalar: number, out?: Vec3): Vec3 {
    if (out) {
      out.x = this.x * scalar;
      out.y = this.y * scalar;
      out.z = this.z * scalar;
      return out;
    }

    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  /**
   * Copies the x, y, and z components from another vector into this one.
   * @param v - The vector to copy from.
   * @returns This vector, allowing for method chaining.
   */
  copy(v: Vec3): Vec3 {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  /**
   * Inverts the direction of the vector.
   * @param out - Optional target vector to store the result.
   * @returns The mutated vector (either `out` or `this`).
   */
  negate(out?: Vec3): Vec3 {
    if (out) {
      out.x = -this.x;
      out.y = -this.y;
      out.z = -this.z;
      return out;
    }

    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  /**
   * Calculates the true magnitude (length) of the vector.
   * Uses $\sqrt{x^2 + y^2 + z^2}$.
   * @returns The length as a scalar number.
   */
  length(): number {
    const x: number = this.x * this.x;
    const y: number = this.y * this.y;
    const z: number = this.z * this.z;
    return Math.sqrt(x + y + z);
  }

  /**
   * Calculates the squared magnitude of the vector.
   * Skips the expensive square root operation. Ideal for performance-heavy comparisons.
   * @returns The squared length ($x^2 + y^2 + z^2$).
   */
  squaredLength(): number {
    const x: number = this.x * this.x;
    const y: number = this.y * this.y;
    const z: number = this.z * this.z;
    return x + y + z;
  }

  /**
   * Calculates the true distance between this point and another point `v`.
   * @param v - The target point.
   * @returns The distance as a scalar number.
   */
  distance(v: Vec3): number {
    const x: number = (this.x - v.x) * (this.x - v.x);
    const y: number = (this.y - v.y) * (this.y - v.y);
    const z: number = (this.z - v.z) * (this.z - v.z);
    return Math.sqrt(x + y + z);
  }

  /**
   * Calculates the squared distance between this point and another point `v`.
   * Skips the square root operation. Ideal for rapid collision detection checks.
   * @param v - The target point.
   * @returns The squared distance.
   */
  squaredDistance(v: Vec3): number {
    const x: number = (this.x - v.x) * (this.x - v.x);
    const y: number = (this.y - v.y) * (this.y - v.y);
    const z: number = (this.z - v.z) * (this.z - v.z);
    return x + y + z;
  }

  /**
   * Scales the vector to a length of exactly 1 while preserving its direction.
   * Safely handles normalization of zero-vectors by returning a zero-vector.
   * @param out - Optional target vector to store the result.
   * @returns The normalized vector (either `out` or `this`).
   */
  normalize(out?: Vec3): Vec3 {
    const mag: number = this.length();

    // Game Dev Safety: Prevent division by zero!
    if (mag === 0) {
      if (out) {
        out.x = 0;
        out.y = 0;
        out.z = 0;
        return out;
      }
      this.x = 0;
      this.y = 0;
      this.z = 0;
      return this;
    }

    if (out) {
      out.x = this.x / mag;
      out.y = this.y / mag;
      out.z = this.z / mag;
      return out;
    }

    this.x /= mag;
    this.y /= mag;
    this.z /= mag;
    return this;
  }

  /**
   * Calculates the dot product of this vector and another vector.
   * Returns a scalar representing how aligned the two vectors are.
   * @param v - The other vector.
   * @returns The dot product ($x_1 \cdot x_2 + y_1 \cdot y_2 + z_1 \cdot z_2$).
   */
  dot(v: Vec3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  /**
   * Calculates the cross product of this vector and another vector.
   * Returns a vector perpendicular to both input vectors.
   * Uses temporary variables internally to safely support mutating `this`.
   * @param v - The vector to cross with.
   * @param out - Optional target vector to store the result.
   * @returns The new perpendicular vector (either `out` or `this`).
   */
  cross(v: Vec3, out?: Vec3): Vec3 {
    // Calculate everything using the original, untouched values
    const cx = this.y * v.z - this.z * v.y;
    const cy = this.z * v.x - this.x * v.z;
    const cz = this.x * v.y - this.y * v.x;

    // Safely apply the results
    if (out) {
      out.x = cx;
      out.y = cy;
      out.z = cz;
      return out;
    }

    this.x = cx;
    this.y = cy;
    this.z = cz;
    return this;
  }

  transformMat3(mat3: Mat3, out?: Vec3): Vec3 {
    // Cache the original values to prevent premature overwriting
    const x: number = this.x;
    const y: number = this.y;
    const z: number = this.z;
    const mat: number[] = mat3.elements;
    if (out) {
      out.x = mat[0] * x + mat[3] * y + mat[6] * z;
      out.y = mat[1] * x + mat[4] * y + mat[7] * z;
      out.z = mat[2] * x + mat[5] * y + mat[8] * z;
      return out;
    }

    this.x = mat[0] * x + mat[3] * y + mat[6] * z;
    this.y = mat[1] * x + mat[4] * y + mat[7] * z;
    this.z = mat[2] * x + mat[5] * y + mat[8] * z;
    return this;
  }

  transformMat4(mat4: Mat4, out?: Vec3): Vec3 {
    // Cache the original values to prevent premature overwriting
    const x: number = this.x;
    const y: number = this.y;
    const z: number = this.z;
    const mat: number[] = mat4.elements;
    let w: number = mat[3] * x + mat[7] * y + mat[11] * z + mat[15];
    w = w || 1.0;
    if (out) {
      out.x = (mat[0] * x + mat[4] * y + mat[8] * z + mat[12]) / w;
      out.y = (mat[1] * x + mat[5] * y + mat[9] * z + mat[13]) / w;
      out.z = (mat[2] * x + mat[6] * y + mat[10] * z + mat[14]) / w;
      return out;
    }

    this.x = (mat[0] * x + mat[4] * y + mat[8] * z + mat[12]) / w;
    this.y = (mat[1] * x + mat[5] * y + mat[9] * z + mat[13]) / w;
    this.z = (mat[2] * x + mat[6] * y + mat[10] * z + mat[14]) / w;
    return this;
  }

  /**
   * Instantiates and returns a brand new vector with the exact same component values.
   * @returns A new Vec3 instance.
   */
  clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  /**
   * Sets the components of this vector to match another vector.
   * Acts similarly to copy(), but provides semantic flexibility for API design.
   * @param v - The vector to pull values from.
   * @returns This vector, allowing for method chaining.
   */
  set(v: Vec3): Vec3 {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
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

    return offset + 3; // Tells the next vector exactly where to start!
  }
}
