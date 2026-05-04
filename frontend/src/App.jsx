import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (email, password) => {
    if (email === "admin@gc.com" && password === "Admin050226") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    setLoggedIn(true);
  };

  return (
    <>
      {!loggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard isAdmin={isAdmin} />
      )}
    </>
  );
}

export default App;
