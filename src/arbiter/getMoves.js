export const getRookMoves = ({ position, piece, rank, file }) => {
    const moves = [];
    const currentPlayer = piece[0];
    const opposingPlayer = currentPlayer === 'w' ? 'b' : 'w';

    const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];

    directions.forEach((direction) => {
        for(let i = 1; i < 8; i++) {
            const newRank = rank + i * direction[0];
            const newFile = file + i * direction[1];

            if(position?.[newRank]?.[newFile] === undefined) {
                break;
            }
            if(position[newRank][newFile].startsWith(opposingPlayer)) {
                moves.push([newRank, newFile]);
                break;
            }
            if(position[newRank][newFile].startsWith(currentPlayer)) {
                break;
            }

            moves.push([newRank, newFile]);
        }
    });

    return moves;
}

export const getKnightMoves = ({ position, rank, file }) => {
    const moves = [];
    const enemy = position[rank][file].startsWith('w') ? 'b' : 'w';
    
    const directions = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1]
    ];

    directions.forEach((direction) => {
        const targetSquare = position?.[rank + direction[0]]?.[file + direction[1]];
        if(targetSquare !== undefined && (targetSquare.startsWith(enemy) || targetSquare === '')) {
            moves.push([rank + direction[0], file + direction[1]]);
        }
    })

    return moves;
}

export const getBishopMoves = ({ position, piece, rank, file }) => {
    const moves = [];
    const currentPlayer = piece[0];
    const opposingPlayer = currentPlayer === 'w' ? 'b' : 'w';

    const directions = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1]
    ];

    directions.forEach((direction) => {
        for(let i = 1; i < 8; i++) {
            const newRank = rank + i * direction[0];
            const newFile = file + i * direction[1];

            if(position?.[newRank]?.[newFile] === undefined) {
                break;
            }
            if(position[newRank][newFile].startsWith(opposingPlayer)) {
                moves.push([newRank, newFile]);
                break;
            }
            if(position[newRank][newFile].startsWith(currentPlayer)) {
                break;
            }

            moves.push([newRank, newFile]);
        }
    });

    return moves;
}

export const getQueenMoves = ({ position, piece, rank, file }) => {
    const moves = [
        ...getRookMoves({position, piece, rank, file}),
        ...getBishopMoves({position, piece, rank, file})
    ];

    return moves;
}