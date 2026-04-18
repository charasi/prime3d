import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { Renderer } from "@engine/renderer/Renderer.ts";
import type {
  BufferConfig,
  DrawArrays,
  ShaderConfig,
  VtxShaderInput,
} from "@engine/misc/types";
import grVertex from "./grVertex.vert";
import grFragment from "./grFragment.frag";

export const Sphere = () => {
  const canvasRef: RefObject<HTMLCanvasElement | null> =
    useRef<HTMLCanvasElement>(null);
  const sphereRef: RefObject<Renderer | null> = useRef<Renderer>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      sphereRef.current = new Renderer(canvasRef.current);
    } catch (err) {
      throw new Error("Could not Render geometry");
    }

    let sphere: Renderer | null = sphereRef.current;

    const shaders: ShaderConfig[] = [
      { name: "sphereShaders", vertSrc: grVertex, fragSrc: grFragment },
    ];
    sphere.createPrograms(shaders);

    const vtxShaderInputs: VtxShaderInput[] = [
      { pgmName: "sphereShaders", input: "a_position" },
    ];
    sphere.addVertexInputs(vtxShaderInputs);
    const vertexData: number[] = [];
    // size of sphere
    const gr: number = 0.5;
    // pitch angle
    const paDegrees: number = 60;
    const pa: number = paDegrees * (Math.PI / 180);
    //
    const y: number = gr * Math.sin(pa);
    const lr: number = gr * Math.cos(pa);

    const yawStep = (Math.PI * 2) / 8;
    let currentYaw = 0;

    for (let i = 0; i < 8; i++) {
      const x: number = lr * Math.cos(currentYaw);
      const z: number = lr * Math.sin(currentYaw);

      vertexData.push(x, y, z);
      currentYaw += yawStep;
    }

    const buffers: BufferConfig[] = [
      {
        attributeName: "a_position",
        target: "vertex",
        data: new Float32Array(vertexData),
        usage: "static",
        size: 3,
      },
    ];

    sphere.createVertexBuffers("sphereVao", "sphereShaders", buffers);
    sphere.useProgram("sphereShaders");
    sphere.bindVAO("sphereVao");
    const drawCall: DrawArrays = { type: "array", first: 0, count: 8 };
    sphere.draw("points", drawCall);

    return () => {
      if (sphereRef.current) {
        sphereRef.current = null;
        sphere = null;
      }
    };
  }, []);
  return (
    <>
      <canvas ref={canvasRef} width={800} height={400} />
    </>
  );
};
