import { mudConfig, resolveTableId } from "@latticexyz/cli";

export default mudConfig({
  overrideSystems: {
    FlipSystem: {
      fileSelector: "flip",
      openAccess: true,
    },
  },
  tables: {
    TileTable: {
      fileSelector: "tile",
      primaryKeys: {
        x: "int32",
        y: "int32",
      },
      schema: {
        value: "bool",
      },
    },
  },
  modules: [
    // {
    //   name: "KeysWithValueModule",
    //   root: true,
    //   args: [resolveTableId("TileTable")],
    // },
  ],
});
