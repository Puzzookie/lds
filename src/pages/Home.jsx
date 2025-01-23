import React, {useEffect} from "react";
import { useDatabase } from "../context/database";
import Navbar from "../components/NavBar";
import { useModal } from '../context/modal';
import { Link } from "react-router-dom";

const Home = () => {
  const { databaseLoading, myFriendsPosts, loadMoreMyFriendsPosts, lastFriendsPostsDocumentId } = useDatabase();

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log(myFriendsPosts);
    const x = Object.entries(myFriendsPosts);
  }, []);
    const { openModal } = useModal();
    
    const handleLoadMore = async () => {
      try {
       await loadMoreMyFriendsPosts();
       
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
      <div className="flex flex-col h-full bg-gray-800">
      <Navbar />
        <div className="pb-16 p-4 max-w-xl mx-auto w-full bg-gray-800">
          {databaseLoading ? 
            (
              <div className="h-screen pb-16 flex flex-col justify-center items-center">
                <p className="text-gray-300">Loading...</p>           
              </div>
            ) : Object.keys(myFriendsPosts).length === 0 ? 
            (
              <div className="pb-16 h-screen flex flex-col justify-center items-center">
                <p className="text-gray-300">Your feed is empty for now! Follow other users to see their posts here and get connected.</p>
              </div>

            ) : 
            (
              <>
                {Object.entries(myFriendsPosts).map(([userId, postObject]) => (
                  <div className="bg-gray-700 border border-gray-600 mb-2 rounded" key={userId}>
                    <div className="bg-gray-700 rounded p-2 flex justify-between items-center">
                      <p className="text-white font-semibold">{postObject.lastPostTitle}</p>
                    </div>
                    <div className="bg-gray-700 rounded p-2 flex justify-between items-center">
                      <p className="text-white" style={{ whiteSpace: 'pre-wrap' }}>{postObject.lastPostBody}</p>
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
                        <Link to={`/${postObject.$id}`} className="flex items-center">
                        <button className="w-full h-12 hover:bg-indigo-600 bg-indigo-500 text-white rounded p-2">
                            <p>{postObject.$id}</p>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                {lastFriendsPostsDocumentId && ( // Conditionally render the Load More button
                  <button 
                    onClick={handleLoadMore} 
                    className={`w-full bg-indigo-500 font-semibold hover:bg-indigo-600 text-white py-2 px-4 rounded mb-2 focus:outline-none focus:shadow-outline`} 
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

export default Home;
