import { Renderer } from "../graphics/Renderer";
import { Picker } from "./Picker";

export class ColorPicker extends Picker {
  private renderer: Renderer;
  constructor(renderer: Renderer) {
    super();
    this.renderer = renderer;
  }
}
