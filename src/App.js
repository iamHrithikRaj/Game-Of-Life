import "./App.css";
import produce from "immer";
import React, { useCallback, useState, useRef } from "react";

const numRows = 36;
const numCols = 96;

const operations = [
  [0, 1],
  [0, 1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

function App() {
  // eslint-disable-next-line
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;
  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; ++j) {
            //TODO
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              //checking the bounds
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ];
              }
            });
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);
  }, []);

  return (
    <div className="App">
      <link
        href="https://fonts.googleapis.com/css2?family=Italianno&display=swap"
        rel="stylesheet"
      ></link>
      <h1 style={{ "font-family": "Italianno", fontSize: "80px","margin": '10px'}}>
        Game Of Life
      </h1>
      <button
        onClick={() => {
          setRunning(!running);
          runningRef.current = true;
          runSimulation();
        }}
      >
        {running ? "Stop" : "Start"}
      </button>
      <button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}
      >
        Clear
      </button>
      <button
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => Math.random() > .8 ? 1 : 0));
          }
          setGrid(rows);
        }}
      >
        Random
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][j] = gridCopy[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                background: grid[i][j]
                  ? "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)"
                  : "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
                border: "solid 0.5px #333",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
