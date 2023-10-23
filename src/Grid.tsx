import {useEffect, useState} from 'react';
import {GridCell} from './GridCell';

interface GridProps {
  gridHeight: number;
  gridWidth: number;
}

interface GridState {
  gridCells: boolean[][];
  isRunning: boolean;
}

export function Grid({gridHeight, gridWidth}: GridProps) {
  const defaultGridState: GridState = {
    isRunning: false,
    gridCells: Array.from<boolean[]>({length: gridHeight}).fill(
      Array.from<boolean>({length: gridWidth}).fill(false)
    ),
  };
  const [gridState, setGridState] = useState<GridState>(defaultGridState);

  const [stepCount, setStepCount] = useState<number>(0);

  useEffect(() => {
    setGridState(defaultGridState);
  }, [gridHeight, gridWidth]);

  useEffect(() => {
    if (gridState.isRunning) {
      const interval = setInterval(() => {
        setGridState((prevState) => {
          return {
            ...prevState,
            gridCells: calculateNewGridCellValues(prevState),
          };
        });
        setStepCount((prevState) => prevState + 1);
      }, 200);

      return () => clearInterval(interval);
    }
  }, [gridState]);

  function changeCellState(gridX: number, gridY: number, newValue: boolean) {
    setGridState((prevState) => {
      const newState: GridState = {
        ...prevState,
        gridCells: prevState.gridCells.map((row, y) => {
          return row.map((value, x) => {
            if (gridX == x && gridY == y) {
              return newValue;
            } else {
              return value;
            }
          });
        }),
      };
      return newState;
    });
  }

  function getNumberOfLivingCellsAround(x: number, y: number): number {
    // get the 8 cells around the current cell and return a number of cells which are set to true
    const cellsAround: boolean[] = [];
    const cellAbove = gridState.gridCells[x - 1]?.[y];
    const cellBelow = gridState.gridCells[x + 1]?.[y];
    const cellLeft = gridState.gridCells[x]?.[y - 1];
    const cellRight = gridState.gridCells[x]?.[y + 1];
    const cellAboveLeft = gridState.gridCells[x - 1]?.[y - 1];
    const cellAboveRight = gridState.gridCells[x - 1]?.[y + 1];
    const cellBelowLeft = gridState.gridCells[x + 1]?.[y - 1];
    const cellBelowRight = gridState.gridCells[x + 1]?.[y + 1];

    if (cellAboveLeft) {
      cellsAround.push(cellAboveLeft);
    }
    if (cellAbove) {
      cellsAround.push(cellAbove);
    }
    if (cellAboveRight) {
      cellsAround.push(cellAboveRight);
    }
    if (cellLeft) {
      cellsAround.push(cellLeft);
    }
    if (cellRight) {
      cellsAround.push(cellRight);
    }
    if (cellBelowLeft) {
      cellsAround.push(cellBelowLeft);
    }
    if (cellBelow) {
      cellsAround.push(cellBelow);
    }
    if (cellBelowRight) {
      cellsAround.push(cellBelowRight);
    }

    return cellsAround.filter((cell) => cell == true).length;
  }

  function calculateNewGridCellValues(prevState: GridState): boolean[][] {
    return prevState.gridCells.map((row, y) => {
      return row.map((value, x) => {
        const neighborsAlive = getNumberOfLivingCellsAround(y, x);
        switch (true) {
          case value == true && neighborsAlive < 2:
            return false;
          case value == true && (neighborsAlive == 2 || neighborsAlive == 3):
            return true;
          case value == true && neighborsAlive > 3:
            return false;
          case value == false && neighborsAlive == 3:
            return true;
          default:
            return value;
        }
      });
    });
  }

  return (
    <div className="border-collapse">
      <div>
        <p>Current step: {stepCount}</p>
      </div>
      <button
        className="border border-black p-2 m-2"
        onClick={() => {
          setGridState((prevState) => {
            return {
              ...prevState,
              isRunning: !prevState.isRunning,
            };
          });
        }}
      >
        {gridState.isRunning ? 'Stop' : 'Start'}
      </button>
      <button
        className="border border-black p-2 m-2"
        onClick={() => {
          setGridState((prevState) => {
            const newCells = calculateNewGridCellValues(prevState);
            return {
              ...prevState,
              gridCells: newCells,
            };
          });
          setStepCount((prevState) => prevState + 1);
        }}
      >
        Next step
      </button>
      <button
        className="border border-black p-2 m-2"
        onClick={() => {
          setStepCount(0);
          setGridState(defaultGridState);
        }}
      >
        Reset
      </button>
      {gridState.gridCells.map((row, y) => (
        <div key={y} className="flex">
          {row.map((value, x) => (
            <GridCell
              key={`${x}${y}`}
              x={x}
              y={y}
              value={value}
              changeValue={changeCellState}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
