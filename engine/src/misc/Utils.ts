const DEG_TO_RAD: number = Math.PI / 180;

const RAD_TO_DEG: number = 180 / Math.PI;

export const toRadians: (deg: number) => number = (deg: number): number => {
  return deg * DEG_TO_RAD;
};

export const toDegrees: (rad: number) => number = (rad: number) => {
  return rad * RAD_TO_DEG;
};
