import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/user";
import { useNavigate } from "react-router-dom";
import { useModal } from '../context/modal';

const Verify = () => {
    const { userLoading, user, verify } = useUser();
    const { isModalOpen, openModal, closeModal } = useModal();

    const navigate = useNavigate();

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const secret = urlParams.get('secret');

    const handleVerify = async () => {
      try {
        await verify(userId, secret);
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
        navigate("/"); 
      }
    };
    useEffect(() => {
        handleVerify();
    }, []);

    return (
      <div className="flex h-screen bg-gray-800"> 
        <div className="w-full max-w-xs m-auto bg-gray-900 rounded-lg p-5 shadow-md">  
          <header className="flex flex-col items-center justify-center mb-3">
            <img className="mb-2" src="vite.svg" alt="Logo" /> 
            <h3 className="text-white text-center mb-2 text-4xl">Sanctuary</h3>
          </header>
            <form>
              <div>   
              <div className="text-center mb-3"> 
                <p className="text-gray-400 text-md">Please wait...</p>
                <p className="text-gray-400 text-md">Verifying email...</p>
                <p className="text-gray-400 text-md">You will be redirected to login soon</p>

              </div>   
              </div>       
            </form>  
            <footer> 
            </footer>
      
          </div>
      </div>
        );

        
};

export default Verify;