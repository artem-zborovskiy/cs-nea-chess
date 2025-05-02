import { clearAvailableMoves, closePromotionPopup, makeMove } from "../../contexts/actions/makeMove";
import { useBoardContext } from "../../contexts/ChessBoardContext";
import { GameStatus } from "../ChessBoard";
import { getNotation } from  "../components/Pieces";
import "./styles/PromotionPopUp.css";

const deepCopyPosition = (position) => position.map(row => [...row]);

const PromotionPopUp = () => {
    const options = ['q', 'r', 'b', 'n']; // List of piece options available for promotion: Queen, Rook, Bishop, Knight

    const { chessBoardState, dispatch } = useBoardContext();

    // If the game is ongoing (not waiting for promotion), don't render the popup
    if (chessBoardState.gameStatus !== GameStatus.promoting) {
        return null;
    }

    const colour = chessBoardState.turn; // Get the current player's colour
    const { promotionSquare } = chessBoardState; // Square where promotion is occurring

    // Function to handle when a player selects a piece to promote to
    const handleSelect = (piece) => {
        // Copy the current position (latest board state)
        const newPosition = deepCopyPosition(chessBoardState.position[chessBoardState.position.length - 1]);

        // Clear the original pawn location
        newPosition[promotionSquare.rank][promotionSquare.file] = '';

        // Place the newly promoted piece on the board
        newPosition[promotionSquare.x][promotionSquare.y] = colour + piece;

        // Clear available moves, make the move, and close the popup
        dispatch(clearAvailableMoves());
        
        const notation = getNotation({ 
            ...promotionSquare, 
            position: chessBoardState.position[chessBoardState.position.length - 1], 
            piece: colour + 'p', 
            promotesTo: piece,  
        });


        dispatch(makeMove({ newPosition, notation }));
        dispatch(closePromotionPopup());
    }

    return (
        <div className="popup">
            <div className="popup-content">
                <div className="promotion-choices">
                    {options.map((piece) => {
                        return (
                            <div 
                                key={piece} 
                                className={`piece ${colour}${piece}`}
                                onClick={() => handleSelect(piece)}
                            ></div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default PromotionPopUp;