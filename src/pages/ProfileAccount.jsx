import { React } from "react";
import { useParams } from 'react-router-dom';
import { useUser } from "../context/user";
import Account from "./Account.jsx";
import Profile from "./Profile.jsx";
import Loading from "../pages/Loading.jsx"

const ProfileAccount = () => {
  const { userLoading, user } = useUser();
  const { profile } = useParams();

  if(userLoading)
  {
      return <Loading />;
  }

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
