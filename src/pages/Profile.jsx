
import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import { useUser } from "../context/user";
import { useDatabase } from "../context/database";

import NoMatch from "./NoMatch.jsx"
import Navbar from "../components/NavBar";
import { databases, Query } from "../lib/appwrite";
import Loading from "../pages/Loading.jsx"
import { FaCheck } from "react-icons/fa6";

const Profile = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { user } = useUser();
  const { profile } = useParams();
  const { follow, unfollow } = useDatabase();
  const [profileData, setProfileData] = useState(null); // Store all profile data
  const [lock, setLock] = useState(false);
  const [pageLock, setPageLock] = useState(false);
  const handleFollow = async () => {
    try {

      if(pageLock)
      {
        return;
      }

      if(lock)
      {
        return;
      }      
      
      setPageLock(true);
      setLock(true);

      await follow(profile);

      if (profileData.totalFollowers < 1000) {
        setProfileData(prevData => ({
          ...prevData,
          totalFollowers: prevData.totalFollowers + 1,
          amIFollowing: true
        }));
      } else {
        setProfileData(prevData => ({
          ...prevData,
          amIFollowing: true
        }));
      }

    } catch (error) {
      console.error("Error following user:", error);
    }
    finally {
      setLock(false);
    }
  };

  const handleUnfollow = async () => {
    try {
      if(pageLock)
      {
        return;
      }

      if(lock)
      {
        return;
      }

      setPageLock(true);
      setLock(true);

      await unfollow(profile);
      if (profileData.totalFollowers < 1000) {
        setProfileData(prevData => ({
          ...prevData,
          totalFollowers: prevData.totalFollowers - 1,
          amIFollowing: false
        }));
      }
      else
      {
        setProfileData(prevData => ({
          ...prevData,
          amIFollowing: false
        }));
      }

    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
    finally
    {
      setLock(false);
    }
  };

  function truncateNumber(number) {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000
  ) {
      return (number / 1000).toFixed(1) + 'K';
    } else {
      return number.toString();
    }
  }

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const getTheirFollowersDocument= await databases.getDocument(
          'db',
          'users',
          profile
        )
        
        let numOfFollowers = 0;
        //grab the actual follow database
        const getTheirFollowersCount = await databases.listDocuments(
          'db',
          'follows',
          [
            Query.offset(0),
            Query.limit(1),
            Query.equal('followingId', profile)
          ]
        )
  
        if(getTheirFollowersCount.total === 5000)
        {
          
          numOfFollowers = getTheirFollowersDocument.numOfFollowers;
        }
        else
        {
          numOfFollowers = getTheirFollowersCount.total;
        }
        // change this to work
        const posts = await databases.listDocuments('db', 'posts', [ Query.orderDesc('$createdAt'), Query.offset(0), Query.limit(5), Query.equal('postUserId', profile)]);
        const following = await databases.listDocuments('db', 'follows', [Query.equal('followerId', profile)]);
        const followingRes = await databases.listDocuments('db', 'follows', [
          Query.equal('followingId', profile),
          Query.equal('followerId', user.$id),
        ]);

        const theirPostsObject = {}; 
        posts.documents.forEach(doc => {
          theirPostsObject[doc.$id] = doc;
        });

        setProfileData({
          exists: true,
          theirPosts: theirPostsObject,
          totalFollowing: following.total,
          totalFollowers: numOfFollowers,
          amIFollowing: followingRes.total > 0,
        });
      } catch (err) {
        console.error(err.message);
        setProfileData({ exists: false }); 
      }
    };

    fetchProfileData();
  }, [profile, user.$id]);
  
  if (!profileData) {
    return (
      <div className="flex flex-col h-full bg-gray-800">
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
  else if(profileData.exists === false)
  {
    return (
      <div className="flex flex-col h-full bg-gray-800">
        <Navbar />
        <div className="h-screen pb-16 flex flex-col justify-center items-center">
          <p className='text-white'>Profile doesn't exist</p>
        </div>
      </div>
    );
  }
  else 
  {
    return (
      <div className="flex flex-col h-full bg-gray-800">
        <Navbar />
        <div className="pb-16 p-4 max-w-xl mx-auto w-full bg-gray-800">
        <div> 
          <div className="flex flex-col rounded items-center"> 
            <button className="flex flex-col rounded items-center"> 
              <img 
                src={`https://cloud.appwrite.io/v1/avatars/initials?name=${profile}`} 
                alt="img"
                className="rounded-full bg-white h-20 w-20 mb-2 mt-2" 
              />
            <p className="text-white text-center text-xl mb-2">
              {profile}
            </p>
            </button>

            {profileData.amIFollowing ? (
              <button 
                className={`w-40 h-12 hover:bg-indigo-600 bg-indigo-500 text-white rounded mb-2 ${lock ? "opacity-50" : ""} ${pageLock ? "cursor-not-allowed" : ""}`} 
                onClick={handleUnfollow} 
                disabled={lock}
                >
                {lock ? "..." : (
                  <span className="inline-flex items-center">
                    Following <FaCheck className="ml-1" /> 
                  </span>
                )}

              </button>
            ) : (
              <button 
                className={`w-40 h-12 hover:bg-indigo-600 bg-indigo-500 text-white rounded mb-2 ${lock ? "opacity-50" : ""} ${pageLock ? "cursor-not-allowed" : ""}`} 
                onClick={handleFollow}
                disabled={lock}
              >
               {lock ? "..." : "Follow"}
              </button>
            )}
                        
            <div className="flex mb-2 w-full items-center justify-center"> 
              <Link to={`/${profile}/following`}>
                <button className="w-40 h-14 hover:bg-indigo-600 bg-indigo-500 text-white rounded mr-2">
                  Following<br />{truncateNumber(profileData.totalFollowing)}
                </button>
              </Link>
              <Link to={`/${profile}/followers`}>
                <button className="w-40 h-14 hover:bg-indigo-600 bg-indigo-500 text-white rounded">
                  Followers<br />{truncateNumber(profileData.totalFollowers)}
                </button>
              </Link>
            </div>
          </div>
          {Object.keys(profileData.theirPosts).length === 0 ? (
          <div className="flex flex-col rounded items-center"> 
              <p className="text-gray-300">No posts found</p>
          </div>
        ) : 
        <div className="flex flex-col rounded items-center"> 
          <p className="text-gray-300 mb-2">Recent Posts</p>
        </div>
        }
      {
      Object.entries(profileData.theirPosts).map(([postId, postObject]) => (
        <div className="bg-gray-700 border border-gray-600 mb-2 rounded" key={postId}>
           <div className="bg-gray-700 rounded p-2 flex justify-between items-center">
            <p className="text-white font-semibold">{postObject.title}</p>
          </div>
          <div className="bg-gray-700 rounded p-2 flex justify-between items-center">
            <p className="text-white" style={{ whiteSpace: 'pre-wrap' }}>{postObject.post}</p>
          </div>
          <div className="bg-gray-700 rounded p-2 mb-2 flex justify-between items-center">
            <p className="text-white">
              {new Date(postObject.$createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}{' '}
              {new Date(postObject.$createdAt).toLocaleTimeString('en-US', {
                timeStyle: 'short',
                hour12: true
              })}
            </p>
          </div>
        </div>
      ))}

      {Object.keys(profileData.theirPosts).length >= 5 ? (
        <Link to={`/${profile}/posts`}>
          <button className="p-2 w-full bg-indigo-500 text-white rounded mb-2">
            View All
          </button>
        </Link>
      ) : null}

        </div>
        </div>
      </div>
    );
  }
};

export default Profile;
