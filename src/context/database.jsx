import { createContext, useContext, useEffect, useState } from "react";
import { databases, Query, ID } from "../lib/appwrite";
import { useUser } from "./user";

const DatabaseContext = createContext();

export function useDatabase() {
  return useContext(DatabaseContext);
}

export function DatabaseProvider(props) {
  const { user } = useUser();
  
  const [allPosts, setAllPosts] = useState({});
  const [myFriendsPosts, setMyFriendsPosts] = useState({});
  const [myPosts, setMyPosts] = useState({});
  const [following, setFollowing] = useState({});
  const [myFollowersCount, setMyFollowersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFriendsPostsDocumentId, setLastFriendsPostsDocumentId] = useState(null); // ID of the last document
  const [lastAllPostsDocumentId, setLastAllPostsDocumentId] = useState(null); // ID of the last document

  function getCurrentTimeInDesiredFormat() {
    const date = new Date();
    const isoString = date.toJSON().replace('Z', '+00:00');
    return isoString.toString();
  }

  async function follow(friend) {
    if (!user || user.$id === friend || Object.keys(following).length >= 5000) {
      return;
    }
  
    try {
  
      //Ensure this is a user that exists
      await databases.getDocument(
        'db', 
        'users',
        friend
      );

      //Add it to your following
      await databases.createDocument(
        'db', // databaseId
        user.$id + "-following",
        friend,
        {added: true}, // data
      );

        setFollowing((prevFollowing) => ({
          ...prevFollowing,
          [friend]: false,
        }));
  
    } catch (err) {
      console.log(err.message);
      if(err.message === "Document with the requested ID could not be found.")
      {
        throw new Error("User doesn't exist")
      }
      throw new Error(err);
    } 
  }
  

  async function unfollow(friend) {
    if (!user) {
      return;
    }
  
    try {
  
      // Remove friend from the following object
      setFollowing((prevFollowing) => {
        const newFollowing = { ...prevFollowing };
        delete newFollowing[friend]; // Remove the friend
        return newFollowing;
      });
  
      await databases.updateDocument(
        'db',
        'follow-proxy',
        user.$id,
        {
          userIdToFollow: friend,
        }
      );
  

    } catch (err) {
      console.log(err);
    }
  }
  

  async function createPost(title, post) 
  {
    
    const uniqueId = ID.unique();

    await databases.createDocument(
      'db',
      user.$id + "-posts",
      uniqueId,
      {
        postId: uniqueId,
        postTitle: title,
        postBody: post,
        approved: false
      }
    );

    let postObj = {};
    postObj[uniqueId] = {
      postBody: post,
      $id: user.$id,
      postTitle: title,
      $createdAt: getCurrentTimeInDesiredFormat(),
      pending: true
    };

    setMyPosts(prevPosts => ({ ...postObj, ...prevPosts })); 
  }

  async function deletePost(postId)
  {
    await databases.deleteDocument(
      'db',
      'posts',
      postId
    );

    setMyPosts(prevPosts => {
      const updatedPosts = { ...prevPosts };
      if (postId in updatedPosts) {
        delete updatedPosts[postId];
      }
      return updatedPosts;
    });
  }

  async function reset()
  {
    setFollowing({});
    setMyPosts({});
    setMyFriendsPosts({});
  }

  async function loadMoreMyFriendsPosts() {
    try {
      if (lastFriendsPostsDocumentId) {
        const followingIds = Object.keys(following); // Use 'following' state to get following IDs
  
        const getMyFriendsPosts = await databases.listDocuments(
          'db',
          'posts',
          [
            Query.cursorAfter(lastFriendsPostsDocumentId),
            Query.limit(1), // Fetch more than 1 for better UX
            Query.orderDesc('$createdAt'),
            Query.equal('postUserId', followingIds),
          ]
        );
  
        if (getMyFriendsPosts.documents.length > 0) {
          const newFriendsPostsObject = {};
          getMyFriendsPosts.documents.forEach(doc => {
            newFriendsPostsObject[doc.$id] = doc;
          });
  
          setMyFriendsPosts(prevPosts => ({
            ...prevPosts,
            ...newFriendsPostsObject,
          }));
  
          setLastFriendsPostsDocumentId(getMyFriendsPosts.documents[getMyFriendsPosts.documents.length - 1]?.$id);
        }
        else
        {
          setLastFriendsPostsDocumentId(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  
  async function loadMoreAllPosts() {
    try {
      if (lastAllPostsDocumentId) {
        const getAllPosts = await databases.listDocuments(
          'db',
          'posts',
          [
            Query.cursorAfter(lastAllPostsDocumentId),
            Query.limit(1), // Fetch more than 1 for better UX
            Query.orderDesc('$createdAt'),
            Query.notEqual('postUserId', user.$id),
          ]
        );
  
        if (getAllPosts.documents.length > 0) {
          const newAllPostsObject = {};
          getAllPosts.documents.forEach(doc => {
            newAllPostsObject[doc.$id] = doc;
          });
  
          setAllPosts(prevPosts => ({
            ...prevPosts,
            ...newAllPostsObject,
          }));
  
          setLastAllPostsDocumentId(getAllPosts.documents[getAllPosts.documents.length - 1]?.$id);
        }
        else
        {
          setLastAllPostsDocumentId(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }  

  async function init() {
    if (!user) 
    {
      return;
    }
    console.log("database init");

    try {
      setIsLoading(true);
            
      const getFollowing = await databases.listDocuments(
        'db',
        user.$id + '-following',
      );
      console.log(getFollowing);
      const followingIds = getFollowing.documents.map(item => item.$id);
      const followingObject = followingIds.reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {});
      setFollowing(followingObject);

      const getMyPosts = await databases.listDocuments(
        'db',
        user.$id + '-posts',
        [
            Query.offset(0),
            Query.limit(5),
            Query.orderDesc('$createdAt'),
        ]
      );
      
      const myPostsObject = {}; 
      getMyPosts.documents.forEach(doc => {
        myPostsObject[doc.$id] = doc;
      });
      setMyPosts(myPostsObject);

      if(followingIds.length > 0)
        {
          const getMyFriendsPosts = await databases.listDocuments(
            'db',
            'users',
            [
              Query.offset(0),
              Query.limit(1),
              Query.orderDesc('$createdAt'),
              Query.equal('$id', followingIds),
            ]
          );
          if(getMyFriendsPosts.documents.length > 0)
          {
            setLastFriendsPostsDocumentId(getMyFriendsPosts.documents[getMyFriendsPosts.documents.length - 1]?.$id);
          }
          const myFriendsPostsObject = {}; 
          getMyFriendsPosts.documents.forEach(doc => {
            myFriendsPostsObject[doc.$id] = doc;
          });
          setMyFriendsPosts(myFriendsPostsObject);
        }
      

      const getAllPosts = await databases.listDocuments(
        'db',
        'users',
        [
          Query.offset(0),
          Query.limit(1),
          Query.orderDesc('$createdAt'),
          Query.notEqual('$id', user.$id),
        ]
      );
      if(getAllPosts.documents.length > 0)
      {
        setLastAllPostsDocumentId(getAllPosts.documents[getAllPosts.documents.length - 1]?.$id);
      }

      const allPostsObject = {}; 
      getAllPosts.documents.forEach(doc => {
        allPostsObject[doc.$id] = doc;
      });
      setAllPosts(allPostsObject);

    } catch (error) {
      console.log(error.message);
      console.error("Error fetching following:", error)
    }
    finally
    {
      setIsLoading(false);
    }
  }

  useEffect(() => {

    if (user) 
    {
      init();
    }
    else
    {
      reset();
    }
  }, [user]);

  return (
    <DatabaseContext.Provider value={{ databaseLoading: isLoading, following, follow, unfollow, myPosts, allPosts, myFriendsPosts, createPost, deletePost, myFollowersCount, loadMoreMyFriendsPosts, loadMoreAllPosts, lastFriendsPostsDocumentId, lastAllPostsDocumentId}}>
      {props.children}
    </DatabaseContext.Provider>
  );
}