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
                      : props.mode === 'fast' 
                      ? "status__action-fast-mode"
                      : "status__action-lock-mode"}>
      <label className={ props.mode === 'mistakes'
                          ? "status__action-mistakes-mode-switch"
                          : props.mode === 'fast' 
                          ? "status__action-fast-mode-switch"
                          : "status__action-lock-mode-switch"}>
        <input type="checkbox" />
        <span className={ props.mode === 'mistakes'
                            ? "status__action-mistakes-mode-slider"
                            : props.mode === 'fast' 
                            ? "status__action-fast-mode-slider"
                            : "status__action-lock-mode-slider" }
              onClick={props.onClickMode}
        ></span>
      </label>
      <p className="status__action-text">{ props.mode === 'mistakes'
                  ? 'Mistakes Mode'
                  : props.mode === 'fast' 
                  ? 'Fast Mode'
                  : 'Lock' }</p>
    </div>
  )
}
