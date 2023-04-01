// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { TileTable } from "../tables/TileTable.sol";

uint256 constant ID = uint256(keccak256("system.Flip"));

contract FlipSystem is System {
  function flip(int32 x, int32 y, bool value) public {
    TileTable.set(x, y, value);
  }
}
