import React from 'react';
import { useSudokuContext } from '../context/SudokuContext';

type SolveMethodProps = {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
};

/**
 * React component for the Difficulty Selector.
 */
export const SolveMethod = (props: SolveMethodProps) => {
  let context = useSudokuContext();
  let dummyValues = ["BFS", "DFS", "ASTAR"]
  return (
    <div className="status__difficulty">
      <span className="status__difficulty-text">Solve Using:&nbsp;&nbsp;</span>
      <select name="status__difficulty-select" className="status__difficulty-select" defaultValue={dummyValues[0]} onChange={props.onChange}>
        {dummyValues.map( sm => <option value={sm}>{sm}</option>)}
      </select>
    </div>
  )
}
