// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { BudgetTable } from "../tables/BudgetTable.sol";
import { TileTable } from "../tables/TileTable.sol";

uint256 constant ID = uint256(keccak256("system.Set"));

contract SetSystem is System {
  function set(uint32 index, uint32 x, uint32 y, uint8 value) public {
    if (value == 0) {
      BudgetTable.set(index, BudgetTable.get(index) + 1);
    } else {
      BudgetTable.set(index, BudgetTable.get(index) - 1);
    }
    TileTable.set(index, x, y, value);
  }
}
