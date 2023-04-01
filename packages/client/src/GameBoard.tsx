import React from "react";
import { useEntityQuery } from "@latticexyz/react";
import { getComponentValueStrict, Has } from "@latticexyz/recs";
import { useMUD } from "./MUDContext";

const Tile = ({ index, x, y }: { index: number; x: number; y: number }) => {
  const {
    world,
    worldSend,
    components: { TileTable },
    network: { signer },
  } = useMUD();

  const tiles = useEntityQuery([Has(TileTable)]);

  const tile = tiles.find((t) => {
    const arr = world.entities[t].split(":");
    const i = parseInt(arr[0]);
    const xT = parseInt(arr[1]);
    const yT = parseInt(arr[2]);

    return i === index && xT === x && yT === y;
  });

  return (
    <td
      onClick={async () => {
        // Create a World contract instance
        const s = signer.get();
        if (!s) throw new Error("No signer");

        const txResult = await worldSend("flip", [
          index,
          x,
          y,
          tile ? !getComponentValueStrict(TileTable, tile).value : true,
        ]);
        await txResult.wait();
      }}
      style={{
        border: 2,
        borderColor: "black",
        borderStyle: "solid",
        width: "50px",
        height: "50px",
        backgroundColor:
          tile && getComponentValueStrict(TileTable, tile).value
            ? "black"
            : "white",
      }}
    />
  );
};

export const GameBoard = () => {
  const {
    worldSend,
    network: { signer },
  } = useMUD();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex" }}>
        {[0, 1].map((i) => (
          <div style={{ margin: 10 }}>
            <div>Layer {i}</div>
            <table key={`${i}`}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((x) => (
                <tr>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((y) => (
                    <Tile key={`${x},${y}`} index={i} x={x} y={y} />
                  ))}
                </tr>
              ))}
            </table>
          </div>
        ))}
      </div>
      <button
        onClick={async () => {
          // Create a World contract instance
          const s = signer.get();
          if (!s) throw new Error("No signer");

          const txResult = await worldSend("forward", []);
          await txResult.wait();
        }}
      >
        forward
      </button>
    </div>
  );
};
