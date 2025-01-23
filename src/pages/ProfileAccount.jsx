import { React } from "react";
import { useParams } from 'react-router-dom';
import { useUser } from "../context/user";
import Account from "./Account.jsx";
import Profile from "./Profile.jsx";

const ProfileAccount = () => {
  const { user } = useUser();
  const { profile } = useParams();

  if (user.$id === profile) 
  {
    return <Account />; 
  } 
  else
  {
    return <Profile />;
  }
};

export default ProfileAccount;
