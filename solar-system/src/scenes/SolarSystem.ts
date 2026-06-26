import { Application } from "@engine/core/Application";
import { Assets } from "@engine/core/Assets.ts";
import type {
  BufferConfig,
  DrawArrays,
  MeshData,
  MTLConfig,
  ShaderUniformData,
} from "@engine/misc/types";
import { Entity } from "@engine/core/Entity.ts";
import { PLANET_ASSETS } from "../misc/utils.ts";
import { Mesh } from "@engine/graphics/Mesh.ts";
import { Material } from "@engine/graphics/Material.ts";
import { attrNames } from "../misc/utils.ts";
import { mat4 } from "gl-matrix";

export class SolarSystem {
  private app: Application;
  private assets: Assets;
  private earth: Entity | null;
  private drawCall!: DrawArrays;
  private textures: WebGLTexture[] | null;

  constructor(canvas: HTMLCanvasElement) {
    this.app = new Application(canvas);
    this.assets = new Assets();
    this.earth = null;
    this.textures = null;
  }

  async init(): Promise<void> {
    const loadTasks: Promise<any>[] = [];
    const textures_urls: string[] = [];

    //debugger;

    for (const planet of PLANET_ASSETS) {
      // Push the geometry load task
      loadTasks.push(this.assets.loadObjects(planet.name, planet.obj));
      // Push the material load task (Fixed: using planet.mtl)
      loadTasks.push(this.assets.loadMaterial(planet.name, planet.mtl));
    }
    // Await every single asset concurrently
    await Promise.all(loadTasks);

    const earthMeshData: MeshData | undefined = this.assets.getMeshData(
      "earth",
      "earth_Sphere_Material.002",
    );

    const earthMaterialData: MTLConfig | undefined =
      this.assets.getMaterialData("earth", "earth_Material.002");

    if (earthMaterialData?.diffuseMap)
      textures_urls.push(earthMaterialData?.diffuseMap!);

    const earthMesh: Mesh = new Mesh("Earth", earthMeshData!);
    const earthMaterial: Material = Material.fromMTL(earthMaterialData!);
    this.earth = new Entity(earthMesh, earthMaterial);

    const buffers: BufferConfig[] = earthMesh.createVertexData(attrNames[0]);
    const pgmName: string = "basic-shader";
    const vaoPlanets: string = "basic-shader";

    const uniformData: ShaderUniformData[] =
      earthMaterial.extractUniforms(pgmName);

    this.textures = await this.app.renderer.createTextures(textures_urls);

    this.app.renderer.createVertexBuffers(vaoPlanets, pgmName, buffers);
    this.app.renderer.bindVAO(vaoPlanets);

    this.app.renderer.bindUniform(uniformData);
    this.app.stage.root.addChild(this.earth);

    this.app.camera.transform.translate([0, 0, 3]);

    // Calculate dynamic vertex count so the whole mesh draws
    const vertexCount: number = earthMeshData!.position.length / 3;
    this.drawCall = {
      type: "array",
      first: 0,
      count: vertexCount,
    };

    // STATIC TEST: Update the matrices once and push the draw call immediately
    this.app.stage.update();
    this.app.stage.getRenderables();
    //this.app.renderer.flipTexture();
    this.app.renderer.setActiveTextures(this.textures);
    this.render();
    // pass update function (reference) to ticker to run later
    this.app.ticker.add(0, this.update);
    // start ticker
    this.app.ticker.start();
  }

  render(): void {
    if (!this.earth || !this.earth.material) return;

    this.app.renderer.clear(0.2, 0.2, 0.2, 1.0);

    // Grab the Holy Trinity of matrices directly from your engine
    const viewMatrix: mat4 = this.app.camera.getViewMatrix();
    const projMatrix: mat4 = this.app.camera.getProjectionMatrix();
    const modelMatrix: mat4 = this.earth.transform.worldMatrix;

    const pgmName = "basic-shader";
    const uniformData: ShaderUniformData[] =
      this.earth.material.extractUniforms(pgmName);

    // Inject ONLY the matrices the shader needs
    uniformData.push(
      {
        pgmName: pgmName,
        uniformName: "u_modelMatrix",
        type: "mat4",
        data: modelMatrix as Float32Array,
      },
      {
        pgmName: pgmName,
        uniformName: "u_viewMatrix",
        type: "mat4",
        data: viewMatrix as Float32Array,
      },
      {
        pgmName: pgmName,
        uniformName: "u_projectionMatrix",
        type: "mat4",
        data: projMatrix as Float32Array,
      },
      {
        pgmName: pgmName,
        uniformName: "u_earthSampler",
        type: "int",
        data: 0,
      },
    );

    this.app.renderer.bindUniform(uniformData);

    this.app.renderer.enableBlending();

    this.app.renderer.draw("triangles", this.drawCall);
  }

  //
  private update: (deltaTime: number) => void = (deltaTime: number): void => {
    // 'this' is permanently locked to SolarSystem
    // 1. Rotate earth
    //const angle: number = 0.05;
    //this.earth?.transform.rotate(angle * deltaTime);
    this.earth?.transform.rotateEulerAngles(
      0.07 * deltaTime,
      0.09 * deltaTime,
      0.12 * deltaTime,
    );

    // 2. Stage update
    this.app.stage.update();
    // 3. Render
    this.render();
  };
}
