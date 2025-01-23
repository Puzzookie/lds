
import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import { useUser } from "../context/user";
import { useDatabase } from "../context/database";
import { useModal } from '../context/modal';
import NoMatch from "./NoMatch.jsx"
import Navbar from "../components/NavBar";
import { databases, Query } from "../lib/appwrite";
import Loading from "../pages/Loading.jsx"
import { FaCheck } from "react-icons/fa6";

const Posts = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { user } = useUser();
  const { profile } = useParams();
  const [profileData, setProfileData] = useState(null); // Store all profile data
  const [lastDocumentId, setLastDocumentId] = useState(null); // ID of the last document
  const { deletePost } = useDatabase();
  const { isModalOpen, openModal, closeModal } = useModal();
  const [canLoadMore, setCanLoadMore] = useState(true);

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);

      
      setProfileData(prevProfileData => {
        if (prevProfileData.exists && prevProfileData.theirPosts.hasOwnProperty(postId)) {
          const updatedTheirPosts = { ...prevProfileData.theirPosts };
          delete updatedTheirPosts[postId]; 
          return {
            ...prevProfileData,
            theirPosts: updatedTheirPosts,
          };
        }
        return prevProfileData; 
      });

      if (postId === lastDocumentId) 
      {
        const newLastDocId = profileData.theirPosts;
        const keys = Object.keys(newLastDocId);
        if(keys.length - 2 >= 0)
          {
            const lastKey = keys[keys.length - 2]; 
            setLastDocumentId(lastKey);
          }
          else
          {
            setLastDocumentId(null);
          }
      }
      
    } catch (error) {
      openModal({
        title: "Error",
        message: error.message,
        cancelMessage: 'OK',
        isOpen: true,
      });
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
        await handleLoadMore();
    };
    fetchProfileData();
  }, [profile]); 

  const handleLoadMore = async () => {
    try {
      let posts = null;
      if(lastDocumentId)
      {
        posts = await databases.listDocuments(
          'db',
          'posts',
          [
            Query.orderDesc('$createdAt'),
            Query.limit(1),
            Query.cursorAfter(lastDocumentId),
            Query.equal('postUserId', profile)
          ]
        );
      }
      else
      {
        posts = await databases.listDocuments(
          'db',
          'posts',
          [
            Query.orderDesc('$createdAt'),
            Query.limit(1),
            Query.equal('postUserId', profile)
          ]
        );
      }

      if(posts.documents.length === 0)
      {
        setCanLoadMore(false);
      }

      console.log(posts.documents.length);

      const theirPostsObject = { ...(profileData?.theirPosts || {}) }; // Maintain existing posts
      posts.documents.forEach(doc => {
        theirPostsObject[doc.$id] = doc;
      });

      setProfileData({
        exists: true,
        theirPosts: theirPostsObject,
      });
      setLastDocumentId(posts.documents[posts.documents.length - 1]?.$id);
    } catch (err) {
      console.error(err.message);
      setProfileData({ exists: false });
    }

  };
  

  if (!profileData) {
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
  else if(profileData.exists === false)
  {
    return (
      <div className="flex flex-col h-screen bg-gray-800">
        <Navbar />
        <div className="pb-16 p-4 max-w-xl mx-auto w-full bg-gray-800">
          <p className='text-white'>Profile doesn't exist</p>
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
        <div> 
        <p className="text-white mb-2">{profile} posts</p>

          <div className="flex flex-col rounded items-center"> 
          {
      Object.entries(profileData.theirPosts).map(([postId, postObject]) => (
        <div className="bg-gray-700 mb-2 border border-gray-600 mb-2 rounded w-full" key={postId}>
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
            <div className="flex justify-between items-center">
            {postObject.postUserId === user.$id ? ( // Check if post belongs to user
              <button
                onClick={() => handleDeletePost(postId)}
                className="p-2 hover:bg-red-600 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            ) : (
              <Link to={`/${postObject.postUserId}`} className="flex items-center">
                <button className="w-full h-12 hover:bg-indigo-600 bg-indigo-500 text-white rounded p-2">
                  <p>{postObject.postUserId}</p>
                </button>
              </Link>
            )}
            </div>
          </div>
        </div>
      ))}
      </div>


      {
        canLoadMore ? (
          <button
            className="p-2 w-full hover:bg-indigo-600 bg-indigo-500 text-white rounded mb-2"
            onClick={handleLoadMore}
          >
            Load More
          </button>
        ) : 
        Object.keys(profileData.theirPosts).length === 0 ? 
        (
          <div className="flex flex-col rounded items-center"> 
              <p className="text-gray-300">No posts found</p>
          </div>
        ) : null
      }
      

        </div>
        </div>
      </div>
    );
  }
};

export default Posts;
