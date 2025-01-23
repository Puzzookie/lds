import React, { useState, useEffect } from "react";
import { useUser } from "../context/user";
import { useDatabase } from "../context/database";
import Navbar from "../components/NavBar";
import { useModal } from '../context/modal';
import { Link } from "react-router-dom";

const Discover = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
    const { user } = useUser();
    const { databaseLoading, allPosts, loadMoreAllPosts, lastAllPostsDocumentId} = useDatabase();
    const { isModalOpen, openModal, closeModal } = useModal();

    const handleLoadMore = async () => {
      try {
       await loadMoreAllPosts();
      } catch (error) {
        openModal({
          title: "Error",
          message: error.message,
          cancelMessage: 'OK',
          isOpen: true,
        });
      }
    };

    return (
      <div className="flex flex-col h-screen bg-gray-800">
        <Navbar />
        <div className="pb-16 p-4 max-w-xl mx-auto bg-gray-800 w-full">
          {databaseLoading ? 
            (
              <div className="h-screen pb-16 flex flex-col justify-center items-center">
                <p className="text-gray-300">Loading...</p>
              </div>
            ) : Object.keys(allPosts).length === 0 ? 
            (
              <div className="h-screen pb-16 flex flex-col justify-center items-center">
                <p className="text-gray-300">No posts found</p>
              </div>
            ) : 
            (
              <>
                {Object.entries(allPosts).map(([postId, postObject]) => (
                  <div className="bg-gray-700 border border-gray-600 mb-2 rounded" key={postId}>
                    <div className="bg-gray-700 rounded p-2 flex justify-between items-center">
                      <p className="text-white font-semibold">{postObject.title}</p>
                    </div>
                    <div className="bg-gray-700 rounded p-2 flex justify-between items-center">
                      <p className="text-white" style={{ whiteSpace: 'pre-wrap' }}>{postObject.post}</p>
                    </div>
                    <div className="bg-gray-700 rounded p-2 flex justify-between items-center">
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
                        <Link to={`/${postObject.postUserId}`} className="flex items-center">
                          <button className="w-full h-12 hover:bg-indigo-600 bg-indigo-500 text-white rounded p-2">
                            <p>{postObject.postUserId}</p>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                {lastAllPostsDocumentId && ( // Conditionally render the Load More button
                  <button 
                    onClick={handleLoadMore} 
                    className={`w-full bg-indigo-500 font-semibold hover:bg-indigo-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2`} 
                    >
                    Load More Posts
                  </button>
                )}
              </>
            )}
        </div>
      </div>
    );
    
    
};

export default Discover;
