import './Board.css'
import Ranks from './parts/Ranks'
import Files from './parts/Files'
import Pieces from './pieces/Pieces'
import { useAppContext } from '../context/context'

const Board = () => {
    const ranks = Array(8).fill().map((x, i) => 8 - i);
    const files = Array(8).fill().map((x, i) => String.fromCharCode(i + 97));

    const { appState } = useAppContext();
    const position = appState.position[appState.position.length - 1];

    const getClassName = (i, j) => {
        let c = 'tile ';
        c += (i + j) % 2 === 0 ? 'tile--light' : 'tile--dark';

        if(appState.availableMoves?.find(move => move[0] === i && move[1] === j)) {
            if(position[i][j]) {
                c += ' tile--available-attack';
            } else {
                c += ' tile--available';
            }
        }

        return c;
    }

    return <div className='board'>
        <Ranks ranks={ranks} />
        <div className="tiles">
            {ranks.map((rank, i) => 
                files.map((file, j) => 
                    <div key={file + '-' + rank} className={getClassName(7-i, j)}></div>
                )
            )}
        </div>
        <Pieces />
        <Files files={files} />
    </div>
}

export default Board