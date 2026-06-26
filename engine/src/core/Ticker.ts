// type alias for function
type Listener = (deltaTime: number) => void;

export class Ticker {
  /**
   * The timestamp (in milliseconds) of the previous frame.
   * Used as the baseline to calculate elapsed time.
   */
  private lastTime: number;

  /**
   * The raw, uncapped milliseconds elapsed since the last frame.
   */
  private elapsedMS: number;

  /**
   * The clamped milliseconds elapsed. Protected against massive time jumps
   * (like switching browser tabs) by the maxElapsedMS ceiling.
   */
  private deltaMS: number;

  /**
   * A dimensionless scalar representing the current frame's time relative to the target frame rate.
   * Multiply this against speeds and velocities for frame-independent movement.
   * (e.g., ~1.0 at 60 FPS).
   */
  private deltaTime: number;

  /**
   * The maximum allowed milliseconds that can pass in a single frame.
   * Prevents physics tunneling and logic explosions after browser pauses.
   */
  private maxElapsedMS: number;

  /**
   * The target milliseconds per frame.
   * Defaults to 16.66ms to represent a target of 60 Frames Per Second.
   */
  private targetFPMS: number;

  /**
   * Indicates whether the Ticker's infinite requestAnimationFrame loop is active.
   */
  private started: boolean;

  /**
   * The ID returned by the browser's requestAnimationFrame.
   * Used to cleanly cancel the loop when the Ticker is stopped.
   */
  private requestId: number;

  /**
   * The priority-based callback queue.
   * Keys represent the execution priority phase, and values are arrays of listener functions.
   */
  private registry: Map<number, Listener[]>;

  constructor() {
    this.lastTime = 0;
    this.elapsedMS = 0;
    this.deltaMS = 0;
    this.deltaTime = 0;
    this.maxElapsedMS = 50;
    this.targetFPMS = 16.66;
    this.started = false;
    this.requestId = 0;
    this.registry = new Map();
  }

  /**
   * adds a listener function to the bucket
   * uses priority for key and array of listener for value
   * @param priority priority of the listener function
   * @param listener function for callback
   */
  add(priority: number, listener: Listener): void {
    let bucket: Listener[] | undefined = this.registry.get(priority);

    if (!bucket) {
      bucket = [];
      this.registry.set(priority, bucket);
    }

    bucket.push(listener);
  }

  /**
   * removes a listener from a bucket
   * @param priority listener priority
   * @param listener function to remove
   */
  remove(priority: number, listener: Listener): void {
    const bucket: Listener[] | undefined = this.registry.get(priority);

    if (bucket) {
      const index: number = bucket.indexOf(listener);

      // 1. Prevent the -1 trap!
      if (index !== -1) {
        bucket.splice(index, 1);

        // 2. Clean up dead memory to keep the tick loop fast
        if (bucket.length === 0) {
          this.registry.delete(priority);
        }
      }
    }
  }

  /**
   * starts the ticker
   */
  start(): void {
    if (this.started) return;
    this.started = true;

    // Establish the baseline time right as the engine turns on
    this.lastTime = performance.now();

    // Kick off the infinite loop and store the ID
    this.requestId = requestAnimationFrame((timestamp: number) =>
      this.tick(timestamp),
    );
  }

  /**
   *
   * @param currentTime
   * @private
   */
  private tick(currentTime: number): void {
    if (!this.started) return;

    // time since the very last frame
    this.elapsedMS = currentTime - this.lastTime;
    // for clamping (time is 3600000ms because user navigated away from browser)
    this.deltaMS = Math.min(this.elapsedMS, this.maxElapsedMS);
    /**
     * Converts the actual elapsed frame time into a normalized scalar value (typically ~1.0).
     * It does this by dividing the real milliseconds that passed by the ideal frame time (16.66ms for 60 FPS).
     * This creates a frame-rate independent multiplier used for physics and movement calculations.
     * If the browser lags and drops to 30 FPS, this value becomes 2.0, ensuring objects move twice as far to smoothly compensate for the dropped frame.
     */
    this.deltaTime = this.deltaMS / this.targetFPMS;
    this.lastTime = currentTime;

    const sortedPriorities: number[] = Array.from(this.registry.keys()).sort(
      (a: number, b: number): number => b - a,
    );

    for (const priority of sortedPriorities) {
      const listenersInBucket: Listener[] = this.registry.get(priority)!;

      // Create a snapshot to prevent bugs if a listener removes itself
      const frameSnapshot: Listener[] = [...listenersInBucket];

      for (const listener of frameSnapshot) {
        listener(this.deltaTime);
      }
    }

    this.requestId = requestAnimationFrame((timestamp: number) =>
      this.tick(timestamp),
    );
  }

  /**
   * stops the ticker
   */
  stop(): void {
    if (!this.started) return;

    // 1. Flip the flag to prevent future recursion
    this.started = false;

    // 2. Cancel the frame the browser is currently holding
    cancelAnimationFrame(this.requestId);
  }
}
