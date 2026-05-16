export interface ShaderConfig {
  name: string;
  vertSrc: string;
  fragSrc: string;
}

export interface VtxShaderInput {
  pgmName: string;
  input: string;
}

// 1. All 8 WebGL2 Buffer Slots
export type BufferTarget =
  | "vertex" // ARRAY_BUFFER
  | "index" // ELEMENT_ARRAY_BUFFER
  | "uniform" // UNIFORM_BUFFER (UBOs)
  | "transformFeedback" // TRANSFORM_FEEDBACK_BUFFER
  | "pixelUnpack" // PIXEL_UNPACK_BUFFER (Image to GPU)
  | "pixelPack" // PIXEL_PACK_BUFFER (GPU to Image)
  | "copyRead" // COPY_READ_BUFFER
  | "copyWrite"; // COPY_WRITE_BUFFER

// 2. How the GPU should manage the memory
export type BufferUsage =
  | "static" // Sent once, used many times
  | "dynamic" // Updated frequently (e.g., a moving character)
  | "stream"; // Updated every single frame (e.g., particle physics)

// 3. Every valid Typed Array WebGL accepts
export type WebGLTypedArray =
  | Float32Array
  | Uint16Array
  | Uint32Array
  | Uint8Array
  | Int32Array
  | Int16Array
  | Int8Array;

export interface BufferConfig {
  attributeName: string; // Identifier (e.g., 'aVertexPosition', 'uCameraBlock', or 'myIndexBuffer')
  target: BufferTarget; // Which of the 8 slots this plugs into
  data: WebGLTypedArray | null; // The actual numbers (null if just allocating empty space)
  usage: BufferUsage; // Defaults to 'static' if not provided
  size?: number; // ONLY used for 'vertex' targets (e.g., 3 for a vec3)
}

export type UniformType =
  | "float" // Time, single numbers
  | "int" // Booleans (0 or 1), Texture slots
  | "vec2" // 2D Coordinates (x, y)
  | "vec3" // Colors (r, g, b) or 3D Positions
  | "vec4" // Colors with transparency (r, g, b, a)
  | "mat3" // 2D Rotation/Scale matrices
  | "mat4"; // 3D Camera and World matrices

export type UniformData = number | number[] | Float32Array;

export interface ShaderUniformInput {
  pgmName: string;
  input: UniformType; // e.g., 'uModelViewMatrix' or 'uColor'
}

export interface ShaderUniformData {
  pgmName: string;
  uniformName: string; // e.g., 'uModelViewMatrix' or 'uColor'
  type: UniformType;
  data: UniformData;
}

export type DrawType = "array" | "elements";

export type DrawMode = "lines" | "points" | "triangles";

export interface DrawArrays {
  type: "array";
  first: number;
  count: number;
}

export interface DrawElements {
  type: "elements";
  count: number;
  indexType: number; // e.g., gl.UNSIGNED_SHORT
  offset: number;
}

export type DrawCall = DrawArrays | DrawElements;

export interface AttributeNames {
  position: string;
  normal: string;
  uv: string;
}
