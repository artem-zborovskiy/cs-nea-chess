import { GameStatus, initialGameState } from "../chessBoard/ChessBoard";

// This is the reducer function for the ChessBoard context.
// A reducer takes the current state and an action, then returns the new state.
export const ChessBoardReducer = (state, action) => {
    
    // The switch statement checks the action type to determine how to update the state.
    switch (action.type) {
        case "MAKE_MOVE": {
            let { turn, position, moveHistory } = state;

            if(turn === 'w') {
                turn = 'b';
            } else {
                turn = 'w';
            }

            position = [...position, action.payload.newPosition ];
            moveHistory = [...moveHistory, action.payload.notation ]

            return {
                ...state,
                moveHistory,
                turn,
                position
            }
        }   
        case "GET_AVAILABLE_MOVES": {
            return {
                ...state,
                availableMoves: action.payload.availableMoves
            }
        }
        case "CLEAR_AVAILABLE_MOVES": {
            return {
                ...state,
                availableMoves: []
            }
        }
        case "SHOW_PROMOTION_POPUP": {
            return {
                ...state,
                gameStatus: GameStatus.promoting,
                promotionSquare: {...action.payload}
            }
        }
        case "CLOSE_PROMOTION_POPUP": {
            return {
                ...state,
                gameStatus: GameStatus.ongoing,
                promotionSquare: null
            }
        }
        case "UPDATE_CASTLING_RIGHT": {
            const { turn, castlingOptions } = state;
            castlingOptions[turn] = action.payload;
            
            return {
                ...state,
                castlingOptions
            }
        }
        case "STALEMATE": {
            return {
                ...state,
                gameStatus: GameStatus.stalemate,
            }
        }
        case "INSUFFICIENT_MATERIAL": {
            return {
                ...state,
                gameStatus: GameStatus.insufficientMaterial,
            }
        }
        case "CHECKMATE": {
            return {
                ...state,
                gameStatus: action.payload === 'w' ? GameStatus.whiteWins : GameStatus.blackWins,
            }
        }
        case "RESET_GAME": {
            localStorage.removeItem("chessGameState");
            return {
                ...initialGameState
            }
        }
        default:
            return state
    };
}