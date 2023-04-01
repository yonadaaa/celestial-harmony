// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { TileTable } from "../tables/TileTable.sol";

uint256 constant ID = uint256(keccak256("system.Init"));

contract InitSystem is System {
  function init() public {
    for (int32 x = -10; x < 10; x++) {
      for (int32 y = -10; y < 10; y++) {
        TileTable.set(x, y, false);
      }
    }
  }
}
