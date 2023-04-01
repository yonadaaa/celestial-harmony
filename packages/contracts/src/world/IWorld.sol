// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

import { IStore } from "@latticexyz/store/src/IStore.sol";

import { IWorldCore } from "@latticexyz/world/src/interfaces/IWorldCore.sol";

import { IFlipSystem } from "./IFlipSystem.sol";
import { IForwardSystem } from "./IForwardSystem.sol";
import { IInitSystem } from "./IInitSystem.sol";

/**
 * The IWorld interface includes all systems dynamically added to the World
 * during the deploy process.
 */
interface IWorld is IStore, IWorldCore, IFlipSystem, IForwardSystem, IInitSystem {

}
