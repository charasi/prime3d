import type { AttributeNames } from "@engine/misc/types";

export const attrNames: AttributeNames = {
  position: "a_position",
  normal: "a_normal",
  uv: "a_uv",
};

type PlanetAsset = {
  name: string;
  obj: string;
  mtl: string;
  mesh_name: string;
  material_name: string;
  textures?: string[];
  scale?: number;
};

export const PLANET_ASSETS: PlanetAsset[] = [
  {
    name: "earth",
    obj: "/planets/earth.obj",
    mtl: "/planets/earth.mtl",
    mesh_name: "earth_Sphere_Material.002",
    material_name: "earth_Material.002",
    textures: ["/planets/earth.jpg"],
  },
] as const;
