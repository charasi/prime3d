import { type RefObject, useEffect, useRef } from "react";
import { Renderer } from "@engine/renderer/Renderer.ts";
import type {
  BufferConfig,
  DrawCall,
  ShaderConfig,
  VtxShaderInput,
} from "@engine/misc/types";
import grVertex from "./grVertex.vert";
import grFragment from "./grFragment.frag";

export const Circle = () => {
  const canvasRef: RefObject<HTMLCanvasElement | null> =
    useRef<HTMLCanvasElement | null>(null);
  const circleRef: RefObject<Renderer | null> = useRef<Renderer>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (!circleRef.current) {
      try {
        circleRef.current = new Renderer(canvasRef.current);
      } catch (err) {
        throw new Error("Could not Render geometry");
      }
    }

    let renderer: Renderer | null = circleRef.current;

    const shaders: ShaderConfig[] = [
      { name: "circleShaders", vertSrc: grVertex, fragSrc: grFragment },
    ];
    renderer.createPrograms(shaders);

    const vtxShaderInputs: VtxShaderInput[] = [
      { pgmName: "circleShaders", input: "a_position" },
    ];
    renderer.addVertexInputs(vtxShaderInputs);

    const data: number[] = [];
    data.push(0.0, 0.0);
    const indexData: number[] = [];
    const numOfCircle = 32;
    const zero: number = 0;
    const stepSize = (Math.PI * 2) / numOfCircle;
    let currentAngle = 0;

    for (let i = 0; i <= numOfCircle; i++) {
      const x: number = Math.cos(currentAngle);
      const y: number = Math.sin(currentAngle);
      data.push(x);
      data.push(y);
      currentAngle += stepSize;
    }

    for (let i = 1; i <= numOfCircle; i++) {
      indexData.push(zero);
      indexData.push(i);
      indexData.push(i + 1);
    }

    const buffers: BufferConfig[] = [
      {
        attributeName: "a_position",
        target: "index",
        data: new Uint16Array(indexData),
        usage: "static",
        size: 2,
      },
      {
        attributeName: "a_position",
        target: "vertex",
        data: new Float32Array(data),
        usage: "static",
        size: 2,
      },
    ];

    renderer.createVertexBuffers("circleVao", "circleShaders", buffers);

    renderer.useProgram("circleShaders");
    renderer.bindVAO("circleVao");
    const drawCall: DrawCall = {
      type: "elements",
      count: indexData.length,
      indexType: WebGL2RenderingContext.UNSIGNED_SHORT, // This tells WebGL it is a Uint16Array!
      offset: 0,
    };
    renderer.draw("triangles", drawCall);

    return () => {
      if (circleRef.current) {
        circleRef.current = null;
      }
    };
  }, []);
  return (
    <>
      <canvas ref={canvasRef} width={800} height={400} />
    </>
  );
};
