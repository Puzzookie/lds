import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useModal } from '../context/modal';
import { useUser } from "../context/user";

import Modal from '../components/Modal';

function Register() {
  const { userLoading, user, register } = useUser();

  const { isModalOpen, openModal, closeModal } = useModal();

  const navigate = useNavigate();

  const resetToDefault = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);

    if (password !== confirmPassword) {
      openModal({
        title: "Error",
        message: "Passwords don't match",
        cancelMessage: 'OK',
        isOpen: true,
      });
      setLoading(false);
      return;
    }

    if(username.length < 5)
    {
      openModal({
        title: "Error",
        message: "Username must be at least 5 characters in length",
        cancelMessage: 'OK',
        isOpen: true,
      });
      setLoading(false);
      return;
    }

    if(username.length > 25)
      {
        openModal({
          title: "Error",
          message: "Username can only be a maximum of 25 characters in length",
          cancelMessage: 'OK',
          isOpen: true,
        });
        setLoading(false);
        return;
      }

    /*login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/reset" element={<Reset />} />
    <Route path="/recover" element={<Recover />} />
    <Route path="/verify*/
    if(username === "register" || username === "reset" || username === "recover" || username === "verify" || username === "follow" || username === "create" || username === "settings" || username === "discover")
    {
        openModal({
        title: "Error",
        message: "Username is not allowed",
        cancelMessage: 'OK',
        isOpen: true,
      });
      setLoading(false);
      return;
    }

    try {
      await register(username, email, password);
      openModal({
        title: "Success",
        message: "Registration request sent successfully. Please login to continue",
        cancelMessage: 'OK',
        isOpen: true,
      });

      resetToDefault();

    } catch (error) {
      console.error(error);
      openModal({
        title: "Error",
        message: error.message,
        cancelMessage: 'OK',
        isOpen: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default form submission
      if(isModalOpen)
      {
        return;
      }
      handleRegister(); // Call the login function
    }
  };

  return (

    <div className="flex h-screen bg-gray-800"> 
      <div className="w-full max-w-xs m-auto bg-gray-900 rounded-lg p-5 shadow-md">  
      <header className="flex flex-col items-center justify-center">
          <img className="mb-2" src="vite.svg" alt="Logo" /> 
          <h3 className="text-white text-center mb-2 text-4xl">Sanctuary</h3>
        </header>
        <form onKeyDown={handleKeyDown}>
          <div>
            <label className="block mb-2 text-gray-100" htmlFor="username">
              Username
            </label>
            <input
              className="w-full p-2 mb-5 text-gray-100 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              name="username"
              id="username"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-100" htmlFor="email">
              Email
            </label>
            <input
              className="w-full p-2 mb-5 text-gray-100 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="email"
              name="email"
              id="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-100" htmlFor="password">
              Password
            </label>
            <input
              className="w-full p-2 mb-5 text-gray-100 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              name="password"
              id="password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-100" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="w-full p-2 mb-5 text-gray-100 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              autoComplete="off"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              className={`w-full bg-indigo-500 font-semibold hover:bg-indigo-600 text-white py-2 px-4 mb-12 rounded focus:outline-none focus:shadow-outline ${loading ? "opacity-50 cursor-not-allowed" : ""}`} 
              type="button"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
        <footer>
          <div className="text-center mb-5">
            <Link
              className="text-gray-400 hover:text-indigo-500 text-md"
              to="/login"
            >
              Already have an account? Login
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Register;
