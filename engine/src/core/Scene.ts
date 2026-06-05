import { Entity } from "./Entity";

export class Scene {
  private root: Entity;
  private _renderables: Entity[];
  private _stack: Entity[];

  constructor() {
    this.root = new Entity();
    this._renderables = [];
    this._stack = [];
  }

  update(): void {
    // Triggers the recursive math cascade down the entire tree
    this.root.update();
  }

  getRenderables(): Entity[] {
    this._renderables.length = 0;
    this._stack.push(this.root);

    while (this._stack.length > 0) {}
    return this._renderables;
  }
}
