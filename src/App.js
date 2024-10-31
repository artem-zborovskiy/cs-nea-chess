import { useReducer } from 'react';
import './App.css';

import Board from './components/Board.js';
import AppContext from './context/context.js';

import { reducer } from './reducer/reducer.js';
import { initialGameState } from './constants.js';

function App() {
    const [appState, dispatch] = useReducer(reducer, initialGameState);
    const providerState = {
        appState,
        dispatch
    }

    return (
        <AppContext.Provider value={providerState}>
            <div className="App">
                <Board/>
            </div>
        </AppContext.Provider>
    );
}

export default App;
