import { Entity } from "./Entity";
import { i } from "vitest/dist/chunks/reporters.d.DVUYHHhe";

export class Scene {
  private _root: Entity;
  private _renderables: Entity[];
  private _stack: Entity[];

  constructor() {
    this._root = new Entity();
    this._renderables = [];
    this._stack = [];
  }

  update(): void {
    // Triggers the recursive math cascade down the entire tree
    this._root.update();
  }

  getRenderables(): Entity[] {
    // 1. Clear the caches
    this._renderables.length = 0;
    this._stack.length = 0;

    // 2. Prime the pump
    this._stack.push(this._root);

    // 3. The Traversal
    while (this._stack.length > 0) {
      // We know length > 0, so pop() will never be undefined
      const entity: Entity = this._stack.pop()!;

      // 4. The Strict Filter
      if (entity.mesh && entity.material) {
        this._renderables.push(entity);
      }

      // 5. The Optimized Descent
      const children = entity.children;
      for (let i = 0; i < children.length; i++) {
        this._stack.push(children[i]);
      }
    }

    return this._renderables;
  }

  get root(): Entity {
    return this._root;
  }
}
