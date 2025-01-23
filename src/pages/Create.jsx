import React, { useState, useEffect } from "react";
import { useDatabase } from "../context/database";
import { useModal } from '../context/modal';
import Navbar from "../components/NavBar";

const Create = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { createPost } = useDatabase();
  const { openModal } = useModal();
  const [myPost, setMyPost] = useState(''); // State for post body
  const [myTitle, setMyTitle] = useState(''); // State for post title
  const [loading, setLoading] = useState(false);

  const maxBodyCharacters = 2048;
  const maxTitleCharacters = 72;

  const handlePost = async () => {
    try {
      if (!myTitle || !myPost) {
        throw new Error('Title and body are required');
      }
      setLoading(true);
      const post = myPost;
      const title = myTitle
      await createPost(title, post);
      openModal({
        title: "Success",
        message: "Post successfully submitted for approval",
        cancelMessage: 'OK',
        isOpen: true,
      });
      setMyTitle('');
      setMyPost('');
    } catch (error) {
      openModal({
        title: "Error",
        message: error.message,
        cancelMessage: 'OK',
        isOpen: true,
      });
    }
    finally
    {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <Navbar />
      <div className="flex flex-col mb-16 p-4 max-w-xl mx-auto w-full min-h-screen pb-20 bg-gray-800"> 
        <input
          type="text"
          value={myTitle}
          onChange={(e) => setMyTitle(e.target.value)}
          placeholder="Enter title"
          className="text-white p-2 rounded mb-2 w-full bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          maxLength={maxTitleCharacters}
        />
        <textarea
          value={myPost}
          onChange={(e) => setMyPost(e.target.value)}
          placeholder="Enter body"
          className="text-white flex-grow p-2 rounded mb-2 w-full min-h-0 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          style={{ resize: 'none' }} // Prevent resizing
          maxLength={maxBodyCharacters}
        />
        <div className="flex justify-between mb-2 text-gray-300">
          <span>{myPost.length}/{maxBodyCharacters}</span>
        </div>
        <button 
          onClick={handlePost} 
          className={`w-full bg-indigo-500 mb-2 font-semibold hover:bg-indigo-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? "opacity-50 cursor-not-allowed" : ""}`} 
          disabled={myPost.length > maxBodyCharacters} // Disable if title is empty or exceeds limits
        >
          {loading ? "Posting..." : "Post"}
        </button>
        <p className="mb-2 text-gray-300">By submitting this post, you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div>
  );
};

export default Create;
