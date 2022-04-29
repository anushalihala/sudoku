import React from 'react';
import { useSudokuContext } from '../context/SudokuContext';

type ModeProps = {
  mode: string,
  onClickMode: () => void
};

/**
 * React component for the Mistakes Mode / Fast Mode
 * elements in the Status Section.
 */
export const Mode = (props: ModeProps) => {
  const sudokuContext = useSudokuContext();
  let isDisabled = props.mode == "mistakes" && !sudokuContext.obtainedSolution
  return (
    <div style={isDisabled ? {pointerEvents: "none", opacity: "0.4"} : {}} className={ props.mode === 'mistakes'
                      ? "status__action-mistakes-mode"
                      : "status__action-fast-mode"}>
      <label className={ props.mode === 'mistakes'
                          ? "status__action-mistakes-mode-switch"
                          : "status__action-fast-mode-switch"}>
        <input type="checkbox" />
        <span className={ props.mode === 'mistakes'
                            ? "status__action-mistakes-mode-slider"
                            : "status__action-fast-mode-slider"}
              onClick={props.onClickMode}
        ></span>
      </label>
      <p className="status__action-text">{ props.mode === 'mistakes'
                  ? 'Mistakes Mode'
                  : 'Fast Mode'}</p>
    </div>
  )
}
