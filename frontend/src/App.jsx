/* import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  const handleLogin = (result) => {
    if (result.success) {
      setLoggedIn(true);
      setRole(result.role);
    } else {
      setLoggedIn(false);
      setRole("");
    }
  };

  return (
    <>
      {!loggedIn ? <Login onLogin={handleLogin} /> : <Dashboard role={role} />}
    </>
  );
}

export default App;
 */

import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const adminEmails = ["gccompendiumadmin@gmail.com"];

  const handleLogin = (userData) => {
    setLoggedIn(true);

    const adminCheck = adminEmails.includes(userData.email);

    setIsAdmin(adminCheck);
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
