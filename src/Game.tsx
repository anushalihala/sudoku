import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Header } from './components/layout/Header';
import { GameSection } from './components/layout/GameSection';
import { StatusSection } from './components/layout/StatusSection';
import { Footer } from './components/layout/Footer';
import { getBlankSudoku } from './solver/BlankSudoku';
import { useSudokuContext } from './context/SudokuContext';
import { sudokuSolver } from './solver/sudokuSolver';

/**
 * Game is the main React component.
 */
export const Game: React.FC<{}> = () => {
  /**
   * All the variables for holding state:
   * gameArray: Holds the current state of the game.
   * initArray: Holds the initial state of the game.
   * solvedArray: Holds the solved position of the game.
   * difficulty: Difficulty level - 'Easy', 'Medium' or 'Hard'
   * numberSelected: The Number selected in the Status section.
   * timeGameStarted: Time the current game was started.
   * mistakesMode: Is Mistakes allowed or not?
   * fastMode: Is Fast Mode enabled?
   * cellSelected: If a game cell is selected by the user, holds the index.
   * history: history of the current game, for 'Undo' purposes.
   * overlay: Is the 'Game Solved' overlay enabled?
   * won: Is the game 'won'?
   */
  let { numberSelected, setNumberSelected,
        gameArray, setGameArray,
        difficulty, setDifficulty,
        setTimeGameStarted,
        fastMode, setFastMode,
        cellSelected, setCellSelected,
        initArray, setInitArray,
        setWon, 
        obtainedSolution, setObtainedSolution,
        lockMode, setLockMode } = useSudokuContext();
  let [ mistakesMode, setMistakesMode ] = useState<boolean>(false);
  let [ history, setHistory ] = useState<string[][]>([]);
  let [ solvedArray, setSolvedArray ] = useState<string[]>([]);
  let [ overlay, setOverlay ] = useState<boolean>(false);

  /**
   * Creates a new game and initializes the state variables.
   */
  function _createNewGame(e?: React.ChangeEvent<HTMLSelectElement>) {
    // let [ temporaryInitArray, temporarySolvedArray ] = getUniqueSudoku(difficulty, e);
    let temporaryInitArray = getBlankSudoku()
    
    setInitArray(temporaryInitArray);
    setGameArray(temporaryInitArray); 
    // setSolvedArray(temporarySolvedArray); //TODO: Set later
    setNumberSelected('0');
    setTimeGameStarted(moment());
    setCellSelected(-1);
    setHistory([]);
    setWon(false);
  }

  /**
   * Checks if the game is solved.
   */
  function _isSolved(index: number, value: string) {
    if (gameArray.every((cell: string, cellIndex: number) => {
          if (cellIndex === index)
            return value === solvedArray[cellIndex];
          else
            return cell === solvedArray[cellIndex];
        })) {
      return true;
    }
    return false;
  }

  /**
   * Fills the cell with the given 'value'
   * Used to Fill / Erase as required.
   */
  function _fillCell(index: number, value: string) {
    console.log("lockMode",lockMode) // test logs
    if (initArray[index] === '0') {
      // Direct copy results in interesting set of problems, investigate more!
    
      if(!lockMode){
      // Can't use tempArray here, due to Side effect below!!
        console.log("Filling gameArray | Lock mode =", lockMode)
        let tempArray = gameArray.slice();
        let tempHistory = history.slice();

        tempHistory.push(gameArray.slice());
        setHistory(tempHistory);

        tempArray[index] = value;
        setGameArray(tempArray);
      }
      else{
        console.log("Filling initArray | Lock mode =", lockMode)
        let tempInitArray = initArray.slice()
        let tempGameArray = gameArray.slice()

        tempInitArray[index] = value;
        setInitArray(tempInitArray)
        tempGameArray[index] = value;
        setGameArray(tempGameArray)
      }

      if (obtainedSolution && _isSolved(index, value)) {
        setOverlay(true);
        setWon(true);
      }
    }
  }

  /**
   * A 'user fill' will be passed on to the
   * _fillCell function above.
   */
  function _userFillCell(index: number, value: string) {
    if (mistakesMode && obtainedSolution) {
      if (value === solvedArray[index]) {
        _fillCell(index, value);
      }
      else {
        // TODO: Flash - Mistakes not allowed in Mistakes Mode
      }
    } else {
      _fillCell(index, value);
    }
  }

  /**
   * On Click of 'New Game' link,
   * create a new game.
   */
  function onClickNewGame() {
    _createNewGame();
  }

  /**
   * On Click of a Game cell.
   */
  function onClickCell(indexOfArray: number) {
    if (fastMode && numberSelected !== '0') {
      _userFillCell(indexOfArray, numberSelected);
    }
    setCellSelected(indexOfArray);
  }

  /**
   * On Change Difficulty,
   * 1. Update 'Difficulty' level
   * 2. Create New Game
   */
  // function onChangeDifficulty(e: React.ChangeEvent<HTMLSelectElement>) {
  //   setDifficulty(e.target.value);
  //   _createNewGame(e);
  // }

  /*
  * Pass gameArray and solveValue to python Sudoku Solver using AJAX
  * Set returned value as gameArray
  */
  function onClickSolve() {
    let solverArray = []
    let solverArrayRow = []
    for(var counter = 0; counter < 81; counter++){
      if( counter % 9 === 0 && counter !== 0){
        solverArray.push(solverArrayRow)
        solverArrayRow = []
      }          
      let cellNumber = parseInt(gameArray[counter])
      let cellValue = cellNumber === 0 ? null : cellNumber
      solverArrayRow.push(cellValue)
    }
    solverArray.push(solverArrayRow)
    // console.log(solverArray)
    let sudokuResult = sudokuSolver(solverArray)
    // console.log(sudokuResult)
    sudokuResult = sudokuResult.flat()
    sudokuResult = sudokuResult.map( (item: any) => String(item))
    // console.log(sudokuResult)
    setGameArray(sudokuResult)
  }

  /**
   * On Click of Number in Status section,
   * either fill cell or set the number.
   */
  function onClickNumber(number: string) {
    if (fastMode) {
      setNumberSelected(number)
    } else if (cellSelected !== -1) {
      _userFillCell(cellSelected,number);
    }
  }

  /**
   * On Click Undo,
   * try to Undo the latest change.
   */
  function onClickUndo() {
    if(history.length) {
      let tempHistory = history.slice();
      let tempArray = tempHistory.pop();
      setHistory(tempHistory);
      if (tempArray !== undefined)
        setGameArray(tempArray);
    }
  }

  /**
   * On Click Erase,
   * try to delete the cell.
   */
  function onClickErase() {
    if(cellSelected !== -1 && gameArray[cellSelected] !== '0') {
      _fillCell(cellSelected, '0');
    }
  }

  /**
   * On Click Hint,
   * fill the selected cell if its empty or wrong number is filled.
   */
  function onClickHint() {
    if (cellSelected !== -1 && obtainedSolution) {
      _fillCell(cellSelected, solvedArray[cellSelected]);
    }
  }

  /**
   * Toggle Mistakes Mode
   */
  function  onClickMistakesMode() {
    setMistakesMode(!mistakesMode);
  }

  /**
   * Toggle Fast Mode
   */
  function onClickFastMode() {
    if (fastMode) {
      setNumberSelected('0');
    }
    setCellSelected(-1);
    setFastMode(!fastMode);
  }

  /**
   * Toggle Game Lock
   */
   function onClickLockMode() {
    setLockMode(!lockMode)
  }

  /**
   * Close the overlay on Click.
   */
  function onClickOverlay() {
    setOverlay(false);
    _createNewGame();
  }

  /**
   * On load, create a New Game.
   */
  useEffect(() => {
    _createNewGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={overlay?"container blur":"container"}>
        <Header onClick={onClickNewGame} onClickLockMode={onClickLockMode}/>
        <div className="innercontainer">
          <GameSection
            onClick={(indexOfArray: number) => onClickCell(indexOfArray)}
          />
          <StatusSection
            onClickNumber={(number: string) => onClickNumber(number)}
            onClickUndo={onClickUndo}
            onClickErase={onClickErase}
            onClickHint={onClickHint}
            onClickMistakesMode={onClickMistakesMode}
            onClickFastMode={onClickFastMode}
            onClickSolve={onClickSolve}
          />
        </div>
        <Footer />
      </div>
      <div className= { overlay
                        ? "overlay overlay--visible"
                        : "overlay"
                      }
           onClick={onClickOverlay}
      >
        <h2 className="overlay__text">
          You <span className="overlay__textspan1">solved</span> <span className="overlay__textspan2">it!</span>
        </h2>
      </div>
    </>
  );
}
