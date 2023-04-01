import React, { useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, Color, ThreeElements, useThree } from "@react-three/fiber";
import { useEntityQuery } from "@latticexyz/react";
import { getComponentValueStrict, Has } from "@latticexyz/recs";
import { useMUD } from "./MUDContext";

const N_LAYERS = 2;
const WIDTH = 10;
const HEIGHT = 10;

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

function Player(
  props: ThreeElements["mesh"] & { index: number; x: number; y: number }
) {
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

    return i === props.index && xT === props.x && yT === props.y;
  });

  const ref = useRef<THREE.Mesh>(null!);
  return (
    <mesh
      onClick={async (event) => {
        event.stopPropagation();
        // Create a World contract instance
        const s = signer.get();
        if (!s) throw new Error("No signer");

        const txResult = await worldSend("flip", [
          props.index,
          props.x,
          props.y,
          tile ? !getComponentValueStrict(TileTable, tile).value : true,
        ]);
        await txResult.wait();
      }}
      {...props}
      ref={ref}
    >
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      {tile && getComponentValueStrict(TileTable, tile).value ? (
        <meshStandardMaterial color={"blue"} />
      ) : (
        <meshStandardMaterial color={"red"} />
      )}
    </mesh>
  );
}

function Scene() {
  const {} = useMUD();

  return (
    <group>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <group>
        {[...Array(N_LAYERS).keys()].map((index) =>
          [...Array(WIDTH).keys()].map((x) =>
            [...Array(HEIGHT).keys()].map((y) => (
              <Player
                key={`${x},${y}`}
                position={[x, index * 5 - 5, y]}
                x={x}
                y={y}
                index={index}
              />
            ))
          )
        )}
      </group>
    </group>
  );
}

export const GameBoard = () => {
  const {
    worldSend,
    network: { signer },
  } = useMUD();

  return (
    <div style={{ height: "100vh" }}>
      <button
        onClick={async () => {
          // Create a World contract instance
          const s = signer.get();
          if (!s) throw new Error("No signer");

          const txResult = await worldSend("forward", []);
          await txResult.wait();
        }}
      >
        HARVEST
      </button>
      <Canvas orthographic camera={{ zoom: 40, position: [-1, 1, -1] }}>
        <Scene />
      </Canvas>
    </div>
  );
};
