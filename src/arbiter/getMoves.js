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