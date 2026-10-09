export class PointerManger {
  private canvas: HTMLCanvasElement;
  private picker: Picker;

  constructor(canvas: HTMLCanvasElement, picker: Picker) {
    this.canvas = canvas;
    this.picker = picker;

    // Use addEventListeners
    this.canvas.addEventListener("pointerdown", this.handlePointerDown);
    //this.canvas.addEventListener("pointermove", this.handlePointerMove);
    //this.canvas.addEventListener("pointerup", this.handlePointerUp);
  }
}
