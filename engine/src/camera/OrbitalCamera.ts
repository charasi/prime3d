import { Camera } from "./Camera";

export class OrbitalCamera extends Camera {
  constructor(fov: number, aspect: number, near: number, far: number) {
    super(fov, aspect, near, far);
  }
}
