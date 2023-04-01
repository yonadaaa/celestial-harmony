// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

// Import schema type
import { SchemaType } from "@latticexyz/schema-type/src/solidity/SchemaType.sol";

// Import store internals
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { StoreCore } from "@latticexyz/store/src/StoreCore.sol";
import { Bytes } from "@latticexyz/store/src/Bytes.sol";
import { Memory } from "@latticexyz/store/src/Memory.sol";
import { SliceLib } from "@latticexyz/store/src/Slice.sol";
import { EncodeArray } from "@latticexyz/store/src/tightcoder/EncodeArray.sol";
import { Schema, SchemaLib } from "@latticexyz/store/src/Schema.sol";
import { PackedCounter, PackedCounterLib } from "@latticexyz/store/src/PackedCounter.sol";

uint256 constant _tableId = uint256(bytes32(abi.encodePacked(bytes16(""), bytes16("TileTable"))));
uint256 constant TileTableTableId = _tableId;

library TileTable {
  /** Get the table's schema */
  function getSchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](1);
    _schema[0] = SchemaType.BOOL;

    return SchemaLib.encode(_schema);
  }

  function getKeySchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](3);
    _schema[0] = SchemaType.UINT32;
    _schema[1] = SchemaType.UINT32;
    _schema[2] = SchemaType.UINT32;

    return SchemaLib.encode(_schema);
  }

  /** Get the table's metadata */
  function getMetadata() internal pure returns (string memory, string[] memory) {
    string[] memory _fieldNames = new string[](1);
    _fieldNames[0] = "value";
    return ("TileTable", _fieldNames);
  }

  /** Register the table's schema */
  function registerSchema() internal {
    StoreSwitch.registerSchema(_tableId, getSchema(), getKeySchema());
  }

  /** Register the table's schema (using the specified store) */
  function registerSchema(IStore _store) internal {
    _store.registerSchema(_tableId, getSchema(), getKeySchema());
  }

  /** Set the table's metadata */
  function setMetadata() internal {
    (string memory _tableName, string[] memory _fieldNames) = getMetadata();
    StoreSwitch.setMetadata(_tableId, _tableName, _fieldNames);
  }

  /** Set the table's metadata (using the specified store) */
  function setMetadata(IStore _store) internal {
    (string memory _tableName, string[] memory _fieldNames) = getMetadata();
    _store.setMetadata(_tableId, _tableName, _fieldNames);
  }

  /** Get value */
  function get(uint32 index, uint32 x, uint32 y) internal view returns (bool value) {
    bytes32[] memory _primaryKeys = new bytes32[](3);
    _primaryKeys[0] = bytes32(uint256((index)));
    _primaryKeys[1] = bytes32(uint256((x)));
    _primaryKeys[2] = bytes32(uint256((y)));

    bytes memory _blob = StoreSwitch.getField(_tableId, _primaryKeys, 0);
    return (_toBool(uint8(Bytes.slice1(_blob, 0))));
  }

  /** Get value (using the specified store) */
  function get(IStore _store, uint32 index, uint32 x, uint32 y) internal view returns (bool value) {
    bytes32[] memory _primaryKeys = new bytes32[](3);
    _primaryKeys[0] = bytes32(uint256((index)));
    _primaryKeys[1] = bytes32(uint256((x)));
    _primaryKeys[2] = bytes32(uint256((y)));

    bytes memory _blob = _store.getField(_tableId, _primaryKeys, 0);
    return (_toBool(uint8(Bytes.slice1(_blob, 0))));
  }

  /** Set value */
  function set(uint32 index, uint32 x, uint32 y, bool value) internal {
    bytes32[] memory _primaryKeys = new bytes32[](3);
    _primaryKeys[0] = bytes32(uint256((index)));
    _primaryKeys[1] = bytes32(uint256((x)));
    _primaryKeys[2] = bytes32(uint256((y)));

    StoreSwitch.setField(_tableId, _primaryKeys, 0, abi.encodePacked((value)));
  }

  /** Set value (using the specified store) */
  function set(IStore _store, uint32 index, uint32 x, uint32 y, bool value) internal {
    bytes32[] memory _primaryKeys = new bytes32[](3);
    _primaryKeys[0] = bytes32(uint256((index)));
    _primaryKeys[1] = bytes32(uint256((x)));
    _primaryKeys[2] = bytes32(uint256((y)));

    _store.setField(_tableId, _primaryKeys, 0, abi.encodePacked((value)));
  }

  /** Tightly pack full data using this table's schema */
  function encode(bool value) internal view returns (bytes memory) {
    return abi.encodePacked(value);
  }

  /* Delete all data for given keys */
  function deleteRecord(uint32 index, uint32 x, uint32 y) internal {
    bytes32[] memory _primaryKeys = new bytes32[](3);
    _primaryKeys[0] = bytes32(uint256((index)));
    _primaryKeys[1] = bytes32(uint256((x)));
    _primaryKeys[2] = bytes32(uint256((y)));

    StoreSwitch.deleteRecord(_tableId, _primaryKeys);
  }

  /* Delete all data for given keys (using the specified store) */
  function deleteRecord(IStore _store, uint32 index, uint32 x, uint32 y) internal {
    bytes32[] memory _primaryKeys = new bytes32[](3);
    _primaryKeys[0] = bytes32(uint256((index)));
    _primaryKeys[1] = bytes32(uint256((x)));
    _primaryKeys[2] = bytes32(uint256((y)));

    _store.deleteRecord(_tableId, _primaryKeys);
  }
}

function _toBool(uint8 value) pure returns (bool result) {
  assembly {
    result := value
  }
}
