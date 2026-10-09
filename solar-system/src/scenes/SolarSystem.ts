import { Application } from "@engine/core/Application.ts";
import { Assets } from "@engine/core/Assets.ts";
import type {
  BufferConfig,
  DrawArrays,
  MeshData,
  MTLConfig,
  ShaderConfig,
  ShaderUniformData,
} from "@engine/misc/types";
import { Entity } from "@engine/core/Entity.ts";
import { PLANET_ASSETS } from "../misc/utils.ts";
import { Mesh } from "@engine/graphics/Mesh.ts";
import { Material } from "@engine/graphics/Material.ts";
import { attrNames } from "../misc/utils.ts";
import { mat4 } from "gl-matrix";

import PlanetVert from "./shaders/Planets.vert?raw";
import PlanetFrag from "./shaders/Planets.frag?raw";
import AltPlanetFrag from "./shaders/AltPlanets.frag?raw";

export class SolarSystem {
  private app: Application;
  private assets: Assets;
  private entities: Map<string, Entity>;
  private programs: Set<string>;
  private vaos: Set<string>;
  private readonly textures: WebGLTexture[] | null;

  private _shaders: ShaderConfig[] = [
    { name: "planets", fragSrc: PlanetFrag, vertSrc: PlanetVert },
    { name: "alt_planets", fragSrc: AltPlanetFrag, vertSrc: PlanetVert },
  ];

  constructor(canvas: HTMLCanvasElement) {
    this.app = new Application(canvas, this._shaders);
    this.assets = new Assets();
    this.programs = new Set(this._shaders.map((element) => element.name));
    this.textures = [];
    this.entities = new Map<string, Entity>();
    this.vaos = new Set();
  }

  async init(): Promise<void> {
    const loadTasks: Promise<any>[] = [];
    //debugger;
    for (const planet of PLANET_ASSETS) {
      // Push the geometry load task
      loadTasks.push(this.assets.loadObjects(planet.name, planet.obj));
      // Push the material load task
      loadTasks.push(this.assets.loadMaterial(planet.name, planet.mtl));
      // Await every single asset concurrently
      await Promise.all(loadTasks);

      const meshData: MeshData | undefined = this.assets.getMeshData(
        planet.name,
        planet.mesh_name,
      );

      const materialData: MTLConfig | undefined = this.assets.getMaterialData(
        planet.name,
        planet.material_name,
      );

      if (planet.textures) {
        const textures = await this.app.renderer.createTextures(
          planet.textures,
        );

        this.textures?.push(...textures);
      }

      const mesh: Mesh = new Mesh(planet.name, meshData!);
      const material: Material = Material.fromMTL(materialData!);
      const entity = new Entity(planet.name, mesh, material);
      this.entities.set(planet.name, entity);

      const buffers: BufferConfig[] = mesh.createVertexData(attrNames);
      const vao_planet: string = planet.name + "_vao";
      this.vaos.add(vao_planet);

      this.app.renderer.createVertexBuffers(vao_planet, buffers);
      //this.app.renderer.bindUniform(uniformData);
      this.app.stage.root.addChild(entity);
      this.app.stage.update();
      this.app.stage.getRenderables();
    }

    this.app.renderer.createPickingFramebuffer();

    if (this.textures !== null)
      this.app.renderer.setActiveTextures(this.textures);

    this.app.camera.transform.position = [0, 1, 3];

    // Calculate dynamic vertex count so the whole mesh draws
    this.render();
    // pass update function (reference) to ticker to run later
    this.app.ticker.add(0, this.update);
    // start ticker
    this.app.ticker.start();
  }

  render(): void {
    this.app.renderer.clear(0.2, 0.2, 0.2, 1.0);
    //this.renderAltPlanets();
    this.renderPlanets();
  }

  //
  private update: (deltaTime: number) => void = (deltaTime: number): void => {
    this.entities.forEach((entity: Entity) => {
      entity.transform.rotateEulerAngles(
        0.07 * deltaTime,
        0.09 * deltaTime,
        0.12 * deltaTime,
      );
    });

    // 2. Stage update
    this.app.stage.update();
    // 3. Render
    this.render();
  };

  renderPlanets(): void {
    const program: string = "planets";
    if (!this.programs.has(program)) {
      throw new Error("Program Planet Not Created!");
    }

    const viewMatrix: mat4 = this.app.camera.getViewMatrix();
    const projMatrix: mat4 = this.app.camera.getProjectionMatrix();

    this.entities.forEach((entity: Entity) => {
      const entity_vao: string = entity.name + "_vao";

      if (!this.vaos.has(entity_vao)) {
        throw new Error("VAO " + entity_vao + " not found! ");
      }

      const modelMatrix: mat4 = entity.transform.worldMatrix;

      const uniformData: ShaderUniformData[] = [];

      if (entity.material != null) {
        const tempUniformData: ShaderUniformData[] =
          entity.material!.extractUniforms();
        uniformData.push(...tempUniformData);
      }

      // Inject ONLY the matrices the shader needs
      uniformData.push(
        {
          uniformName: "u_modelMatrix",
          type: "mat4",
          data: modelMatrix as Float32Array,
        },
        {
          uniformName: "u_viewMatrix",
          type: "mat4",
          data: viewMatrix as Float32Array,
        },
        {
          uniformName: "u_projectionMatrix",
          type: "mat4",
          data: projMatrix as Float32Array,
        },
        {
          uniformName: "u_planet",
          type: "int",
          data: 0,
        },
      );

      const vertexCount: number = entity.mesh!.meshData!.position.length / 3;
      const drawCall: DrawArrays = {
        type: "array",
        first: 0,
        count: vertexCount,
      };

      this.app.renderer.bindUniform(program, uniformData);

      this.app.renderer.enableBlending();

      this.app.renderer.bindVAO(entity_vao);

      this.app.renderer.draw("triangles", drawCall);
    });
  }

  renderAltPlanets(): void {
    const program: string = "alt_planets";
    if (!this.programs.has(program)) {
      throw new Error("Program Planet Not Created!");
    }

    const viewMatrix: mat4 = this.app.camera.getViewMatrix();
    const projMatrix: mat4 = this.app.camera.getProjectionMatrix();

    // Track an incrementing ID (starting at 1, so 0 is reserved for empty space/background)
    let currentId = 1;

    this.entities.forEach((entity: Entity) => {
      const entity_vao: string = entity.name + "_vao";

      if (!this.vaos.has(entity_vao)) {
        throw new Error("VAO " + entity_vao + " not found! ");
      }

      const modelMatrix: mat4 = entity.transform.worldMatrix;

      // 1. Convert the integer ID into RGBA normalized floats (0.0 to 1.0)
      const r = ((currentId >> 16) & 255) / 255.0;
      const g = ((currentId >> 8) & 255) / 255.0;
      const b = (currentId & 255) / 255.0;
      const a = 1.0;

      const uniformData: ShaderUniformData[] = [];

      // 2. Inject the calculated vec4 color array
      uniformData.push(
        {
          uniformName: "u_ObjectId",
          type: "vec4", // Changed from mat4
          data: [r, g, b, a], // Changed from modelMatrix
        },
        {
          uniformName: "u_modelMatrix",
          type: "mat4",
          data: modelMatrix as Float32Array,
        },
        {
          uniformName: "u_viewMatrix",
          type: "mat4",
          data: viewMatrix as Float32Array,
        },
        {
          uniformName: "u_projectionMatrix",
          type: "mat4",
          data: projMatrix as Float32Array,
        },
        {
          uniformName: "u_planet",
          type: "int",
          data: 0,
        },
      );

      const vertexCount: number = entity.mesh!.meshData!.position.length / 3;
      const drawCall: DrawArrays = {
        type: "array",
        first: 0,
        count: vertexCount,
      };

      this.app.renderer.bindUniform(program, uniformData);

      this.app.renderer.enableBlending();

      this.app.renderer.bindVAO(entity_vao);

      this.app.renderer.draw("triangles", drawCall);

      // Increment the ID for the next entity in the loop
      currentId++;
    });
  }
}
