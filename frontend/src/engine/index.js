import validator from "../chessBoard/validator";

const evaluateBoard = (position) => {
    const pieceValues = {
        p: 10,   // Pawn value
        n: 30,   // Knight value
        b: 30,   // Bishop value
        r: 50,   // Rook value
        q: 90,   // Queen value
        k: 900   // King value
    };
  
    const positionValues = {
        p: [0, 5, 10, 10, 10, 10, 5, 0], // Pawn's positional value per row
        n: [0, 2, 6, 6, 6, 6, 2, 0],     // Knight's positional value per row
        b: [0, 4, 6, 6, 6, 6, 4, 0],     // Bishop's positional value per row
        r: [0, 2, 4, 5, 5, 4, 2, 0],     // Rook's positional value per row
        q: [0, 3, 6, 7, 7, 6, 3, 0],     // Queen's positional value per row
        k: [0, 2, 4, 5, 5, 4, 2, 0]      // King's positional value per row
    };
  
    let score = 0;
  
    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            const cell = position[rank][file];
    
            if (cell) {
                const piece = cell[1];   // Piece type (e.g., 'p', 'n', 'r', etc.)
                const color = cell[0];   // Piece color ('b' for black, 'w' for white)
                const pieceValue = pieceValues[piece];
        
                // Adjust the score based on piece's material value.
                score += color === 'b' ? pieceValue : -pieceValue;
        
                // Add positional value for the piece (based on its position on the board).
                const positionalValue = positionValues[piece][rank];
                score += color === 'b' ? positionalValue : -positionalValue;
            }
        }
    }
  
    return score;
}

// Function to get all valid moves for a given player on the current board position
function getAllMoves(position, player) {
    // Initialise an empty array to store the possible moves
    const moves = [];

    // Loop through the entire board (8x8 grid)
    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            // Get the piece at the current position (rank, file)
            const piece = position[rank][file];
            
            // If there's a piece at this position and it belongs to the current player
            if (piece && piece[0] === player) {
                // Skip the king piece to avoid considering castling moves here
                if (piece[1] === 'k') {
                    continue;
                }

                // Get the valid moves for the current piece at position (rank, file)
                const validMoves = validator.getValidMoves({ position, piece, rank, file });

                // For each valid move, add it to the moves array
                validMoves.forEach(([x, y]) => {
                    moves.push({ piece, from: [rank, file], to: [x, y] });
                });
            }
        }
    }

    // Return the list of all valid moves for the player
    return moves;
}

// Minimax function with alpha-beta pruning to evaluate the best possible move for the player
function minimax(position, depth, alpha, beta, isMaximizing) {
    // Base case: If the depth is 0, evaluate the current board position
    if (depth === 0) {
        return evaluateBoard(position);
    } 

    // Determine which player is making the move: Maximizing (black) or Minimizing (white)
    const player = isMaximizing ? 'b' : 'w';

    // Get all valid moves for the current player
    const moves = getAllMoves(position, player);

    // Maximizing player (black) tries to maximize the evaluation score
    if (isMaximizing) {
        let maxEval = -Infinity; // Initialise with the worst possible evaluation

        // Loop through all possible moves for the current player
        for (let move of moves) {
            // Make the move and get the new position
            const newPos = validator.move({
                position,
                piece: move.piece,
                rank: move.from[0],
                file: move.from[1],
                x: move.to[0],
                y: move.to[1]
            });

            // Recursively call minimax for the next depth with the minimizing player
            const evaluation = minimax(newPos, depth - 1, alpha, beta, false);

            // Update the maximum evaluation found so far
            maxEval = Math.max(maxEval, evaluation);

            // Update alpha (the best evaluation for the maximizing player)
            alpha = Math.max(alpha, evaluation);

            // If beta <= alpha, prune the remaining branches (alpha-beta pruning)
            if (beta <= alpha) {
                break;
            }
        }

        // Return the best evaluation found for the maximizing player
        return maxEval;
    } 
    // Minimizing player (white) tries to minimize the evaluation score
    else {
        let minEval = Infinity; // Initialize with the best possible evaluation

        // Loop through all possible moves for the current player
        for (let move of moves) {
            // Make the move and get the new position
            const newPos = validator.move({
                position,
                piece: move.piece,
                rank: move.from[0],
                file: move.from[1],
                x: move.to[0],
                y: move.to[1]
            });

            // Recursively call minimax for the next depth with the maximizing player
            const evaluation = minimax(newPos, depth - 1, alpha, beta, true);

            // Update the minimum evaluation found so far
            minEval = Math.min(minEval, evaluation);

            // Update beta (the best evaluation for the minimizing player)
            beta = Math.min(beta, evaluation);

            // If beta <= alpha, prune the remaining branches (alpha-beta pruning)
            if (beta <= alpha) {
                break;
            }
        }

        // Return the best evaluation found for the minimizing player
        return minEval;
    }
}

export const getBestMove = (position, player) => {
  const isMaximising = player === 'b';
  let bestEval = isMaximising ? -Infinity : Infinity;
  let bestMove = null;

  const allMoves = getAllMoves(position, player);

  for (let move of allMoves) {
    const newPos = validator.move({
      position,
      piece: move.piece,
      rank: move.from[0],
      file: move.from[1],
      x: move.to[0],
      y: move.to[1]
    });
    const evaluation = minimax(newPos, 3, -Infinity, Infinity, !isMaximising);

    if (
      (isMaximising && evaluation > bestEval) ||
      (!isMaximising && evaluation < bestEval)
    ) {
      bestEval = evaluation;
      bestMove = move;
    }
  }

  return bestMove;
};