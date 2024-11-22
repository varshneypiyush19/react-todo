import { useState } from "react";
import { Context } from "./main";
import App from "./App";

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  return (
    <Context.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        loading,
        setLoading,
        user,
        setUser,
      }}
    >
      <App />
    </Context.Provider>
  );
};

export default AppWrapper;
