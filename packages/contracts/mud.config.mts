import { mudConfig } from "@latticexyz/cli";

export default mudConfig({
  tables: {
    TimestampTable: {
      schema: "uint256",
    },
    BudgetTable: {
      primaryKeys: {
        index: "uint32",
      },
      schema: "uint32",
    },
    TileTable: {
      primaryKeys: {
        index: "uint32",
        x: "uint32",
        y: "uint32",
      },
      schema: "uint8",
    },
  },
  modules: [],
});
