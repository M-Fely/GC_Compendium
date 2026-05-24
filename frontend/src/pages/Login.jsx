import { useState } from "react";
import { loginWithGoogle } from "../services/authService";
import { FcGoogle } from "react-icons/fc";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userData = await loginWithGoogle();

      const allowed =
        userData.email.endsWith("@gordoncollege.edu.ph") ||
        userData.email === "gccompendiumadmin@gmail.com";

      if (!allowed) {
        alert("Only Gordon College accounts are allowed.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(userData));

      onLogin(userData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="loginContainer">
      <div className="login">
        <div className="leftContainer">
          <h2>GC Compendium</h2>
          <p className="welcome">Welcome to GC Compendium!</p>
          <span>
            Your gateway to verified Gordon College knowledge and services.
          </span>
        </div>

        <div className="rightHolder"></div>

        {/* <div className="rightContainer">
        </div> */}
        <form className="rightContainer" onSubmit={(e) => e.preventDefault()}>
          <h1>LOGIN</h1>
          <p>Sign in with your domain account.</p>

          <button type="button" className="googleBtn" onClick={handleLogin}>
            <FcGoogle className="googleIcon" />
            <span>Continue with Google</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

/* const handleSubmit = async (e) => {
  if (e) e.preventDefault();

  if (!email || !password) {
    alert("Invalid input.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Login successful", data);
      onLogin(data);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log("Login Failed");
    alert("Something went wrong");
  } */
