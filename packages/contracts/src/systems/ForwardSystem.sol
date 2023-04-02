// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { BudgetTable } from "../tables/BudgetTable.sol";
import { TileTable } from "../tables/TileTable.sol";
import { N_LAYERS, WIDTH } from "./InitSystem.sol";

uint256 constant ID = uint256(keccak256("system.Forward"));

contract ForwardSystem is System {
  function forward() public {
    uint32 counter = 0;

    for (uint32 x = 0; x < WIDTH; x++) {
      for (uint32 y = 0; y < WIDTH; y++) {
        uint8 a = TileTable.get(0, x, y);
        uint8 b = TileTable.get(1, x, y);

        bool result = a != b;

        if (result) {
          counter++;
        }

        for (uint32 i = 0; i < N_LAYERS; i++) {
          TileTable.set(i, x, y, result ? 1 : 0);
        }
      }
    }

    for (uint32 i = 0; i < N_LAYERS; i++) {
      uint32 sum = BudgetTable.get(i) + counter;

      if (sum > 0) {
        BudgetTable.set(i, sum);
      } else {
        BudgetTable.set(i, 1);
      }
    }
  }
}
