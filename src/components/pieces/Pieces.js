import { useState, useRef } from 'react';
import './Pieces.css'
import Piece from './Piece'
import { createPosition, copyPosition } from '../../helper';

const Pieces = () => {
    const [position, setPosition] = useState(createPosition());
    const ref = useRef();

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
        const newPosition = copyPosition(position);
        newPosition[rank][file] = '';
        newPosition[x][y] = piece;
        setPosition(newPosition);
    }

    const handleOnDragOver = (event) => {
        event.preventDefault();
    }

    return <div ref={ref} className='pieces' onDrop={handleOnDrop} onDragOver={handleOnDragOver}>
        {position.map((r, rank) => {
            return r.map((f, file) => {
                return position[rank][file] ? <Piece key={rank + '-' + file} rank={rank} file={file} piece={position[rank][file]} /> : null;
            })
        })}
    </div>
}

export default Pieces