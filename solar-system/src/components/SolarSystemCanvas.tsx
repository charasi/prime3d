import { useEffect, useRef } from "react";
import { SolarSystem } from "../scenes/SolarSystem.ts";
// Import your SolarSystem class (adjust the path to match your structure)

export const SolarSystemCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 1. Safety check: ensure the canvas actually exists in the DOM
    if (!canvasRef.current) return;

    //debugger;
    // 2. Instantiate the application using the canvas ref
    const engine = new SolarSystem(canvasRef.current);

    // 3. Fire the async initialization pipeline
    engine
      .init()
      .then(() => {
        console.log("Prime3D: Solar System initialized successfully.");
        // Depending on your setup, you might need to manually start the ticker here:
        // engine.app.ticker.start();
      })
      .catch((error) => {
        console.error("Prime3D: Failed to initialize engine.", error);
      });

    // 4. THE CLEANUP PHASE (Crucial for WebGL in React)
    return () => {
      console.log("Prime3D: Tearing down engine...");
      // You must stop the requestAnimationFrame loop when navigating away from this component!
      // Otherwise, the loop keeps running in the background and will crash.
      // e.g., engine.app.ticker.stop();
    };
  }, []); // Empty dependency array ensures this only runs on mount/unmount

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      <canvas
        style={{ width: "600px", height: "600px", border: "1px solid #333" }}
        width={1200}
        height={1200}
        ref={canvasRef}
      />
    </div>
  );
};
