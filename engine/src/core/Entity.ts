import { Transform } from "./Transform";
import { Material, Mesh } from "../misc/types";
import { Mat4 } from "../math/matrix/Mat4";

export class Entity {
  private parent: Entity | null;
  private children: Entity[];
  private transform: Transform;
  private mesh?: Mesh;
  private material?: Material;

  constructor(mesh?: Mesh, material?: Material) {
    this.transform = new Transform();
    this.parent = null;
    this.children = [];
    if (mesh) {
      this.mesh = mesh;
    }
    if (material) {
      this.material = material;
    }
  }

  addChild(child: Entity): void {
    this.children.push(child);
    child.parent = this;
    child.transform.isDirty = true;
  }

  update(): void {
    let worldMatrix: Mat4 | undefined;
    if (this.parent != null) {
      worldMatrix = this.parent.transform.worldMatrix;
    }
    this.transform.updateWorldMatrix(worldMatrix);
    this.children.forEach((child: Entity) => {
      child.update();
    });
  }
}
