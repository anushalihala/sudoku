import React from 'react';
import { Timer } from '../Timer';
import { Numbers } from '../Numbers';
import { Action } from '../Action';
import { Mode } from '../Mode';
import { useSudokuContext } from '../../context/SudokuContext';

type StatusSectionProps = {
  onClickNumber: (number: string) => void,
  onClickUndo: () => void,
  onClickErase: () => void,
  onClickHint: () => void,
  onClickMistakesMode: () => void,
  onClickFastMode: () => void,
  onClickSolve: () => void
};

/**
 * React component for the Status Section.
 */
export const StatusSection = (props: StatusSectionProps) => {
  let sudokuContext = useSudokuContext()
  let obtainedSolution = sudokuContext.obtainedSolution

  return (
    <section className="status">
      <button className="solve" onClick={props.onClickSolve}>
        {obtainedSolution ? "Fill" : "Solve"}
      </button> 
      <Timer />
      <Numbers onClickNumber={(number) => props.onClickNumber(number)} />
      <div className="status__actions">
        <Action action='undo' onClickAction={props.onClickUndo} />
        <Action action='erase' onClickAction={props.onClickErase} />
        <Action action='hint' onClickAction={props.onClickHint} />
        <Mode mode='mistakes' onClickMode={props.onClickMistakesMode} />
        <Mode mode='fast' onClickMode={props.onClickFastMode} />
      </div>
    </section>
  )
}
