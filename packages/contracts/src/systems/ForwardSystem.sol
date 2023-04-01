// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { TileTable } from "../tables/TileTable.sol";
import { WIDTH } from "./InitSystem.sol";

uint256 constant ID = uint256(keccak256("system.Forward"));

contract ForwardSystem is System {
  function forward() public {
    for (uint32 x = 0; x < WIDTH; x++) {
      for (uint32 y = 0; y < WIDTH; y++) {
        bool a = TileTable.get(0, x, y);
        bool b = TileTable.get(1, x, y);

        bool result = a != b;

        TileTable.set(0, x, y, result);
        TileTable.set(1, x, y, result);
      }
    }
  }
}
