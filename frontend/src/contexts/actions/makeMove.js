export const makeMove = ({ newPosition, notation }) => {
    return {
        type: "MAKE_MOVE",
        payload: { newPosition, notation }
    }
}

export const getAvailableMoves = ({ availableMoves }) => {
    return {
        type: "GET_AVAILABLE_MOVES",
        payload: { availableMoves }
    }
}

export const clearAvailableMoves = () => {
    return {
        type: "CLEAR_AVAILABLE_MOVES",
    }
}

export const showPromotionPopup = ({ rank, file, x, y }) => {
    return {
        type: "SHOW_PROMOTION_POPUP",
        payload: { rank, file, x, y }
    }
}

export const closePromotionPopup = () => {
    return {
        type: "CLOSE_PROMOTION_POPUP",
    }
}

export const updateCastlingRight = (direction) => {
    return {
        type: "UPDATE_CASTLING_RIGHT",
        payload: direction
    }
}

export const stalemate = () => {
    return {
        type: "STALEMATE",
    }
}

export const insufficientMaterial = () => {
    return {
        type: "INSUFFICIENT_MATERIAL",
    }
}

export const checkmate = (winner) => {
    return {
        type: "CHECKMATE",
        payload: winner
    }
}

export const resetGame = () => {
    return {
        type: "RESET_GAME"
    }
}