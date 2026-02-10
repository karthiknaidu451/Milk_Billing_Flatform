import React, { useState } from "react";
import "./pages/login.css"
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import PasswordIcon from '@mui/icons-material/Password';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react'; 


function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const loginData = {
      username,
      password,
    };

    localStorage.setItem("loginData", JSON.stringify(loginData));
    alert("Data saved to localStorage");

    if (username === "admin" && password === "12345") {
      localStorage.setItem("isLoggedIn", "true");
      onLogin();                  // notify App.js that login succeeded
      navigate("/dashboard");     // redirect to Dashboard
    } else {
      alert("Invalid username or password");
    }
  };

  const handleForgotPassword = () => {
    alert("Redirect to forgot password page!");
  };

  return (

    <div className="login-container">
      <div className="lottie-animation">
        <Lottie
          animationData={require("../src/Milk.json")} // path to public folder
          loop={true}
        />
      </div>
      <form className="login-form" onSubmit={handleLogin}>

        <h2><LoginIcon className="login_icon" />Login </h2>
        <div className="form-group">
          <label><PersonIcon className="person_icon" />Username</label>
          <input
            type="text"

            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label><PasswordIcon className="password_icon" />Password</label>
          <input
            type="password"

            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group forgot-password">
          <span onClick={handleForgotPassword}>Forgot Password?</span>
        </div>
        <button type="submit" className="login-btn" style={{ marginLeft: "4px" }}>Login</button>
      </form>
    </div>
  );
}

export default Login;
