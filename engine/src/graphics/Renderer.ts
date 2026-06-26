import type {
  ShaderConfig,
  BufferConfig,
  ShaderUniformData,
  DrawCall,
  DrawMode,
} from "../misc/types";

export class Renderer {
  private canvas: HTMLCanvasElement;
  private readonly gl: WebGL2RenderingContext | null = null;
  private programs: Map<string, WebGLProgram>;
  private vertShaders: Map<string, WebGLShader>;
  private fragmentShaders: Map<string, WebGLShader>;
  private vaos: Map<string, WebGLVertexArrayObject>;
  private uniformLocations: Map<string, WebGLUniformLocation>;
  private activeProgramName: string | null;
  private activeVAOName: string | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    // 2. The class extracts the context itself!
    this.gl = this.canvas.getContext("webgl2");
    if (!this.gl) {
      throw new Error("Prime3D: WebGL2 is not supported by this browser.");
    }
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.vertShaders = new Map<string, WebGLShader>();
    this.fragmentShaders = new Map<string, WebGLShader>();
    this.programs = new Map<string, WebGLProgram>();
    this.vaos = new Map<string, WebGLVertexArrayObject>();
    this.uniformLocations = new Map<string, WebGLUniformLocation>();
    this.activeProgramName = null;
    this.activeVAOName = null;
    this.viewport();
  }

  private viewport(): void {
    // Ensure the WebGL2 context exists before attempting GPU operations
    if (!this.gl) {
      throw new Error("Prime3D: WebGL2 is not supported by this browser.");
    }

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Compiles and links an array of shader configurations into ready-to-use WebGL Programs.
   * * This is the main entry point for material creation in Prime3D. It iterates through the
   * provided shader configurations, compiles the GLSL source code, links them into a WebGLProgram,
   * and automatically cleans up the loose shaders from GPU memory to prevent leaks.
   *
   * @param shaders - An array of configuration objects containing the material names and GLSL source code.
   * * @throws {Error} If the WebGL2 context is not initialized or supported.
   * @throws {Error} If the GPU fails to allocate memory for the new WebGLProgram.
   * @throws {Error} If the required vertex or fragment shaders were not successfully compiled.
   * @throws {Error} If the compiled shaders fail to link into a valid program (includes GPU error log).
   */
  createPrograms(shaders: ShaderConfig[]): void {
    // Ensure the WebGL2 context exists before attempting GPU operations
    if (!this.gl) {
      throw new Error("Prime3D: WebGL2 is not supported by this browser.");
    }

    for (const shader of shaders) {
      this.createShaders(shader);

      // Create a program
      const program: WebGLProgram | null = this.gl.createProgram();
      if (!program) {
        throw new Error(
          `Prime3D: Failed to create WebGLProgram for ${shader.name}`,
        );
      }

      const vertexShader: WebGLShader | undefined = this.vertShaders.get(
        shader.name,
      );
      const fragmentShader: WebGLShader | undefined = this.fragmentShaders.get(
        shader.name,
      );

      // throw error if shaders not created
      if (!vertexShader) {
        throw new Error("Prime3D: Vertex shader missing for " + shader.name);
      }
      // throw error if shaders not created
      if (!fragmentShader) {
        throw new Error("Prime3D: Fragment shader missing for " + shader.name);
      }

      // Attach the shaders to this program
      this.gl.attachShader(program, vertexShader);
      this.gl.attachShader(program, fragmentShader);
      this.gl.linkProgram(program);

      if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
        const errorLog = this.gl.getProgramInfoLog(program);
        this.gl.deleteProgram(program);
        throw new Error(
          `Prime3D: Could not link program '${shader.name}':\n${errorLog}`,
        );
      }

      // Memory Cleanup! Flag the loose shaders for deletion
      this.gl.deleteShader(vertexShader);
      this.gl.deleteShader(fragmentShader);

      this.programs.set(shader.name, program);

      const numUniforms = this.gl.getProgramParameter(
        program,
        this.gl.ACTIVE_UNIFORMS,
      );

      for (let i = 0; i < numUniforms; i++) {
        const uniformInfo = this.gl.getActiveUniform(program, i);
        if (uniformInfo) {
          const location = this.gl.getUniformLocation(
            program,
            uniformInfo.name,
          );
          if (location) {
            // Strip "[0]" from array uniforms so you can bind arrays easily
            const cleanName = uniformInfo.name.replace(/\[0\]$/, "");
            const storageKey = `${shader.name}:${cleanName}`;
            this.uniformLocations.set(storageKey, location);
          }
        }
      }
    }
  }

  /**
   * An internal utility that allocates, injects, and compiles raw GLSL code into WebGLShaders.
   * * This method is called automatically by `createPrograms`. It rigorously checks for GLSL
   * syntax errors and safely deletes failed shaders to prevent GPU memory leaks. Successfully
   * compiled shaders are temporarily stored in the engine's internal maps for linking.
   *
   * @param shader - A single shader configuration object to compile.
   * * @throws {Error} If the WebGL2 context is not initialized or supported.
   * @throws {Error} If the GPU fails to allocate memory for the vertex or fragment shaders.
   * @throws {Error} If the vertex or fragment shader GLSL code contains syntax errors (includes GPU error log).
   */
  private createShaders(shader: ShaderConfig): void {
    // Ensure the WebGL2 context exists before attempting GPU operations
    if (!this.gl) {
      throw new Error("Prime3D: WebGL2 is not supported by this browser.");
    }

    // 1. Allocate memory for the new shaders on the GPU
    const vShader: WebGLShader | null = this.gl.createShader(
      this.gl.VERTEX_SHADER,
    );
    const fShader: WebGLShader | null = this.gl.createShader(
      this.gl.FRAGMENT_SHADER,
    );

    // Type Guard: Ensure allocation was successful
    if (!vShader || !fShader) {
      throw new Error(
        `Prime3D: Failed to allocate memory for shader: ${shader.name}`,
      );
    }

    // 2. Supply the GLSL source code and compile the Vertex Shader
    this.gl.shaderSource(vShader, shader.vertSrc);
    this.gl.compileShader(vShader);

    // Validate Vertex Shader compilation
    if (!this.gl.getShaderParameter(vShader, this.gl.COMPILE_STATUS)) {
      const errorLog = this.gl.getShaderInfoLog(vShader);
      this.gl.deleteShader(vShader); // Prevent GPU memory leak on failure
      throw new Error(
        `Prime3D: Cannot compile Vertex Shader '${shader.name}':\n${errorLog}`,
      );
    }

    // 3. Supply the GLSL source code and compile the Fragment Shader
    this.gl.shaderSource(fShader, shader.fragSrc);
    this.gl.compileShader(fShader);

    // Validate Fragment Shader compilation
    if (!this.gl.getShaderParameter(fShader, this.gl.COMPILE_STATUS)) {
      const errorLog = this.gl.getShaderInfoLog(fShader);
      this.gl.deleteShader(fShader); // Prevent GPU memory leak on failure
      throw new Error(
        `Prime3D: Cannot compile Fragment Shader '${shader.name}':\n${errorLog}`,
      );
    }

    // 4. Store the successfully compiled shaders for later linking
    this.vertShaders.set(shader.name, vShader);
    this.fragmentShaders.set(shader.name, fShader);
  }

  createVertexBuffers(
    vao: string,
    programName: string, // We need this back so we can query the program!
    bufferConfigs: BufferConfig[],
  ): void {
    if (!this.gl) throw new Error("Prime3D: WebGL2 is not supported.");

    const program: WebGLProgram | undefined = this.programs.get(programName);
    if (!program)
      throw new Error(`Prime3D: Program '${programName}' not found.`);

    const vaoRef: WebGLVertexArrayObject | null = this.gl.createVertexArray();
    if (!vaoRef) throw new Error("GPU out of memory");

    this.gl.bindVertexArray(vaoRef);

    for (const config of bufferConfigs) {
      const buffer: WebGLBuffer | null = this.gl.createBuffer();
      if (!buffer) throw new Error("GPU out of memory");

      const bufferType: number = this.getBufferType(config.target);
      this.gl.bindBuffer(bufferType, buffer);

      const bufferUsage: number = this.getBufferUsage(config.usage);
      this.gl.bufferData(bufferType, config.data, bufferUsage);

      // Just-In-Time Query!
      if (config.target === "vertex" && config.attributeName) {
        const location: number = this.gl.getAttribLocation(
          program,
          config.attributeName,
        );

        // Safely check if the compiler optimized it out
        if (location !== -1) {
          this.gl.enableVertexAttribArray(location);
          this.gl.vertexAttribPointer(
            location,
            config.size!,
            this.gl.FLOAT,
            false,
            0,
            0,
          );
        } else {
          console.warn(
            `Prime3D: Attribute '${config.attributeName}' missing or optimized out in '${programName}'.`,
          );
        }
      }
    }

    this.vaos.set(vao, vaoRef);
    this.gl.bindVertexArray(null);
  }

  private getBufferType(bt: string): number {
    // Ensure the WebGL2 context exists before attempting GPU operations
    if (!this.gl) {
      throw new Error("Prime3D: WebGL2 is not supported by this browser.");
    }
    switch (bt) {
      case "vertex":
        return this.gl.ARRAY_BUFFER;
      case "index":
        return this.gl.ELEMENT_ARRAY_BUFFER;
      case "uniform":
        return this.gl.UNIFORM_BUFFER;
      case "transformFeedback":
        return this.gl.TRANSFORM_FEEDBACK_BUFFER;
      case "pixelUnpack":
        return this.gl.PIXEL_UNPACK_BUFFER;
      case "pixelPack":
        return this.gl.PIXEL_PACK_BUFFER;
      case "copyRead":
        return this.gl.COPY_READ_BUFFER;
      case "copyWrite":
        return this.gl.COPY_WRITE_BUFFER;
      default:
        return -1;
    }
  }

  private getBufferUsage(bus: string): number {
    // Ensure the WebGL2 context exists before attempting GPU operations
    if (!this.gl) {
      throw new Error("Prime3D: WebGL2 is not supported by this browser.");
    }

    switch (bus) {
      case "static":
        return this.gl.STATIC_DRAW;
      case "dynamic":
        return this.gl.DYNAMIC_DRAW;
      case "stream":
        return this.gl.STREAM_DRAW;
      default:
        return this.gl.STATIC_DRAW;
    }
  }

  bindUniform(shaderUniformData: ShaderUniformData[]): void {
    // Ensure the WebGL2 context exists before attempting GPU operations
    if (!this.gl) {
      throw new Error("Prime3D: WebGL2 is not supported by this browser.");
    }

    for (const config of shaderUniformData) {
      // 1. THE FIX: Guarantee the correct shader is active before sending data!
      // (This is virtually free because your useProgram method caches the active state)
      this.useProgram(config.pgmName);

      const storageKey = `${config.pgmName}:${config.uniformName}`;
      const location = this.uniformLocations.get(storageKey);

      if (!location) continue;
      const value = config.data;

      switch (config.type) {
        case "float":
          this.gl.uniform1f(location, value as number);
          break;
        case "int":
          this.gl.uniform1i(location, value as number);
          break;
        case "vec2":
          this.gl.uniform2fv(location, value as Float32Array | number[]);
          break;
        case "vec3":
          this.gl.uniform3fv(location, value as Float32Array | number[]);
          break;
        case "vec4":
          this.gl.uniform4fv(location, value as Float32Array | number[]);
          break;
        case "mat3":
          this.gl.uniformMatrix3fv(location, false, value as Float32Array);
          break;
        case "mat4":
          this.gl.uniformMatrix4fv(location, false, value as Float32Array);
          break;
        default:
          console.error(`Prime3D: Unsupported uniform type '${config.type}'`);
      }
    }
  }

  useProgram(pgmName: string): void {
    if (!this.gl) {
      throw new Error("Prime3D: WebGL2 is not supported by this browser.");
    }

    if (this.activeProgramName === pgmName) {
      return;
    }

    const program: WebGLProgram | undefined = this.programs.get(pgmName);
    if (!program) {
      throw new Error(
        `Prime3D: Cannot use program. '${pgmName}' not found in engine.`,
      );
    }
    this.gl.useProgram(program);
    this.activeProgramName = pgmName;
  }

  bindVAO(vaoName: string): void {
    if (!this.gl) {
      throw new Error("Prime3D: WebGL2 is not supported by this browser.");
    }

    // THE CACHE: Don't re-bind if it's already plugged in!
    if (this.activeVAOName === vaoName) {
      return;
    }

    const vao: WebGLVertexArrayObject | undefined = this.vaos.get(vaoName);
    if (!vao) {
      throw new Error(
        `Prime3D: Cannot bind geometry. '${vaoName}' not found in engine.`,
      );
    }

    this.gl.bindVertexArray(vao);
    this.activeVAOName = vaoName;
  }

  draw(drawMode: DrawMode, drawCall: DrawCall): void {
    if (!this.gl) {
      throw new Error("Prime3D: WebGL2 is not supported by this browser.");
    }

    // 1. Get the WebGL mode once
    const glMode: number = this.drawModeHelper(drawMode);

    // 2. Switch directly on the object's type!
    switch (drawCall.type) {
      case "array":
        this.gl.drawArrays(glMode, drawCall.first, drawCall.count);
        break;

      case "elements":
        this.gl.drawElements(
          glMode,
          drawCall.count,
          drawCall.indexType,
          drawCall.offset,
        );
        break;

      default:
        console.error("Prime3D: Invalid draw call type provided.");
    }
  }

  private drawModeHelper(drawMode: DrawMode): number {
    if (!this.gl) throw new Error("Prime3D: WebGL2 context missing.");

    switch (drawMode) {
      case "lines":
        return this.gl.LINES;
      case "points":
        return this.gl.POINTS;
      case "triangles":
        return this.gl.TRIANGLES;
      default:
        return this.gl.TRIANGLES; // Always provide a safe fallback!
    }
  }

  // Add to Renderer.ts
  enableBlending(): void {
    if (!this.gl) return;
    this.gl.enable(this.gl.BLEND);
    // Standard Alpha Blending
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
  }

  //
  async createTextures(urls: string[]): Promise<WebGLTexture[]> {
    if (!this.gl) throw new Error("WebGL context is not initialized");
    const maxUnits: number = this.gl?.getParameter(
      this.gl?.MAX_COMBINED_TEXTURE_IMAGE_UNITS,
    );
    if (urls.length > maxUnits) {
      throw new Error(
        `WebGL can only support ${maxUnits} textures in a single draw call.`,
      );
    }

    const loadedTextures = (url: string): Promise<WebGLTexture> => {
      return new Promise((resolve, reject) => {
        const image: HTMLImageElement = new Image();
        //image.crossOrigin = "anonymous";
        image.src = url;
        image.onload = () => {
          const gl: WebGL2RenderingContext = this.gl!;
          const texture: WebGLTexture = gl.createTexture();
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            image,
          );

          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

          gl.bindTexture(gl.TEXTURE_2D, null);
          resolve(texture);
        };

        image.onerror = () => {
          reject(new Error(`Failed to load texture image from url: ${url}`));
        };
      });
    };

    return Promise.all(urls.map((url) => loadedTextures(url)));
  }

  setActiveTextures(textures: WebGLTexture[]): void {
    if (!this.gl) return;
    for (let i = 0; i < textures.length; i++) {
      this.gl.activeTexture(this.gl.TEXTURE0 + i);
      this.gl.bindTexture(this.gl.TEXTURE_2D, textures[i]);
    }
  }

  disableBlending(): void {
    if (!this.gl) return;
    this.gl.disable(this.gl.BLEND);
  }

  flipTexture(): void {
    if (!this.gl) return;
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
  }

  clear(r: number, g: number, b: number, a: number = 1.0): void {
    if (!this.gl) {
      throw new Error("Prime3D: WebGL2 context missing.");
    }
    // 1. Set the background color (e.g., 0.2, 0.2, 0.2 for dark gray)
    this.gl.clearColor(r, g, b, a);

    // 2. Wipe the canvas AND the depth buffer clean!
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}
