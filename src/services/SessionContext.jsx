import React, { createContext, useState } from "react";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token")); 
  const [userName, setUserName] = useState(localStorage.getItem("name") || ""); 

  return (
    <SessionContext.Provider value={{ isLoggedIn, setIsLoggedIn, userName, setUserName }}>
      {children}
    </SessionContext.Provider>
  );
};
