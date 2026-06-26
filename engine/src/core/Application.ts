import { Renderer } from "../graphics/Renderer";
import { Scene } from "./Scene";
import { Camera } from "./Camera";

import { ShaderConfig } from "../misc/types";
import { Ticker } from "./Ticker";

import VertexMain from "../shaders/VertexMain.vert?raw";
import FragmentMain from "../shaders/FragmentMain.frag?raw";

export class Application {
  private _renderer: Renderer;
  private _stage: Scene;
  private _camera: Camera;
  private _clock: number;
  private _lastTimestamp: number;
  private _ticker: Ticker;
  private static readonly _SHADER_NAME: string = "basic-shader";

  private readonly _shaders: ShaderConfig[] = [
    { name: "basic-shader", fragSrc: FragmentMain, vertSrc: VertexMain },
  ];

  constructor(canvas: HTMLCanvasElement) {
    this._stage = new Scene();
    this._clock = 0;
    this._lastTimestamp = 0;
    this._camera = new Camera(45, canvas.width / canvas.height, 1, 1000.0);
    this._ticker = new Ticker();
    this._renderer = new Renderer(canvas);
    this._renderer.createPrograms(this._shaders);
  }

  get stage(): Scene {
    return this._stage;
  }

  get ticker(): Ticker {
    return this._ticker;
  }

  get renderer(): Renderer {
    return this._renderer;
  }

  get camera(): Camera {
    return this._camera;
  }
}
