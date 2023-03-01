import { MUDUserConfig } from "@latticexyz/cli";
import { SchemaType } from "@latticexyz/schema-type";
import { ethers } from "ethers";

const config: MUDUserConfig = {
  baseRoute: "/hello",
  worldPath: "./src/world",
  excludeSystems: ["System3", "System2"],
  overrideSystems: {
    System: {
      route: "/mySystem",
      openAccess: false,
      accessList: ["IncrementSystem", ethers.Wallet.createRandom().address],
    },
    IncrementSystem: {
      openAccess: true,
    },
  },
  tables: {
    CounterTable: {
      schema: {
        value: SchemaType.UINT32,
      },
    },
  },
};

export default config;
