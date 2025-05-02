// Import the required functions from React.
import { createContext, useContext } from "react";

// Create a new context object. This will hold global state that can be shared across components.
const BoardContext = createContext();

// Create a custom hook to access the BoardContext more easily from other components.
// This simplifies the use of useBoardContext(BoardContext) wherever it's needed.
export const useBoardContext = () => {
    return useContext(BoardContext);
}

// Export the context itself, which will be used to provide values to components (via a Provider).
export default BoardContext;