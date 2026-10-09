import { Transform } from "./Transform";
import { Mesh } from "../graphics/Mesh";
import { Material } from "../graphics/Material";
import { mat4 } from "gl-matrix";

export class Entity {
  private readonly _name: string = "";
  private _parent: Entity | null;
  private readonly _children: Entity[];
  private readonly _transform: Transform;
  private readonly _mesh?: Mesh | null;
  private readonly _material?: Material | null;

  constructor(name?: string, mesh?: Mesh, material?: Material) {
    if (name) this._name = name;
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

  /**
   * add a child to a parent
   * @param child entity to add to parent
   */
  addChild(child: Entity): void {
    this._children.push(child);
    child._parent = this;
    //child._transform.isDirty = true;
  }

  /**
   * update world matrix of entity
   */
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

  get name(): string {
    return this._name;
  }
}
