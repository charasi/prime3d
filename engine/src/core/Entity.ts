import { Transform } from "./Transform";
import { Mesh } from "../graphics/Mesh";
import { Material } from "../graphics/Material";
import { mat4 } from "gl-matrix";

export class Entity {
  private _parent: Entity | null;
  private readonly _children: Entity[];
  private readonly _transform: Transform;
  private readonly _mesh?: Mesh | null;
  private readonly _material?: Material | null;

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
    let worldMatrix: mat4 | undefined;
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

  get mesh(): Mesh | null {
    return this._mesh ? this._mesh : null;
  }

  get material(): Material | null {
    return this._material ? this._material : null;
  }
}
