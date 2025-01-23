
import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import { useUser } from "../context/user";
import NoMatch from "./NoMatch.jsx"
import Navbar from "../components/NavBar";
import { databases, Query } from "../lib/appwrite";
import Loading from "../pages/Loading.jsx"

const MyFollowers = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { user } = useUser();
  const { profile } = useParams();
  const [followers, setFollowers] = useState(null); // Store all profile data

  useEffect(() => {
    const fetchFollowers = async () => {
      try {

        const getFollowers = await databases.listDocuments('db', 'follows', [
          Query.equal('followingId', profile),
          Query.limit(15),
          Query.offset(0)
        ]);

        const followerIds = getFollowers.documents.map(item => item.followerId);
        const followerObject = followerIds.reduce((acc, id) => {
          acc[id] = true;
          return acc;
        }, {});
        setFollowers(followerObject);
       
      } catch (err) {
          console.log(error);
      }
    };

    fetchFollowers();
  }, [profile, user.$id]);
  
  if (!followers) {
    return (
      <div className="flex flex-col h-screen bg-gray-800">
        <Navbar />
        <div className="pb-16 p-4 max-w-xl mx-auto w-full bg-gray-800">
          <div> 
            <div className="h-screen pb-16 flex flex-col justify-center items-center">
              <p className="text-gray-300">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  else 
  {

    return (
      <div className="flex flex-col h-screen bg-gray-800">
        <Navbar />
        <div className="pb-16 p-4 max-w-xl mx-auto w-full bg-gray-800">
            <p className="mb-2 text-white">People Following Me</p>
            {Object.keys(followers).length > 0 ? (
                Object.keys(followers).map((id) => (
                  <div key={id} className="flex h-16 justify-between bg-gray-700 border border-gray-600 rounded mb-2 rounded items-center mb-2 px-2">
                    <Link to={`/${id}`} className="flex items-center"> {/* Wrap image in Link */}
                      <img
                        src={`https://cloud.appwrite.io/v1/avatars/initials?name=${id}`}
                        alt="User Avatar"
                        className="rounded-full bg-white h-12 w-12 mr-2"
                      />
                      <span className="flex-grow text-white text-center">{id}</span>
                    </Link>
                    <Link to={`/${id}`} className="p-2 bg-indigo-500 text-white rounded"> 
                      View Profile 
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No followers found</p>
              )}
        </div>
      </div>
    );
  }
};

export default MyFollowers;
