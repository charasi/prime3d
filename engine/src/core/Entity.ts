import { Transform } from "./Transform";
import { Material, MeshData } from "../misc/types";
import { Mat4 } from "../math/matrix/Mat4";
import { Mesh } from "../graphics/Mesh";

export class Entity {
  private _parent: Entity | null;
  private _children: Entity[];
  private _transform: Transform;
  private _mesh?: Mesh;
  private _material?: Material;

  constructor(mesh?: Mesh, material?: Material) {
    this._transform = new Transform();
    this._parent = null;
    this._children = [];
    if (mesh) {
      this._mesh = mesh;
    }
    if (material) {
      this._material = material;
    }
  }

  addChild(child: Entity): void {
    this._children.push(child);
    child._parent = this;
    child._transform.isDirty = true;
  }

  update(): void {
    let worldMatrix: Mat4 | undefined;
    if (this._parent != null) {
      worldMatrix = this._parent._transform.worldMatrix;
    }
    this._transform.updateWorldMatrix(worldMatrix);
    this._children.forEach((child: Entity) => {
      child.update();
    });
  }

  get parent(): Entity | null {
    return this._parent;
  }

  get children(): Entity[] {
    return this._children;
  }

  get transform(): Transform {
    return this._transform;
  }

  get mesh(): Mesh {
    return this._mesh;
  }

  get material(): Material {
    return this._material;
  }
}
