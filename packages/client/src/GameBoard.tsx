import React from "react";
import { useEntityQuery } from "@latticexyz/react";
import { getComponentValueStrict, Has } from "@latticexyz/recs";
import { useMUD } from "./MUDContext";

const Tile = ({ x, y }: { x: number; y: number }) => {
  const {
    world,
    worldSend,
    components: { TileTable },
    network: { signer },
  } = useMUD();

  const tiles = useEntityQuery([Has(TileTable)]);

  const tile = tiles.find((t) => {
    const arr = world.entities[t].split(":");
    const xT = parseInt(arr[0]);
    const yT = parseInt(arr[1]);

    return xT === x && yT === y;
  });

  return (
    <div
      onClick={async () => {
        // Create a World contract instance
        const s = signer.get();
        if (!s) throw new Error("No signer");

        const txResult = await worldSend("flip", [
          x,
          y,
          tile ? !getComponentValueStrict(TileTable, tile).value : true,
        ]);
        await txResult.wait();
      }}
      style={{
        position: "fixed",
        left: x * 100,
        top: y * 100,
        border: 2,
        borderColor: "gray",
        borderStyle: "solid",
        width: "100px",
        height: "100px",
      }}
    >
      {tile ? (
        <div
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: getComponentValueStrict(TileTable, tile).value
              ? "black"
              : "white",
          }}
        ></div>
      ) : (
        <div
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: "white",
          }}
        ></div>
      )}
    </div>
  );
};

export const GameBoard = () => {
  return (
    <div>
      <div>
        {[0, 1, 2, 3, 4, 5].map((x) =>
          [0, 1, 2, 3, 4, 5].map((y) => <Tile key={`${x}-{y}`} x={x} y={y} />)
        )}
      </div>
    </div>
  );
};
