import { createContext, useContext } from "react";

const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
}

export default AppContext;