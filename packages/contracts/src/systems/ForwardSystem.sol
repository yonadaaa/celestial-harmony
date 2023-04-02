// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { BudgetTable } from "../tables/BudgetTable.sol";
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
        uint8 a = TileTable.get(0, x, y);
        uint8 b = TileTable.get(1, x, y);

        bool result = a != b;

        for (uint32 i = 0; i < N_LAYERS; i++) {
          TileTable.set(i, x, y, result ? 1 : 0);
        }
      }
    }

    for (uint32 i = 0; i < N_LAYERS; i++) {
      BudgetTable.set(i, 5);
    }
  }
}
