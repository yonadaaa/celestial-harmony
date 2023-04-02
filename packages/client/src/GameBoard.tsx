import React, { useRef } from "react";
import * as THREE from "three";
import { Canvas, ThreeElements, useLoader, extend } from "@react-three/fiber";
import { useEntityQuery } from "@latticexyz/react";
import { getComponentValueStrict, Has } from "@latticexyz/recs";
import { useMUD } from "./MUDContext";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Clone, Effects } from "@react-three/drei";
import { UnrealBloomPass } from "three-stdlib";

extend({ UnrealBloomPass });

const N_LAYERS = 2;
const WIDTH = 6;
const HEIGHT = 6;

function Tile(
  props: ThreeElements["mesh"] & {
    index: number;
    x: number;
    y: number;
    object: any;
  }
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
    <group>
      {tile && getComponentValueStrict(TileTable, tile).value ? (
        <Clone
          object={props.object}
          position={[props.x, props.index * 5 - 4.5, props.y]}
        />
      ) : null}
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
          <meshStandardMaterial
            color={[1, 1, 4]}
            emissive={[0.1, 0.1, 1]}
            toneMapped={false}
          />
        ) : (
          <meshStandardMaterial color={"red"} />
        )}
      </mesh>
    </group>
  );
}

function Scene() {
  const tile_fire = useLoader(GLTFLoader, "/tile_water.glb");

  return (
    <group>
      <pointLight position={[10, 10, 10]} intensity={1} />

      <group>
        {[...Array(N_LAYERS).keys()].map((index) =>
          [...Array(WIDTH).keys()].map((x) =>
            [...Array(HEIGHT).keys()].map((y) => (
              <Tile
                key={`${x},${y}`}
                object={tile_fire.scene}
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
      <Canvas orthographic camera={{ zoom: 70, position: [-1, 1, -1] }}>
        <color attach="background" args={["#444"]} />
        <Effects disableGamma>
          <unrealBloomPass threshold={0.5} strength={0.01} radius={0.75} />
        </Effects>

        <Scene />
      </Canvas>
    </div>
  );
};
