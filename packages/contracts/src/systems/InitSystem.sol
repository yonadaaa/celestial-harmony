// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { BudgetTable } from "../tables/BudgetTable.sol";
import { TileTable } from "../tables/TileTable.sol";

uint256 constant ID = uint256(keccak256("system.Init"));

uint256 constant N_LAYERS = 2;
uint256 constant WIDTH = 6;

contract InitSystem is System {
  function init() public {
    for (uint32 i = 0; i < N_LAYERS; i++) {
      for (uint32 x = 0; x < WIDTH; x++) {
        for (uint32 y = 0; y < WIDTH; y++) {
          BudgetTable.set(i, 1);
          TileTable.set(i, x, y, 0);
        }
      }
    }
  }
}
