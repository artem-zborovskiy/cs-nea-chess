import actionTypes from "./actionTypes";

export const makeMove = ({newPosition}) => {
    return {
        type: actionTypes.MAKE_MOVE,
        payload: {
            newPosition
        }
    };
}

export const generateAvailableMoves = ({availableMoves}) => {
    return {
        type: actionTypes.GENERATE_AVAILABLE_MOVES,
        payload: {
            availableMoves
        }
    };
}

export const clearAvailableMoves = () => {
    return {
        type: actionTypes.CLEAR_AVAILABLE_MOVES,
    };
}