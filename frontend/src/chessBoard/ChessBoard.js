import React, { useReducer, useEffect } from 'react';

import Files from "./components/Files";
import Ranks from "./components/Ranks";
import Pieces from "./components/Pieces";
import PromotionPopUp from "./components/PromotionPopUp";
import EndGamePopUp from "./components/EndGamePopUp";
import BoardSideBar from "./components/BoardSideBar";

import ChessBoardContext from "../contexts/ChessBoardContext";
import { ChessBoardReducer } from '../contexts/ChessBoardReducer';
import { getKingPosition } from './getMoves';

import validator from './validator';

import "./ChessBoard.css";

export const GameStatus = {
  ongoing: 'ongoing',
  promoting: 'promoting',
  whiteWins: 'whiteWins',
  blackWins: 'blackWins',
  stalemate: 'stalemate',
  insufficientMaterial: 'insufficientMaterial',
}

const randomPlayerColor = () => {
  return Math.random() < 0.5 ? 'w' : 'b';
}

const humanColour = randomPlayerColor();
const computerColour = humanColour === 'w' ? 'b' : 'w';

const initialPosition = [
  ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
  ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
  ['',  '',  '',  '',  '',  '',  '',  ''],
  ['',  '',  '',  '',  '',  '',  '',  ''],
  ['',  '',  '',  '',  '',  '',  '',  ''],
  ['',  '',  '',  '',  '',  '',  '',  ''],
  ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
  ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br']
];

// Fetch savedState from localStorage
const savedState = localStorage.getItem("chessGameState");

export const initialGameState = savedState ? JSON.parse(savedState) : {
  position: [initialPosition],
  moveHistory: [],
  turn: 'w',
  availableMoves: [],
  gameStatus: GameStatus.ongoing,
  promotionSquare: null,
  human: humanColour,
  computer: computerColour,
  castlingOptions: {
    'w': 'both',
    'b': 'both'
  }
};

const ChessBoard = () => {
  // Using the useReducer hook to manage the state of the chess board
  // The ChessBoardReducer is a function that handles state changes based on dispatched actions
  const [chessBoardState, dispatch] = useReducer(ChessBoardReducer, initialGameState);

  const position = chessBoardState.position[chessBoardState.position.length - 1];

  // Creating an object to hold the state and dispatch function to be shared with other components
  const providerState = {
    chessBoardState, // The current state of the chess board
    dispatch // The function to dispatch actions to modify the chess board state
  }

  // -----------------------------
  // Create the ranks (horizontal rows): 8 to 1, top to bottom.
  // -----------------------------
  // Array(8) creates an empty array of 8 elements.
  // .fill() is needed so map() works on the array (since it's initially empty).
  // map((x, i) => 8 - i) generates the numbers from 8 to 1.
  const ranks = Array(8).fill().map((x, i) => 8 - i); // [8,7,6,5,4,3,2,1]

  const files = Array(8).fill().map((x, i) => i + 1);

  const isChecked = (() => {
    const isInCheck = validator.isCheck({ positionAfter: position, player: chessBoardState.turn });

    if (isInCheck) {
      return getKingPosition(position, chessBoardState.turn);
    }

    return null;
  })();

  const getSquareStyles = (i, k) => {
    let squareClass = "square";

    if ((i + k) % 2 === 0) {
      squareClass += " square-dark";
    } else {
      squareClass += " square-light";
    }

    if (chessBoardState.availableMoves?.find(square => square[0] === i && square[1] === k)) {
      if (chessBoardState.position[chessBoardState.position.length - 1][i][k]) {
        squareClass += ' available-capture';
      } else {
        squareClass += ' available-empty';
      }
    }

    if (isChecked && isChecked[0] === i && isChecked[1] === k) {
      squareClass += " checked";
    }

    return squareClass
  }

  useEffect(() => {
    localStorage.setItem("chessGameState", JSON.stringify(chessBoardState));
  }, [chessBoardState]);

  return (
    <ChessBoardContext.Provider value={providerState}>
      <div className='board-container'>
        <div className="board">
          
          <Ranks ranks={ranks}/>

          {/* Container for all 64 chessboard squares. Grid layout defined in CSS. */}
          <div className="squares">

            {/* Loop over each rank (row) */}
            {ranks.map((rank, i) => {

              // For each rank, loop over each file (column)
              return files.map((file, k) => {

                // Each square is a div, displaying coordinates like '8a', '8b', etc.
                return <div key={file + "-" + rank} className={getSquareStyles(7-i, k)}></div>;
              });
            })}
          </div>

          <Pieces />

          <PromotionPopUp />
          
          <EndGamePopUp />

          <Files files={files}/>
        </div>

        <BoardSideBar />
      </div>
    </ChessBoardContext.Provider>
  );
};

export default ChessBoard;