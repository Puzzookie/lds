import { React } from "react";
import { useParams } from 'react-router-dom';
import { useUser } from "../context/user";
import MyFollowers from "./MyFollowers.jsx";
import TheirFollowers from "./TheirFollowers.jsx";

const Followers = () => {
  const { user } = useUser();
  const { profile } = useParams();

  if (user.$id === profile) 
  {
    return <MyFollowers />; 
  } 
  else
  {
    return <TheirFollowers />;
  }
};

export default Followers;
