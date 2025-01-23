import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useModal } from '../context/modal';
import { useUser } from "../context/user";
import { useDatabase } from "../context/database";

import Modal from '../components/Modal';
import Navbar from "../components/NavBar";

const Following = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { userLoading, user } = useUser();
  const maxCharacters = 36;
  const { isModalOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const { databaseLoading, follow, unfollow, following } = useDatabase();

  const [username, setUsername] = useState(''); // State for input

  const navigate = useNavigate();

  const handleUnfollow = async (id) => {
    try {
      await unfollow(id);
    } catch (error) {
      console.log(error);
      openModal({
        title: 'Error',
        message: error.message,
        cancelMessage: 'OK',
        isOpen: true
      });
    }
  };
  
  const handleFollow = async () => {
    try {
      if (!username) {
        throw new Error('Username is required');
      }
      if(username.length > 36)
      {
        throw new Error("Invalid username")
      }
      if(username === user.$id)
      {
        throw new Error("Unable to follow because the username you provided is the currently logged in user");
      }
      const friendName = username;
      setUsername(''); // Clear input after successful follow
      setLoading(true);
      await follow(friendName);
    } catch (error) {
      console.log(error);
      openModal({
        title: 'Error',
        message: error.message,
        cancelMessage: 'OK', 
        isOpen: true
      });
    }
    finally
    {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <Navbar />
      <div className="pb-16 p-4 max-w-xl mx-auto bg-gray-800 h-screen w-full"> 
        {databaseLoading ? ( 
          <div className="h-screen pb-16 flex flex-col justify-center items-center">
            <p className="text-gray-300">Loading...</p>
          </div>
        ) : (
          <> 
            <div className="flex items-center">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="Search username"
                className="text-white p-2 rounded mb-2 mr-1 grow bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                maxLength={maxCharacters} 
              />
              <button onClick={handleFollow}
               className={`w-24 bg-indigo-500 font-semibold hover:bg-indigo-600 text-white p-2 rounded mb-2 focus:outline-none focus:shadow-outline ${loading ? "opacity-50 cursor-not-allowed" : ""}`} 
              >Follow</button>
            </div>
  
            {Object.keys(following).length > 0 ? (
              Object.keys(following).map((id) => (
                <div key={id} className="flex h-16 justify-between bg-gray-700 border border-gray-600 rounded mb-2 rounded items-center mb-2 px-2">
                  <Link to={`/${id}`} className="flex items-center">
                    <img
                      src={`https://cloud.appwrite.io/v1/avatars/initials?name=${id}`}
                      alt="User Avatar"
                      className="rounded-full bg-white h-12 w-12 mr-2"
                    />
                    <span className="text-white flex-grow text-center">{id}</span>
                  </Link>
                  {following[id] ? (
                    <button onClick={() => handleUnfollow(id)} className="p-2 hover:bg-red-600 bg-red-500 text-white rounded">
                      Unfollow
                    </button>
                  ) : (
                    <span className="text-yellow-500">Pending</span>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col rounded items-center"> 
              <p className="text-gray-300">No following found</p>
            </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Following;
