import { React, useEffect, useState } from "react";
import { useUser } from "../context/user";
import { useDatabase } from "../context/database";
import Navbar from "../components/NavBar";
import { useModal } from '../context/modal';
import { useNavigate, Link } from "react-router-dom";

const Settings = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const { user, deleteAccount, logout } = useUser();
  const { isModalOpen, openModal, closeModal } = useModal();
  const { databaseLoading } = useDatabase();

  const actualDeleteAccount = async () => {
    try {
      await deleteAccount();
    } catch (error) {
      openModal({
        title: "Error",
        message: error.message,
        cancelMessage: 'OK',
        isOpen: true,
      });
    }
  };
  
  const actualLogout = async () => {
    try
    {
      await logout();
      navigate("/");
    }
    catch(error)
    {
      openModal({
        title: "Error",
        message: error.message,
        cancelMessage: 'OK',
        isOpen: true,
      });
    }
  };

  const handleLogout = async () => {
    const modalId = openModal({
      title: "Sign Out",
      message: "Are you sure you want to logout?",
      onAction: async () => { 
        await actualLogout();
        closeModal(modalId);
      },
      cancelMessage: 'No',
      isOpen: true,
    });
  };

  const handleDeleteAccount = async () => {
    const modalId = openModal({
      title: "Permanent account deletion",
      message: "Are you sure you want to delete your account?\nWarning: This cannot be undone",
      onAction: async () => { 
        await actualDeleteAccount();
        closeModal(modalId);
      },
      cancelMessage: 'No',
      isOpen: true, 
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <Navbar />
      <div className="pb-16 p-4 max-w-xl mx-auto w-full bg-gray-800">
        
        <div>
        {databaseLoading ? (
          <div className="h-screen pb-16 flex flex-col justify-center items-center">
          <p className="text-gray-300">Loading...</p>
        </div>
       ) : (
      <div> 
        <div className="flex flex-col rounded items-center"> 
        <button className="flex flex-col rounded items-center"> 
          <img 
            src={`https://cloud.appwrite.io/v1/avatars/initials?name=${user.$id}`} 
            alt="img"
            className="rounded-full bg-white h-20 w-20 mb-2 mt-2" 
          />
         <p className="text-white text-center text-xl mb-2">
          {user.$id}
        </p>
        </button>
        <p className="text-white mb-2">{user.email}</p>
        <p className="text-white mb-2">Joined {new Date(user.$createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}</p>
        <button className="p-2 w-full hover:bg-green-700 bg-green-600 text-white rounded mb-2">Donate</button>
        <button onClick={handleLogout} className="p-2 w-full hover:bg-indigo-600 bg-indigo-500 text-white rounded mb-2">Logout</button>
        <button onClick={handleDeleteAccount} className="p-2 hover:bg-red-600 w-full bg-red-500 text-white rounded">Delete Account</button>
        </div>
        </div>
    )}
  </div>
      </div>
    </div>
  );
};
export default Settings;