import { getRookMoves, getKnightMoves, getBishopMoves, getQueenMoves, getKingMoves, getPawnMoves, getKingPosition, getPieces, getCastlingMoves } from "./getMoves";

const deepCopyPosition = (position) => position.map(row => [...row]);

// Function to check if two squares are the same color on a chessboard

// On a chessboard, squares alternate color.
// If the sum of (x + y) for both squares is even or both are odd,
// then the squares are the same color.
const sameColorSquares = (coordinates1, coordinates2) => (coordinates1.x + coordinates1.y) % 2 === coordinates2.x + coordinates2.y;

// Function to find all coordinates of a specific piece type on the board
const findPieceCoordinates = (position, type) => {
    let results = [];

    // Loop through each rank (row) of the board
    position.forEach((rank, i) => {
        // Loop through each file (column) in the rank
        rank.forEach((pos, k) => {
            // If the current square matches the desired piece type
            if (pos === type) {
                // Add its coordinates (row: i, column: k) to the results
                results.push({ x: i, y: k });
            }
        });
    });

    // Return the list of all matching piece coordinates
    return results;
};

const validator = {
    getRegularMoves: ({ position, previousPosition = null, piece, rank, file, castlingOptions }) => {
        if (piece.endsWith("r")) {
            return getRookMoves({ position, piece, rank, file });
        }
        if (piece.endsWith("n")) {
            return getKnightMoves({ position, piece, rank, file });
        }
        if (piece.endsWith("b")) {
            return getBishopMoves({ position, piece, rank, file });
        }
        if (piece.endsWith("q")) {
            return getQueenMoves({ position, piece, rank, file });
        }
        if (piece.endsWith("k")) {
            return getKingMoves({ position, piece, rank, file, castlingOptions });
        }
        if(piece.endsWith("p")) {
            return getPawnMoves({ position, previousPosition, piece, rank, file });
        }
    },

    move: ({ position, piece, rank, file, x, y }) => {
        const newPosition = deepCopyPosition(position);

        // Check if the moved piece is a king and it moved two squares horizontally — a castling move
        if (piece.endsWith('k') && Math.abs(y - file) === 2) {

            // If the king moved to file index 2 (queenside castling)
            if (y === 2) {
                newPosition[rank][0] = ''; // Remove the rook from its original square (a1 or a8)
                newPosition[rank][3] = piece[0] === 'w' ? 'wr' : 'br'; // Place the rook next to the king on d1 or d8
            }

            // If the king moved to file index 6 (kingside castling)
            if (y === 6) {
                newPosition[rank][7] = ''; // Remove the rook from its original square (h1 or h8)
                newPosition[rank][5] = piece[0] === 'w' ? 'wr' : 'br'; // Place the rook next to the king on f1 or f8
            }
        }

        if(piece.endsWith("p") && !newPosition[x][y] && x !== rank && y !== file) {
            newPosition[rank][y] = '';
        }

        newPosition[rank][file] = "";
        newPosition[x][y] = piece;

        return newPosition;
    },

    // Determines whether the current player's king is in check after a move.
    isCheck: ({ position = null, positionAfter, player }) => {
        // Determine the opponent's color
        const opponentColour = player.startsWith('w') ? 'b' : 'w';

        // Find the king's new position after the move
        const kingPosition = getKingPosition(positionAfter, player);

        // Get all opponent pieces on the updated board
        const opponentPieces = getPieces(positionAfter, opponentColour);

        // Generate all legal moves for each opponent piece
        const opponentMoves = opponentPieces.reduce((accumulator, piece) => accumulator = [
            ...accumulator, ...validator.getRegularMoves({ 
                position: positionAfter, 
                previousPosition: position, 
                ...piece
            })
        ], []);

        // Check if any of the opponent's moves can capture the player's king
        if (opponentMoves.some(([x, y]) => kingPosition[0] === x && kingPosition[1] === y)) {
            return true; // King is under threat
        }

        return false; // King is safe
    },

    // Returns all valid moves for a given piece that do not result in the player's own king being in check.
    getValidMoves: ({ position, previousPosition = null, piece, rank, file, castlingOptions }) => {
        // Get all theoretically legal moves for the piece (ignoring checks)
        let moves = validator.getRegularMoves({ position, previousPosition, piece, rank, file, castlingOptions });
    
        // Initialise an array to hold moves that don't leave the king in check
        let notInCheckMoves = [];

        if(piece.endsWith('k')) {
            moves = [
                ...moves, 
                ...getCastlingMoves({position, castlingOptions, piece, rank, file})
            ];
        }
    
        // Test each potential move
        moves.forEach(([x, y]) => {
            // Simulate the board position after making this move
            const positionAfter = validator.move({ position, piece, rank, file, x, y });
    
            // Check if the move puts the current player's king in check
            if (!validator.isCheck({ position, positionAfter, player: piece[0] })) {
                // If the king is safe after the move, include it in the list of valid moves
                notInCheckMoves.push([x, y]);
            }
        });
    
        // Return only those moves that do not leave the king in check
        return notInCheckMoves;
    },

    //Determines whether the current position is a stalemate for the given player.
    checkStalemate: (position, player, direction) => {
        // Step 1: Check if the player is currently in check.
        const isInCheck = validator.isCheck({ positionAfter: position, player });

        // If the player is in check, it cannot be stalemate (could be checkmate instead).
        if(isInCheck) {
            return false;
        }

        // Step 2: Get all pieces belonging to the player
        const pieces = getPieces(position, player);

        // Step 3: For each piece, gather all valid legal moves
        const moves = pieces.reduce((accumulator, piece) => accumulator = [
            ...accumulator, ...validator.getValidMoves({
                position,
                castlingOptions: direction,
                ...piece
            })
        ], []);

        // Step 4: If the player is not in check and has no legal moves, it's stalemate
        return (!isInCheck && moves.length === 0);
    },

    checkInsufficientMaterial: (position) => {
        // Flatten the board and collect all non-empty squares into `pieces`
        const pieces = position.reduce((accumulator, rank) => accumulator = [
            ...accumulator,
            ...rank.filter(square => square)  // only keep non-empty squares
        ], []);
    
        // Case 1: Only two kings left on the board
        if (pieces.length === 2) {
            return true;  // King vs King = draw
        }
    
        // Case 2: One side has only a bishop or knight in addition to the king
        if (pieces.length === 3) {
            if (pieces.some(piece => piece.endsWith('b') || piece.endsWith('n'))) {
                return true;  // King + minor piece vs King = draw
            }   
        }
    
        // Case 3: Both sides have a king and a bishop, and bishops are on the same color
        if (pieces.length === 4) {
            if (pieces.every(p => p.endsWith('b') || p.endsWith('k'))) {  // only bishops and kings
                if (new Set(pieces).size === 4) {  // make sure they're all unique (no duplicates)
                    // Use helper to find if both bishops are on the same color
                    if (sameColorSquares(
                        findPieceCoordinates(position, 'wb')[0],
                        findPieceCoordinates(position, 'bb')[0]
                    )) {
                        return true;  // Both bishops on same color = insufficient material
                    }
                }
            }
        }
    
        // In all other cases, there is sufficient material to checkmate
        return false;
    },

    isCheckMate: (position, player, direction) => {
        const isInCheck = validator.isCheck({ positionAfter: position, player });

        // Player MUST be in check for a checkmate
        if(!isInCheck) {
            return false;
        }

        const pieces = getPieces(position, player);

        const moves = pieces.reduce((accumulator, piece) => accumulator = [
            ...accumulator, ...validator.getValidMoves({
                position,
                castlingOptions: direction,
                ...piece
            })
        ], []);

        // Ensure that the player is in check and has no valid moves
        return (isInCheck && moves.length === 0);
    }
}

export default validator;