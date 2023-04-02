import React, { useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, ThreeElements, useLoader, extend } from "@react-three/fiber";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { getComponentValueStrict, Has, hasComponent } from "@latticexyz/recs";
import { useMUD } from "./MUDContext";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Clone, Effects, Text } from "@react-three/drei";
import { UnrealBloomPass } from "three-stdlib";
import { Object3D } from "three";

extend({ UnrealBloomPass });

const N_LAYERS = 2;
const WIDTH = 6;
const HEIGHT = 6;

function Tile(
  props: ThreeElements["mesh"] & {
    index: number;
    x: number;
    y: number;
    objects: Object3D[];
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
      {tile && hasComponent(TileTable, tile) ? (
        <Clone
          object={
            props.objects[getComponentValueStrict(TileTable, tile).value].scene
          }
          position={[props.x, 0.125, props.y]}
          scale={[0.9, 0.9, 0.9]}
        />
      ) : null}
      <mesh
        onClick={async (event) => {
          if (tile) {
            event.stopPropagation();
            // Create a World contract instance
            const s = signer.get();
            if (!s) throw new Error("No signer");

            const value = getComponentValueStrict(TileTable, tile).value;

            const txResult = await worldSend("set", [
              props.index,
              props.x,
              props.y,
              value === 0 ? 1 : value === 1 ? 2 : 0,
            ]);
            await txResult.wait();
          }
        }}
        {...props}
        ref={ref}
      >
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        {tile && getComponentValueStrict(TileTable, tile).value === 1 ? (
          <meshStandardMaterial
            color={[1, 1, 4]}
            emissive={[0.1, 0.1, 1]}
            toneMapped={false}
          />
        ) : (
          <meshStandardMaterial color={props.index === 0 ? "cyan" : "red"} />
        )}
      </mesh>
    </group>
  );
}

const Info = ({ index }: { index: number }) => {
  const {
    world,
    components: { BudgetTable, ScoreTable },
  } = useMUD();

  const arr = world.entityToIndex.get(`0x0${index}`);
  const budget = useComponentValue(BudgetTable, arr);
  const score = useComponentValue(ScoreTable, arr);

  return (
    <div className={`layer${index}`}>
      <div>Layer: {index}</div>
      <div>BUDGET: {budget ? budget.value : 0}</div>
      <div>SCORE: {score ? score.value : 0}</div>
    </div>
  );
};

const Timestamp = () => {
  const {
    components: { TimestampTable },
    singletonEntity,
  } = useMUD();

  const timestamp = useComponentValue(TimestampTable, singletonEntity);

  return (
    <div className="timestamp">
      <span>Last Prayer:</span>
      {timestamp
        ? new Date(parseInt(timestamp?.value) * 1000).toLocaleTimeString()
        : 0}
    </div>
  );
};

function Scene({ view }: { view: number }) {
  const tile_base = useLoader(GLTFLoader, "/tile_base.glb");
  const tile_fire = useLoader(GLTFLoader, "/tile_fire.glb");
  const tile_water = useLoader(GLTFLoader, "/tile_water.glb");
  const background = useLoader(GLTFLoader, "/background_earth.glb");

  const objects = [tile_base, tile_fire, tile_water];
  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />'{" "}
      <primitive object={background.scene} position={[2, 0, 2]} />
      <group>
        {[...Array(N_LAYERS).keys()].map((index) => (
          <group
            key={index}
            position={[
              0,
              view === 0
                ? -index * 5
                : view === 1 && index != 0
                ? 1000
                : view === 2 && index != 1
                ? 1000
                : -2,
              0,
            ]}
          >
            {[...Array(WIDTH).keys()].map((x) =>
              [...Array(HEIGHT).keys()].map((y) => (
                <Tile
                  key={`${x},${y}`}
                  objects={objects}
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
    worldSend,
    network: { signer },
  } = useMUD();

  const [view, setView] = useState(0);

  return (
    <div style={{ height: "100vh" }}>
      <Canvas orthographic camera={{ zoom: 70, position: [-1, 1, -1] }}>
        <color attach="background" args={["#444"]} />

        <Effects disableGamma>
          {/* <unrealBloomPass threshold={0.5} strength={0.2} radius={0.75} /> */}
        </Effects>

        <Scene view={view} />
      </Canvas>
      <div className="parent">
        <button
          className="prayer_button"
          onClick={async () => {
            // Create a World contract instance
            const s = signer.get();
            if (!s) throw new Error("No signer");

            const txResult = await worldSend("forward", []);
            await txResult.wait();
          }}
        >
          PRAY
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
        {[0, 1].map((i) => (
          <Info index={i} />
        ))}
        <Timestamp />
      </div>
    </div>
  );
};
