import { mudConfig } from "@latticexyz/cli";

export default mudConfig({
  overrideSystems: {
    FlipSystem: {
      fileSelector: "flip",
      openAccess: true,
    },
  },
  tables: {
    TileTable: {
      primaryKeys: {
        index: "uint32",
        x: "uint32",
        y: "uint32",
      },
      schema: "bool",
    },
  },
  modules: [],
});
