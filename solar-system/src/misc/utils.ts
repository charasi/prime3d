import type { AttributeNames } from "@engine/misc/types";

export const attrNames: AttributeNames[] = [
  { position: "a_position", normal: "a_normal", uv: "a_uv" },
];

export const PLANET_ASSETS = [
  {
    name: "earth",
    obj: "/planets/earth.obj",
    mtl: "/planets/earth.mtl",
    //scale: 1.0,
  },
] as const;
