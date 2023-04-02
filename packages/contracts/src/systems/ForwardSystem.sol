// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { BudgetTable } from "../tables/BudgetTable.sol";
import { ScoreTable } from "../tables/ScoreTable.sol";
import { TimestampTable } from "../tables/TimestampTable.sol";
import { TileTable } from "../tables/TileTable.sol";
import { N_LAYERS, WIDTH } from "./InitSystem.sol";

uint256 constant ID = uint256(keccak256("system.Forward"));
uint256 constant INTERVAL = 10;
bytes32 constant SINGLETON_KEY = bytes32(uint256(0x060D));

contract ForwardSystem is System {
  function forward() public {
    require(block.timestamp > TimestampTable.get(SINGLETON_KEY) + INTERVAL, "not enough time passed");
    TimestampTable.set(SINGLETON_KEY, block.timestamp);

    for (uint32 x = 0; x < WIDTH; x++) {
      for (uint32 y = 0; y < WIDTH; y++) {
        uint8 tile0 = TileTable.get(0, x, y);
        uint8 tile1 = TileTable.get(1, x, y);

        if (tile0 > tile1) {
          uint8 value = TileTable.get(1, x, y);
          if (value == 0) {
            TileTable.set(1, x, y, 0);
          } else {
            TileTable.set(1, x, y, value - 1);
            ScoreTable.set(1, ScoreTable.get(1) + 1);
          }
          ScoreTable.set(0, ScoreTable.get(0) + 1);
        } else if (tile1 > tile0) {
          uint8 value = TileTable.get(0, x, y);
          if (value == 0) {
            TileTable.set(0, x, y, 0);
          } else {
            TileTable.set(0, x, y, value - 1);
            ScoreTable.set(1, ScoreTable.get(1) + 1);
          }
        }
      }
    }

    for (uint32 i = 0; i < N_LAYERS; i++) {
      BudgetTable.set(i, 4);
    }
  }
}
