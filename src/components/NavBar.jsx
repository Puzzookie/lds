import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaHouse, FaUser, FaUserGroup, FaSquarePlus, FaCompass } from "react-icons/fa6";
import { useUser } from "../context/user";

const Navbar = () => {
  const { user } = useUser();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-gray-900 shadow-md">  
      <ul className="flex justify-center items-center h-full w-full px-4 space-x-6 lg:space-x-12"> 
        <div className="flex">
          <li className="2xl:px-10 xl:px-10 lg:px-8 md:px-6 px-2">
            <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-white' : 'text-gray-400'}`}> 
              <FaHouse className={`w-5 h-5 ${location.pathname === `/` ? 'text-white' : 'text-gray-400'}`}/>Home
            </Link>
          </li>
          <li className="2xl:px-10 xl:px-10 lg:px-8 md:px-6 px-2">
            <Link to="/follow" className={`flex flex-col items-center ${location.pathname === '/follow' ? 'text-white' : 'text-gray-400'}`}> 
              <FaUserGroup className={`w-5 h-5 ${location.pathname === `/follow` ? 'text-white' : 'text-gray-400'}`}/>Following
            </Link>
          </li>
          <li className="2xl:px-10 xl:px-10 lg:px-8 md:px-6 px-2">
            <Link to="/create" className={`flex flex-col items-center ${location.pathname === '/create' ? 'text-white' : 'text-gray-400'}`}> 
              <FaSquarePlus className={`w-5 h-5 ${location.pathname === `/create` ? 'text-white' : 'text-gray-400'}`}/>Create
            </Link>
          </li>
          <li className="2xl:px-10 xl:px-10 lg:px-8 md:px-6 px-2">
            <Link to="/discover" className={`flex flex-col items-center ${location.pathname === '/discover' ? 'text-white' : 'text-gray-400'}`}> 
              <FaCompass className={`w-5 h-5 ${location.pathname === `/discover` ? 'text-white' : 'text-gray-400'}`}/>Discover
            </Link>
          </li>
          <li className="2xl:px-10 xl:px-10 lg:px-8 md:px-6 px-2">
            <Link to={`/${user.$id}`} className={`flex flex-col items-center ${location.pathname === `/${user.$id}` ? 'text-white' : 'text-gray-400'}`}> 
              <FaUser className={`w-5 h-5 ${location.pathname === `/${user.$id}` ? 'text-white' : 'text-gray-400'}`}/>Account
            </Link>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;