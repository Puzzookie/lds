import React, {useEffect} from "react";
import Navbar from "../components/NavBar";
import Tabs from "../components/Tabs";
import { useModal } from '../context/modal';
import { Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/user";
import { functions } from "../lib/appwrite";

const Home = () => {

  const handleClick = async () => {
    try {

      const promise = functions.createExecution(
        '672a3fb4003b7154f814'
      );
  
      promise.then(function (response) {
        console.log(response.responseBody); // Success
      }, function (error) {
        console.log(error); // Failure
      });
      
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
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

  }, []);
    const { openModal } = useModal();
    return (
      <div className="flex h-screen bg-gray-800"> 
      <div className="w-full max-w-xs m-auto bg-gray-900 rounded-lg p-5 shadow-md"> 
        <Navbar />
       
        <header className="flex flex-col items-center justify-center">
          <img className="mb-2" src="vite.svg" alt="Logo" /> 
          <h3 className="text-white text-center mb-2 text-4xl">Sanctuary</h3>
        </header>
          <div>
            <button
              className={`w-full bg-indigo-500 font-semibold hover:bg-indigo-600 text-white py-2 px-4 mb-12 rounded focus:outline-none focus:shadow-outline`} 
              type="button"
              onClick={handleClick}
            >
             Button
            </button>
          </div>
        <footer>
          <div className="text-center mb-3">
            <Link className="text-gray-400 hover:text-indigo-500 text-md" to="/reset">Load more</Link> 
          </div>
        </footer>
      </div>
    </div>
    );
    
};

export default Home;
