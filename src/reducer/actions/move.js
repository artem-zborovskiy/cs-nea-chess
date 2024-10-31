import actionTypes from "./actionTypes";

export const makeMove = ({newPosition}) => {
    return {
        type: actionTypes.MAKE_MOVE,
        payload: {
            newPosition
        }
    };
}