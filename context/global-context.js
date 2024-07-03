import { createContext, useState } from "react";

export const GlobalContext = createContext();

function GlobalContextProvider({ children }) {
  const [user, setUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  return (
    <GlobalContext.Provider
      value={{ user, setUser, isLoggedIn, setIsLoggedIn, token, setToken }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalContextProvider;
