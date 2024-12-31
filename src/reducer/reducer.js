import actionTypes from "./actions/actionTypes";

export const reducer = (state, action) => {
    switch(action.type) {
        case actionTypes.MAKE_MOVE: {
            let { turn, position } = state;
            turn === 'w' ? turn = 'b' : turn = 'w';
            position = [...position, action.payload.newPosition];

            return {
                ...state,
                turn,
                position
            }
        }

        case actionTypes.GENERATE_AVAILABLE_MOVES: {
            return {
                ...state,
                availableMoves: action.payload.availableMoves
            }
        }

        case actionTypes.CLEAR_AVAILABLE_MOVES: {
            return {
                ...state,
                availableMoves: []
            }
        }

        default: {
            return state;
        }
    }
}