import { useEffect, useRef } from "react";
import styles from "./GeometryCanvas.module.css";
import { Renderer } from "@engine/renderer/Renderer";
import grVertex from "./grVertex.vert";
import grFragment from "./grFragment.frag";
import type {
  BufferConfig,
  DrawArrays,
  ShaderConfig,
  VtxShaderInput,
} from "@engine/misc/types";

export const GeometryCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const geometryRef = useRef<Renderer>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (!geometryRef.current) {
      try {
        geometryRef.current = new Renderer(canvasRef.current);
      } catch (err) {
        throw new Error("Could not Render geometry");
      }
    }

    //TODO: render
    let renderer: Renderer | null = geometryRef.current;
    const shaders: ShaderConfig[] = [
      { name: "geoShader", fragSrc: grFragment, vertSrc: grVertex },
    ];

    renderer.createPrograms(shaders);
    const vtxShaderInputs: VtxShaderInput[] = [
      { pgmName: "geoShader", input: "a_position" },
    ];
    renderer.addVertexInputs(vtxShaderInputs);

    const positions: number[] = [0, 0, 0, 0.5, 8, 0];
    const bufferConfigs: BufferConfig[] = [
      {
        attributeName: "a_position",
        target: "vertex",
        data: new Float32Array(positions),
        usage: "static",
        size: 2,
      },
    ];
    renderer.createVertexBuffers("geoVao", "geoShader", bufferConfigs);
    renderer.useProgram("geoShader");
    renderer.bindVAO("geoVao");
    const drawCall: DrawArrays = { type: "array", first: 0, count: 3 };
    renderer.draw("triangles", drawCall);

    return () => {
      if (geometryRef.current) {
        //TODO DESTROY
        geometryRef.current = null;
        renderer = null;
      }
    };
  }, []);

  return (
    <div>
      <h1 className={styles.geometry}>Geometry Canvas</h1>
      <canvas ref={canvasRef} width={800} height={400} />/
    </div>
  );
};
