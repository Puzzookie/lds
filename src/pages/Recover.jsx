import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useModal } from '../context/modal';
import { useUser } from "../context/user";

import Modal from '../components/Modal';

const Recover = () => {
    const { userLoading, user, recover } = useUser();

    const { isModalOpen, openModal, closeModal } = useModal();

    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const secret = urlParams.get('secret');

    const handleRecover = async () => {
      try {
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

        if(userId === null || secret === null)
          {
            openModal({
              title: "Error",
              message: "Required parameters not provided",
              cancelMessage: 'OK',
              isOpen: true,
            });
            setLoading(false);
            return;
          }
        
        await recover(userId, secret, password, confirmPassword);
        navigate("/"); 
      } catch (error) {
        openModal({
          title: "Error",
          message: error.message,
          cancelMessage: 'OK',
          isOpen: true,
        });
      }
      finally
      {
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
        handleRecover(); 
      }
    };

    return (
      <div className="flex h-screen bg-gray-800"> 
        <div className="w-full max-w-xs m-auto bg-gray-900 rounded-lg p-5 shadow-md">  
          <header className="flex flex-col items-center justify-center mb-3">
            <img className="mb-2" src="vite.svg" alt="Logo" /> 
            <h3 className="text-white text-center mb-2 text-4xl">Sanctuary</h3>
          </header>
            <form onKeyDown={handleKeyDown}>
              <div>
                <label className="block mb-2 text-gray-100" htmlFor="password">New Password</label>
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
                <label className="block mb-2 text-gray-100" htmlFor="confirmPassword">Re-enter New Password</label>
                <input 
                  className="w-full p-2 mb-5 text-gray-100 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  type="password"
                  name="confirmpassword"
                  id="confirmpassword"
                  autoComplete="off"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  
                  />
              </div>
              <div>     
                <button
              className={`w-full bg-indigo-500 font-semibold hover:bg-indigo-600 text-white py-2 px-4 mb-12 rounded focus:outline-none focus:shadow-outline ${loading ? "opacity-50 cursor-not-allowed" : ""}`} 
              type="button"
                  onClick={handleRecover}
                  disabled={loading}
                >
                  {loading ? "Setting New Password..." : "Set New Password"}
                </button>
              </div>       
            </form>  
            <footer> 
            </footer>
      
          </div>
      </div>
        );
};

export default Recover;