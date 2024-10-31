import { useRef } from 'react';
import './Pieces.css'
import Piece from './Piece'
import { copyPosition } from '../../helper';

import { useAppContext } from '../../context/context';
import { makeMove } from '../../reducer/actions/move';

const Pieces = () => {
    const ref = useRef();

    const {appState, dispatch} = useAppContext();
    const currentPosition = appState.position[appState.position.length - 1];

    const calcCoords = (event) => {
        const {width, left, top} = ref.current.getBoundingClientRect();
        const size = width / 8;
        const x = 7 - Math.floor((event.clientY - top) / size);
        const y = Math.floor((event.clientX - left) / size);

        return {x, y};
    }

    const handleOnDrop = (event) => {
        const [piece, rank, file] = event.dataTransfer.getData('text').split('/');
        const {x, y} = calcCoords(event);
        const newPosition = copyPosition(currentPosition);
        newPosition[rank][file] = '';
        newPosition[x][y] = piece;
        dispatch(makeMove({newPosition}));
    }

    const handleOnDragOver = (event) => {
        event.preventDefault();
    }

    return <div ref={ref} className='pieces' onDrop={handleOnDrop} onDragOver={handleOnDragOver}>
        {currentPosition.map((r, rank) => {
            return r.map((f, file) => {
                return currentPosition[rank][file] ? <Piece key={rank + '-' + file} rank={rank} file={file} piece={currentPosition[rank][file]} /> : null;
            })
        })}
    </div>
}

export default Pieces