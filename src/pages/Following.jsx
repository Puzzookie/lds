import { React } from "react";
import { useParams } from 'react-router-dom';
import { useUser } from "../context/user";
import Follow from "./Follow.jsx";
import TheirFollowing from "./TheirFollowing.jsx";

const Following = () => {
  const { user } = useUser();
  const { profile } = useParams();

  if (user.$id === profile) 
  {
    return <Follow />; 
  } 
  else
  {
    return <TheirFollowing />;
  }
};

export default Following;
