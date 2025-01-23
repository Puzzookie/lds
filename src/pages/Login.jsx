import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useModal } from '../context/modal';
import { useUser } from "../context/user";

import Modal from '../components/Modal';

const Login = () => {
  const { isModalOpen, openModal, closeModal } = useModal();

  const [loading, setLoading] = useState(false);

  const { login } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (error) {
      if (error.message === 'A verification email sent. Please check your email') {
        openModal({
          title: "Action required",
          message: error.message,
          cancelMessage: 'OK',
          isOpen: true,
        });
      } else {
        openModal({
          title: "Error",
          message: error.message,
          cancelMessage: 'OK',
          isOpen: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if(isModalOpen)
        {
          return;
        }
      handleLogin();
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
            <label className="block mb-2 text-gray-100" htmlFor="email">Email</label> 
            <input
              className="w-full p-2 mb-5 text-gray-100 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              type="email"
              name="email"
              id="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-100" htmlFor="password">Password</label> 
            <input
              className="w-full p-2 mb-7 text-gray-100 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              type="password"
              name="password"
              id="password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              className={`w-full bg-indigo-500 font-semibold hover:bg-indigo-600 text-white py-2 px-4 mb-12 rounded focus:outline-none focus:shadow-outline ${loading ? "opacity-50 cursor-not-allowed" : ""}`} 
              type="button"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
        <footer>
          <div className="text-center mb-3">
            <Link className="text-gray-400 hover:text-indigo-500 text-md" to="/reset">Forgot password? Reset</Link> 
          </div>
          <div className="text-center mb-5">
            <Link className="text-gray-400 hover:text-indigo-500 text-md" to="/register">Don't have an account? Register</Link> 
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Login;
