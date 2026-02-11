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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Get users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Check for hardcoded admin or registered users
    const userFound = (username === "admin" && password === "12345") ||
      storedUsers.find(u => u.username === username && u.password === password);

    if (userFound) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", username);
      onLogin();                  // notify App.js that login succeeded
      navigate("/dashboard");     // redirect to Dashboard
    } else {
      alert("Invalid username or password");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    if (storedUsers.find(u => u.username === username)) {
      alert("Username already exists!");
      return;
    }

    const newUser = { username, password };
    storedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(storedUsers));

    alert("Account created successfully! You can now login.");
    setIsRegistering(false);
    setPassword("");
    setConfirmPassword("");
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
      <form className="login-form" onSubmit={isRegistering ? handleRegister : handleLogin}>

        <h2><LoginIcon className="login_icon" />{isRegistering ? "Register" : "Login"} </h2>
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

        {isRegistering && (
          <div className="form-group">
            <label><PasswordIcon className="password_icon" />Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}

        {!isRegistering && (
          <div className="form-group forgot-password">
            <span onClick={handleForgotPassword}>Forgot Password?</span>
          </div>
        )}

        <button type="submit" className="login-btn" style={{ marginLeft: "4px" }}>
          {isRegistering ? "Register" : "Login"}
        </button>

        <div className="toggle-auth" style={{ marginTop: "15px", textAlign: "center", fontSize: "14px" }}>
          {isRegistering ? (
            <span>
              Already have an account?{" "}
              <span className="auth-link" onClick={() => setIsRegistering(false)} style={{ color: "#007bff", cursor: "pointer" }}>
                Login
              </span>
            </span>
          ) : (
            <span>
              Don't have an account?{" "}
              <span className="auth-link" onClick={() => setIsRegistering(true)} style={{ color: "#007bff", cursor: "pointer" }}>
                Create Account
              </span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

export default Login;
