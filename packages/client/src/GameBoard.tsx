import React, { useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, ThreeElements, useLoader, extend } from "@react-three/fiber";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { getComponentValueStrict, Has } from "@latticexyz/recs";
import { useMUD } from "./MUDContext";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Clone, Effects, Text } from "@react-three/drei";
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
          position={[props.x, 0.125, props.y]}
          scale={[0.9, 0.9, 0.9]}
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

const Budget = ({ index }: { index: number }) => {
  const {
    world,
    components: { BudgetTable },
  } = useMUD();

  const arr = world.entityToIndex.get(`0x0${index}`);
  const budget = useComponentValue(BudgetTable, arr);

  return (
    <Text
      position={[3, 0, 6]}
      scale={[1, 1, 1]}
      color="white"
      rotation={[0, Math.PI, 0]}
    >
      BUDGET: {budget?.value}
    </Text>
  );
};
function Scene({ view }: { view: number }) {
  const tile_fire = useLoader(GLTFLoader, "/tile_water.glb");

  return (
    <group>
      <pointLight position={[10, 10, 10]} intensity={1} />

      <group>
        {[...Array(N_LAYERS).keys()].map((index) => (
          <group
            visible={
              view === 0
                ? true
                : view === 1 && index === 0
                ? true
                : view === 2 && index === 1
                ? true
                : false
            }
            position={[0, view === 0 ? -index * 5 + 0.375 : -2, 0]}
          >
            <Budget index={index} />
            {[...Array(WIDTH).keys()].map((x) =>
              [...Array(HEIGHT).keys()].map((y) => (
                <Tile
                  key={`${x},${y}`}
                  object={tile_fire.scene}
                  position={[x, 0, y]}
                  x={x}
                  y={y}
                  index={index}
                  scale={[1, 0.25, 1]}
                />
              ))
            )}
          </group>
        ))}
      </group>
    </group>
  );
}

export const GameBoard = () => {
  const {
    world,
    worldSend,
    components: { BudgetTable },
    network: { signer },
  } = useMUD();

  const [view, setView] = useState(0);

  return (
    <div style={{ height: "100vh" }}>
      <Canvas orthographic camera={{ zoom: 70, position: [-1, 1, -1] }}>
        <color attach="background" args={["#444"]} />

        <Effects disableGamma>
          <unrealBloomPass threshold={0.5} strength={0.01} radius={0.75} />
        </Effects>

        <Scene view={view} />
      </Canvas>
      <div style={{ position: "absolute", left: 0, top: 0 }}>
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
        <button
          onClick={async () => {
            setView(0);
          }}
        >
          GOD
        </button>
        <button
          onClick={async () => {
            setView(1);
          }}
        >
          LAYER 0
        </button>
        <button
          onClick={async () => {
            setView(2);
          }}
        >
          LAYER 1
        </button>
      </div>
    </div>
  );
};
