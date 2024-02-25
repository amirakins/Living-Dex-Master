import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./container/Login.jsx";
import Register from "./container/Register.jsx";
import UserData from "./container/UserData.jsx";
import Profile from "./container/Profile.jsx";
import UserDataCaptured from "./container/UserDataCaptured.jsx";
import UserDataNotCaptured from "./container/UserDataNotCaptured.jsx";
import { apiUrl } from "./apiUrl.js";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there is a token stored in localStorage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setAuthToken(storedToken);
    }
  }, []);

  const loginUser = async (userData) => {
    try {
      const response = await axios.post(
        `${apiUrl}/auth/login`,
        userData
      );
      const token = response.data.token;
      // Store the authentication token in localStorage
      localStorage.setItem("token", token);
      setAuthToken(token);
    } catch (error) {
      throw error;
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await axios.post(
        `${apiUrl}/auth/register`,
        userData
      );
      // Store the authentication token in localStorage
      localStorage.setItem("token", response.data.token);
      setAuthToken(response.data.token);
      navigate("/home");
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  const handleLogout = () => {
    // Optionally, clear the token from local storage or session storage
    localStorage.removeItem("token");
    setAuthToken(null);
    navigate("/login");
  };
  return (
    <>
      <Routes>
        <Route path="/" element={<Login loginUser={loginUser} />}></Route>
        <Route
          path="/register"
          element={<Register registerUser={registerUser} />}
        ></Route>
        <Route path="/login" element={<Login loginUser={loginUser} />}></Route>
        <Route
          path="/home"
          element={<UserData authToken={authToken} onLogout={handleLogout} />}
        ></Route>
        <Route
          path="/home/captured"
          element={
            <UserDataCaptured authToken={authToken} onLogout={handleLogout} />
          }
        ></Route>
        <Route
          path="/home/not-captured"
          element={
            <UserDataNotCaptured
              authToken={authToken}
              onLogout={handleLogout}
            />
          }
        ></Route>
        <Route
          path="/profile"
          element={<Profile authToken={authToken} onLogout={handleLogout}/>}
        ></Route>
      </Routes>
    </>
  );
};

export default App;
