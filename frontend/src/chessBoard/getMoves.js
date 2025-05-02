import validator from "./validator";

// Function to calculate all legal moves in straight lines for a Rook
export const getRookMoves = ({ position, piece, rank, file }) => {
    let moves = []; // Array to store all valid move coordinates
    const ownColour = piece[0]; // Determine the color of the current piece ('w' or 'b')
    const opponentColour = ownColour === 'w' ? 'b' : 'w'; // Determine the color of the opponent

    // Define directions: up, down, left, right — standard rook movement
    const directions = [
        [-1, 0], // Up
        [1, 0],  // Down
        [0, -1], // Left
        [0, 1]   // Right
    ];

    // Loop through each direction to explore possible moves
    directions.forEach((vector) => {
        for (let i = 1; i < 8; i++) { // Up to 7 steps in one direction on an 8x8 board
            const x = rank + (i * vector[0]); // New rank based on direction
            const y = file + (i * vector[1]); // New file based on direction

            // Stop if outside the board boundaries or the square is undefined
            if (position?.[x]?.[y] === undefined) {
                break;
            }

            const targetSquare = position[x][y];

            // If the square has an opponent's piece, it's a valid capture, then stop
            if (targetSquare.startsWith(opponentColour)) {
                moves.push([x, y]);
                break;
            }

            // If the square has your own piece, stop exploring this direction
            if (targetSquare.startsWith(ownColour)) {
                break;
            }

            // If the square is empty, it's a valid move
            moves.push([x, y]);
        }
    });

    return moves; // Return the array of all legal moves
};

// Function to get all valid knight moves from a given position
export const getKnightMoves = ({ position, piece, rank, file }) => {
    let moves = []; // Array to collect legal moves for the knight

    // Determine the opponent's color based on the piece at the current square
    const opponentColour = position[rank][file].startsWith("w") ? 'b' : 'w';

    // Define all possible L-shaped move directions for a knight (8 in total)
    const directions = [
        [-2, -1], // Up 2, left 1
        [-2, 1],  // Up 2, right 1
        [-1, -2], // Up 1, left 2
        [-1, 2],  // Up 1, right 2
        [1, -2],  // Down 1, left 2
        [1, 2],   // Down 1, right 2
        [2, -1],  // Down 2, left 1
        [2, 1],   // Down 2, right 1
    ];

    // Check each potential knight move
    directions.forEach((direction) => {
        const targetRank = rank + direction[0];
        const targetFile = file + direction[1];

        // Get the piece at the target square (if within bounds)
        const square = position?.[targetRank]?.[targetFile];

        // A move is valid if the square is empty or contains an opponent's piece
        if (square !== undefined && (square.startsWith(opponentColour) || square === "")) {
            moves.push([targetRank, targetFile]); // Add the move to the list
        }
    });

    return moves; // Return the list of legal knight moves
};

// Function to calculate all legal bishop moves from a given position
export const getBishopMoves = ({ position, piece, rank, file }) => {
    let moves = []; // Stores all valid move coordinates
    const ownColour = piece[0]; // Get the color of the current piece ('w' or 'b')
    
    // Determine opponent color
    const opponentColour = ownColour === 'w' ? 'b' : 'w';

    // Define all 4 diagonal movement directions for a bishop
    const directions = [
        [-1, -1], // Up-left
        [-1, 1],  // Up-right
        [1, -1],  // Down-left
        [1, 1],   // Down-right
    ];

    // Explore each diagonal direction
    directions.forEach(direction => {
        for (let i = 1; i <= 8; i++) { // Bishop can move up to 7 squares (max board size)
            const x = rank + (i * direction[0]); // Calculate new rank
            const y = file + (i * direction[1]); // Calculate new file

            // Stop if outside the board
            if (position?.[x]?.[y] === undefined)
                break;

            // If there's an opponent piece, it's a valid capture then stop further in this direction
            if (position[x][y].startsWith(opponentColour)) {
                moves.push([x, y]);
                break;
            }

            // If there's a friendly piece, the bishop can't go further
            if (position[x][y].startsWith(ownColour)) {
                break;
            }

            // If the square is empty, it's a valid move
            moves.push([x, y]);
        }
    });

    return moves; // Return all calculated legal bishop moves
};

// Function to calculate all legal queen moves from a given position
export const getQueenMoves = ({ position, piece, rank, file }) => {
    return [
        // Combine all legal bishop moves (diagonals)
        ...getBishopMoves({ position, piece, rank, file }),

        // Combine all legal rook moves (straight lines)
        ...getRookMoves({ position, piece, rank, file })
    ];
};

// Function to calculate all legal king moves from a given position
export const getKingMoves = ({ position, piece, rank, file }) => {
    let moves = []; // Array to collect valid king moves
    const ownColour = piece[0]; // Get the color of the current piece ('w' or 'b')

    // Define all 8 adjacent directions the king can move in (1 square in any direction)
    const directions = [
        [1, -1], [1, 0],  [1, 1],   // Down-left, down, down-right
        [0, -1],         [0, 1],   // Left,        , right
        [-1, -1], [-1, 0], [-1, 1]  // Up-left, up, up-right
    ];

    // Loop through each direction to evaluate move legality
    directions.forEach(direction => {
        const x = rank + direction[0]; // New rank
        const y = file + direction[1]; // New file

        // Check if the target square is on the board and not occupied by own piece
        if (position?.[x]?.[y] !== undefined && !position[x][y].startsWith(ownColour)) {
            moves.push([x, y]); // Add valid move
        }
    });

    return moves; // Return the list of valid king moves
};

export const getCastlingMoves = ({ position, piece, rank, file, castlingOptions }) => {
    let moves = [];
    const ownColour = piece[0];

    if (file !== 4 || rank % 7 !== 0 || castlingOptions === 'none') {
        return moves;
    }

    if (ownColour === "w") {
        if (validator.isCheck({ positionAfter: position, player: 'w' })) {
            return moves;
        }
        if (castlingOptions === 'left' || castlingOptions === 'both') {
            if (!position[0][3] && !position[0][2] && !position[0][1] && position[0][0] === 'wr') {
                if (!validator.isCheck({
                    positionAfter: validator.move({ position, piece, rank ,file, x: 0, y: 3 }),
                    player: 'w'
                }) &&
                !validator.isCheck({
                    positionAfter: validator.move({ position, piece, rank, file, x: 0, y: 2 }),
                    player: 'w'
                })) {
                    moves.push([0, 2]);
                }
            }
        }
        if (castlingOptions === 'right' || castlingOptions === 'both') {
            if (!position[0][5] && !position[0][6] && position[0][7] === 'wr') {
                if (!validator.isCheck({
                    positionAfter: validator.move({ position, piece, rank, file, x: 0, y: 5 }),
                    player: 'w'
                }) &&
                !validator.isCheck({
                    positionAfter: validator.move({ position, piece, rank, file, x: 0, y: 6 }),
                    player: 'w'
                })) {
                    moves.push([0, 6]);
                }
            }
        }
    } else {
        if (validator.isCheck({ positionAfter: position, player: 'b' })) {
            return moves;
        }
        if (castlingOptions === 'left' || castlingOptions === 'both') {
            if (!position[7][3] && !position[7][2] && !position[7][1] && position[7][0] === 'br') {
                if (!validator.isCheck({
                    positionAfter: validator.move({ position, piece, rank, file, x: 7, y: 3 }),
                    position: position,
                    player: 'b'
                }) &&
                !validator.isCheck({
                    positionAfter: validator.move({ position, piece ,rank, file, x: 7, y: 2 }),
                    position: position,
                    player: 'b'
                })) {
                    moves.push([7, 2]);
                }
            }
        }
        if (castlingOptions === 'right' || castlingOptions === 'both') {
            if (!position[7][5] && !position[7][6] && position[7][7] === 'br') {
                if (!validator.isCheck({
                    positionAfter: validator.move({ position, piece, rank, file, x: 7, y: 5 }),
                    position: position,
                    player: 'b'
                }) &&
                !validator.isCheck({
                    positionAfter: validator.move({ position, piece, rank, file, x: 7, y: 6 }),
                    position: position,
                    player: 'b'
                })) {
                    moves.push([7, 6]);
                }   
            }
        }
    }

    return moves;
}

export const getPawnMoves = ({position, previousPosition, piece, rank, file}) => {
    let moves = [];
    const direction = piece === 'wp' ? 1 : -1;

    const opponentPawn = piece[0] === "w" ? "bp" : "wp";
    const adjacentFiles = [file - 1, file + 1];

    // Move two squares on first move
    if (rank === 1 || rank === 6) {
        if (position?.[rank + direction]?.[file] === '' && position?.[rank + direction + direction]?.[file] === '') {
            moves.push([rank + direction + direction, file]);
        }
    }

    // Move one square
    if (!position?.[rank + direction]?.[file]) {
        moves.push([rank + direction, file]);
    }

    // Captures diagonally
    if (position?.[rank + direction]?.[file - 1] && position?.[rank + direction]?.[file - 1].startsWith(opponentPawn[0])) {
        moves.push([rank + direction, file - 1]);
    }
    if (position?.[rank + direction]?.[file + 1] && position?.[rank + direction]?.[file + 1].startsWith(opponentPawn[0])) {
        moves.push([rank + direction, file + 1]);
    }

    //En passant

    // Only check en passant if the previous position is provided
    if(previousPosition){
        // En passant is only possible if the pawn is on the correct rank:
        // Rank 4 for white (after opponent moved 2 squares), Rank 3 for black
        if ((direction === 1 && rank === 4) || (direction === -1 && rank === 3)){
            // Loop through each adjacent file
            adjacentFiles.forEach(adjacentFile => {
                // Check if the adjacent square contains an opponent's pawn
                // and the square two steps behind it is empty (verifying the move just occurred)
                if (position?.[rank]?.[adjacentFile] === opponentPawn && position?.[rank + direction + direction]?.[adjacentFile] === '') {
                    // Check that in the previous position, the adjacent file was empty at current rank,
                    // and the opponent's pawn was 2 ranks behind — confirming the 2-square advance
                    if (previousPosition?.[rank]?.[adjacentFile] === '' && previousPosition?.[rank + direction + direction]?.[adjacentFile] === opponentPawn) {
                        // Add en passant capture square to legal moves
                        moves.push ([rank + direction, adjacentFile]);
                    }
                }
            })
        }
    }

    return moves;
}

export const getCastlingDirection = ({ piece, rank, file, castlingOptions }) => {
    const direction = castlingOptions[piece[0]]; // Currently available castling options for the player ['w' or 'b']

    if (piece.endsWith('k')) {
        return 'none';
    }

    // If the piece is a king, return 'none' since this function only concerns rook movement logic
    if (piece.endsWith('k')) {
        return 'none';
    }

    // For white rook at a1 (file 0, rank 0)
    if (file === 0 && rank === 0) {
        if (direction === 'both') {
            return 'right'; // Only the kingside rook remains after queenside castling
        }
        if (direction === 'left') {
            return 'none'; // Queenside castling already used; rook no longer needed
        }
    }

    // For white rook at h1 (file 7, rank 0)
    if (file === 7 && rank === 0) {
        if (direction === 'both') {
            return 'left'; // Only the queenside rook remains after kingside castling
        }
        if (direction === 'right') {
            return 'none'; // Kingside castling already used
        }
    }

    // For black rook at a8 (file 0, rank 7)
    if (file === 0 && rank === 7) {
        if (direction === 'both') {
            return 'right';
        }
        if (direction === 'left') {
            return 'none';
        }
    }

    // For black rook at h8 (file 7, rank 7)
    if (file === 7 && rank === 7) {
        if (direction === 'both') {
            return 'left';
        }
        if (direction === 'right') {
            return 'none';
        }
    }
}

export const getKingPosition = (position, playerColour) => {
    let kingPosition;

    // Loop through each row (rank) of the board
    position.forEach((rank, x) => {
        // Loop through each square (file) in the rank
        rank.forEach((file, y) => {
            // Check if the current piece belongs to the player and is a king
            if (position[x][y].startsWith(playerColour) && position[x][y].endsWith('k')) {
                kingPosition = [x, y];  // Store the coordinates of the king
            }
        });
    });

    return kingPosition; // Return the coordinates of the king
}

// Retrieves all pieces belonging to the opponent from the given board position.
export const getPieces = (position, opponentColour) => {
    const opponentPieces = [];

    // Loop through each row (rank) of the board
    position.forEach((rank, x) => {
        // Loop through each square (file) in the current rank
        rank.forEach((file, y) => {
            // Check if the square contains a piece of the opponent's color
            if (position[x][y].startsWith(opponentColour)) {
                // Add the piece and its coordinates to the list
                opponentPieces.push({
                    piece: position[x][y], // e.g., "bp" for black pawn
                    rank: x, // row index
                    file: y, // column index
                });
            }
        });
    });

    return opponentPieces; // Return the array of opponent pieces and their positions
}