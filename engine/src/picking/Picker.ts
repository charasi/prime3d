import { PickResult } from "../misc/types/misc";

export abstract class Picker {
  abstract pick(x: number, y: number): PickResult;
}
