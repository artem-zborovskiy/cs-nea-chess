import React, { useEffect, useRef } from 'react';
import Piece from "./Piece";
import { useBoardContext } from "../../contexts/ChessBoardContext";
import { makeMove, clearAvailableMoves, showPromotionPopup, updateCastlingRight, stalemate, insufficientMaterial, checkmate } from '../../contexts/actions/makeMove';
import validator from '../validator';
import { getCastlingDirection } from "../getMoves";
import { GameStatus } from "../ChessBoard";
import "./styles/Pieces.css";

import { getBestMove } from '../../engine/index';

export const getNotation = ({ piece, rank, file, x, y, position, promotesTo }) => {
    let notation = "";  // Initialise an empty string to build the notation.

    rank = Number(rank);  // Convert 'rank' to a number.
    file = Number(file);  // Convert 'file' to a number.

    // Check if the move is castling.
    // Castling is identified by the piece being a King and moving two squares horizontally.
    if (piece[1] === "k" && Math.abs(file - y) === 2) {
      if (file < y) {
        // If the file is less than the destination file, it's kingside castling (O-O).
        return "O-O";
      } else {
        // If the file is greater than the destination file, it's queenside castling (O-O-O).
        return "O-O-O";
      }
    }

    // If the piece is not a pawn, add the uppercase letter of the piece to the notation.
    if (piece[1] !== "p") {
        notation += piece[1].toUpperCase();
        
        // If there is a piece at the destination square, add an "x" to indicate capture.
        if (position[x][y]) {
            notation += "x";
        }
    } else if (rank !== x && file !== y) {
        // If the move is for a pawn and it's not moving straight (i.e., captures), 
        // add the file of the pawn's start position and "x" for capture.
        notation += String.fromCharCode(file + 97) + "x";
    }

    // Add the destination square (file and rank) to the notation.
    notation += String.fromCharCode(y + 97) + (x + 1);

    // If the pawn is promoted, add the promotion piece after an "=" sign.
    if (promotesTo) {
        notation += "=" + promotesTo.toUpperCase();
    }

    return notation;  // Return the constructed notation.
};

const Pieces = () => {
    const ref = useRef();

    const { chessBoardState, dispatch } = useBoardContext();
    const position = chessBoardState.position[chessBoardState.position.length - 1];
    const turn = chessBoardState.turn;
    const computer = chessBoardState.computer;
    const gameStatus = chessBoardState.gameStatus;

    // Calculates the board coordinates (rank and file) where a piece is dropped
    const calculateCoordinates = (event) => {
        // Get the bounding rectangle of the board element:
        // - `left` and `top` are the distances from the viewport to the board's top-left corner.
        // - `width` is the total width of the board.
        const { width, left, top } = ref.current.getBoundingClientRect();

        // Each square is 1/8 of the total width, since the board is 8x8.
        const size = width / 8;

        // Calculate the file (y-axis):
        // - Subtract the board's left edge from the mouse X position to get horizontal offset.
        // - Divide by square size to get which column the drop occurred in.
        const y = Math.floor((event.clientX - left) / size);

        // Calculate the rank (x-axis):
        // - Subtract the board's top edge from the mouse Y position to get vertical offset.
        // - Divide by square size to get which row the drop occurred in.
        // - Flip vertically since the board ranks go from bottom (0) to top (7).
        const x = 7 - Math.floor((event.clientY - top) / size);

        // Return the board coordinates as an object
        return { x, y };
    }

    const castlingRightStatus = ({ piece, rank, file }) => {
        const direction = getCastlingDirection({ piece, 
            rank: Number(rank), 
            file: Number(file), 
            castlingOptions: chessBoardState.castlingOptions 
        });

        if(direction) {
            dispatch(updateCastlingRight(direction));
        }
    }

    const handleMove = (event) => {
        const { x, y } = calculateCoordinates(event);
        const [ piece, rank, file ] = event.dataTransfer.getData('text').split(' ');

        // Move piece only when coordiantes are in availableMoves
        if(chessBoardState.availableMoves?.find(square => square[0] === x && square[1] === y)) {
            if((piece === "wp" && x === 7) || (piece === "bp" && x === 0)) {
                return dispatch(showPromotionPopup({ rank: Number(rank), file: Number(file), x, y }));
            }

            if(piece.endsWith('k') || piece.endsWith('r')) {
                castlingRightStatus({ piece, rank, file });
            }

            const newPosition = validator.move({ position, piece, rank, file, x, y });

            const notation = getNotation({ piece, rank, file, x, y, position });
            
            dispatch(makeMove({newPosition, notation}));

            const opponent = piece.startsWith('w') ? 'b' : 'w';
            const direction = chessBoardState.castlingOptions[`${piece.startsWith('w') ? 'b' : 'w'}`];

            if (validator.checkStalemate(newPosition, opponent, direction)) {
                dispatch(stalemate());
            } else if (validator.checkInsufficientMaterial(newPosition)) {
                dispatch(insufficientMaterial());
            } else if (validator.isCheckMate(newPosition, opponent, direction)) {
                dispatch(checkmate(piece[0]));
            }
        }

        dispatch(clearAvailableMoves());
    }

    const handleOnDrop = (event) => {
        event.preventDefault();

        handleMove(event);
    }

    const handleOnDragOver = (event) => {
        event.preventDefault();
    }

    // useEffect hook runs whenever the `turn` state changes.
    useEffect(() => {
        // Check if it's the computer's turn to make a move.
        if(gameStatus === GameStatus.ongoing && turn === computer) {
            // Set a timeout to delay the computer's move, allowing some time for visual updates.
            setTimeout(() => {
                // Get the best move for the computer (using the current position).
                const {piece, from, to} = getBestMove(position, computer);  // Calls the function to calculate the best move.
                
                // Extract the starting and target coordinates from the move data.
                const [rank, file] = from;  // Extract the rank and file of the piece being moved.
                const [x, y] = to;  // Extract the target coordinates of the move.

                // Make the move by calling the validator to update the board state.
                const newPosition = validator.move({ position, piece, rank, file, x, y });  // Executes the move and returns the updated position.

                // Get the algebraic notation for the move (for logging or displaying the move).
                const notation = getNotation({ piece, rank, file, x, y, position });

                // Dispatch an action to update the state with the new position and the move notation.
                dispatch(makeMove({ newPosition, notation }));  // Updates the global state with the new board position.
            }, 300);  // Delay of 300ms to simulate the computer's thinking time.
        }
    }, [turn]);  // Effect is triggered when the `turn` state changes.

    return (
        <div className="pieces-grid" onDrop={handleOnDrop} onDragOver={handleOnDragOver} ref={ref}>
            {/* Loop through each row of the board. 'rank' represents the row index (0–7). */}
            {position.map((row, rank) => {
                // Loop through each square in the row. 'file' represents the column index (0–7).
                return row.map((square, file) => {
                    // If there's a piece at this square, render it using the <Piece> component.
                    if(position[rank][file]) {
                        return <Piece 
                                    key={rank + "-" + file} 
                                    rank={rank} 
                                    file={file} 
                                    piece={position[rank][file]} 
                                />;
                    } else {
                        // If no piece is present, render nothing.
                        return null
                    }
                })
            })}
        </div>
    );
}

export default Pieces;