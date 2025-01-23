import { React, useEffect, useState } from "react";
import { useUser } from "../context/user";
import { useDatabase } from "../context/database";
import Navbar from "../components/NavBar";
import { useModal } from '../context/modal';
import { Link } from "react-router-dom";

const Account = () => {
  const { user } = useUser();
  const { databaseLoading, deletePost, myPosts, following, myFollowersCount } = useDatabase();
  const { openModal, closeModal } = useModal();
  const [randomColor, setRandomColor] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    setRandomColor(color);
  }, []);

  const actualDeletePost = async (postId) => {
    try
    {
        await deletePost(postId);
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

  const handleDeletePost = async (postId, postTitle) => {

    const modalId = openModal({
      title: "Delete Confirmation",
      message: "Are you sure you want to delete the post entitled '" + postTitle + "'?",
      onAction: async () => { 
        await actualDeletePost(postId);
        closeModal(modalId);
      },
      cancelMessage: 'No',
      isOpen: true,
    });
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

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <Navbar />
      <div className="pb-16 p-4 max-w-xl mx-auto w-full h-full bg-gray-800">
        <div>
        {databaseLoading ? (
          <div className="h-screen pb-16 flex flex-col justify-center items-center">
              <p className="text-gray-300">Loading...</p>
          </div>
       ) : (
      <div> 
        <div className="flex flex-col rounded items-center h-full"> 
        <button className="flex flex-col rounded items-center"> 
        <div
      style={{
        width: '50px',
        height: '50px',
        backgroundColor: randomColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        color: 'white', // Adjust text color for better contrast
      }}
    >
      {user.$id ? user.$id.charAt(0) : ''}
    </div>
         <p className="text-white text-center text-xl mb-2">
          {user.$id}
        </p>
        </button>

        <Link to={`/settings`}>
          <button className="w-40 h-12 bg-indigo-500 hover:bg-indigo-600 text-white rounded mb-2">
            Account Settings<br />
          </button>
         </Link>
        <div className="flex mb-2 w-full items-center justify-center"> 
          <Link to={`/${user.$id}/following`}>
            <button className="w-40 h-14 bg-indigo-500 hover:bg-indigo-600 text-white rounded mr-2">
              Following<br />{truncateNumber(Object.keys(following).length)}
            </button>
          </Link>
          <Link to={`/${user.$id}/followers`}>
            <button className="w-40 h-14 bg-indigo-500 hover:bg-indigo-600 text-white rounded">
              Followers<br />{truncateNumber(myFollowersCount)}
            </button>
          </Link>
        </div>
        </div>
        {Object.keys(myPosts).length === 0 ? (
          <div className="flex flex-col rounded items-center"> 
              <p className="text-gray-300">No posts found</p>
          </div>
        ) : 
        <div className="flex flex-col rounded items-center"> 
          <p className="text-gray-300 mb-2">Recent Posts</p>
        </div>
        }
      {
      Object.entries(myPosts).map(([postId, postObject]) => (
        <div className="bg-gray-700 border border-gray-600 mb-2 rounded" key={postId}>
           <div className="bg-gray-700 rounded p-2 flex justify-between items-center">
            <p className="text-white font-semibold">{postObject.postTitle}</p>
          </div>
          <div className="bg-gray-700 rounded p-2 flex justify-between items-center">
            <p className="text-white" style={{ whiteSpace: 'pre-wrap' }}>{postObject.postBody}</p>
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
            {postObject.pending ? (
                  <span className="text-yellow-500">Pending</span>
                ) : (
                <button
                  onClick={() => handleDeletePost(postId, postObject.title)}
                  className="p-2 hover:bg-red-600 bg-red-500 text-white rounded"
                >
                  Delete
                </button> 
               )}
              
            </div>
          </div>
        </div>
      ))}

      {Object.keys(myPosts).length >= 5 ? (
        <Link to={`/${user.$id}/posts`}>
          <button className="p-2 w-full bg-indigo-500 text-white rounded mb-2">
            View All
          </button>
        </Link>
      ) : null}
      </div>
    )}
  </div>
      </div>
    </div>
  );
};
export default Account;