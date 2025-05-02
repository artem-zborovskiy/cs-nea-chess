import { useBoardContext } from "../../contexts/ChessBoardContext";
import { GameStatus } from "../ChessBoard";
import { resetGame } from '../../contexts/actions/makeMove';
import './styles/EndGamePopUp.css';

const EndGamePopUp = () => {
    const { chessBoardState, dispatch } = useBoardContext();

    const status = chessBoardState.gameStatus;

    if (status === GameStatus.ongoing || status === GameStatus.promoting) {
        return null;
    }

    return (
        <div className="endgame-popup">
            <div className="endgame-popup-content">
                {status === GameStatus.stalemate ? 
                <>
                    <h1>Stalemate</h1>
                    <h2>1/2 - 1/2</h2>
                </>
                : ''}
                {status === GameStatus.insufficientMaterial ? 
                <>
                    <h1>Insufficient Material</h1>
                    <h2>1/2 - 1/2</h2>
                </>
                : ''}
                {status === GameStatus.whiteWins ? 
                <>
                    <h1>White Wins</h1>
                    <h2>1 - 0</h2>
                </>
                : ''}
                {status === GameStatus.blackWins ? 
                <>
                    <h1>Black Wins</h1>
                    <h2>0 - 1</h2>
                </>
                : ''}
                <button className="button-default" onClick={() => dispatch(resetGame())}>Restart</button>
            </div>
        </div>
    );
}

export default EndGamePopUp;