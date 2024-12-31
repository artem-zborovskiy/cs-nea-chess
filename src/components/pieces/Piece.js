import arbiter from '../../arbiter/arbiter';
import { useAppContext } from '../../context/context'
import { generateAvailableMoves } from '../../reducer/actions/move'

const Piece = ({rank, file, piece}) => {
    const { appState, dispatch } = useAppContext();
    const { turn, position } = appState;
    const currentPosition = position[position.length - 1]; 

    const handleOnDragStart = (event) => {
        event.dataTransfer.effectAllowed = 'move';
        setTimeout(() => {
            event.target.style.display = 'none';
        }, 0);
        event.dataTransfer.setData('text/plain', `${piece}/${rank}/${file}`);

        if(turn === piece[0]) {
            const availableMoves = arbiter.getRegularMoves({position:currentPosition, piece, rank, file});
            dispatch(generateAvailableMoves({availableMoves}));
        }
    }

    const handleOnDragEnd = (event) => {
        event.target.style.display = 'block';
    }

    return <div className={`piece ${piece} piece-${file}${rank}`} draggable="true" onDragStart={handleOnDragStart} onDragEnd={handleOnDragEnd}>
        <img className='piece-img' alt={piece} src={require(`../../assets/${piece}.png`)} />
    </div>
}

export default Piece