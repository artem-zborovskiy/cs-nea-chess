import { getAvailableMoves } from "../../contexts/actions/makeMove";
import { useBoardContext } from "../../contexts/ChessBoardContext";
import validator from "../validator";
import "./styles/Piece.css";

const Piece = ({ piece, rank, file }) => {
    const { chessBoardState, dispatch } = useBoardContext();
    const { turn, position, castlingOptions, human } = chessBoardState;
    const currentPosition = position[position.length - 1];

    const handleDragStart = (event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', `${piece} ${rank} ${file}`);
        // Hide the original piece once the drag begins
        setTimeout(() => {
            event.target.style.display = 'none';
        }, 0);

        if(turn === piece[0] && turn === human) { // Prevent dragging pieces for human player when its not their turn
            const previousPosition = position[position.length - 2];
            const availableMoves = validator.getValidMoves({ 
                position: currentPosition, 
                previousPosition, 
                piece, 
                rank, 
                file,
                castlingOptions: castlingOptions[turn],
            });
            dispatch(getAvailableMoves({availableMoves}));
        }
    }

    const handleDragEnd = (event) => {
        event.target.style.display = "block";
    }

    return (
        <div 
            className={`piece ${piece} p-${file}${rank}`} 
            draggable={true}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >

        </div>
    );
}

export default Piece;