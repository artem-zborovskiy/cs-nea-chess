import { useBoardContext } from "../../contexts/ChessBoardContext";
import "./styles/BoardSideBar.css";

const BoardSideBar = () => {
    const { chessBoardState, dispatch } = useBoardContext();
    const moveHistory = chessBoardState.moveHistory;

    return (
        <div className="moveList">
            {moveHistory.map((move, index) => {
                return <div key={index} data-number={Math.floor(index / 2) + 1}>{move}</div>
            })}
        </div>
    );
}

export default BoardSideBar;