const Piece = ({rank, file, piece}) => {
    const handleOnDragStart = (event) => {
        event.dataTransfer.effectAllowed = 'move';
        setTimeout(() => {
            event.target.style.display = 'none';
        }, 0);
        event.dataTransfer.setData('text/plain', `${piece}/${rank}/${file}`);
    }

    const handleOnDragEnd = (event) => {
        event.target.style.display = 'block';
    }

    return <div className={`piece ${piece} piece-${file}${rank}`} draggable="true" onDragStart={handleOnDragStart} onDragEnd={handleOnDragEnd}>
        <img className='piece-img' alt={piece} src={require(`../../assets/${piece}.png`)} />
    </div>
}

export default Piece