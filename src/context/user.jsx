import { createContext, useContext, useEffect, useState } from "react";
import { account, databases, endpoint } from "../lib/appwrite";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider(props) {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  async function login(email, password) {
    try
    {
      await account.createEmailPasswordSession(email, password);
      const loggedIn = await account.get();
      if(loggedIn.emailVerification)
      {
        setLoggedInUser(loggedIn);
      }
      else
      {
        await account.createVerification(endpoint + '/verify');
        await account.deleteSession("current");    
        setLoggedInUser(null);
        throw new Error("A verification email sent. Please check your email");
      }
    }
    catch(error)
    {
      throw new Error(error.message);
    }
  }


  async function verify(userId, secret)
  {
    try
    {
      return await account.updateVerification(userId, secret);
    }
    catch(error)
    {
      throw new Error(error.message);
    }
  }

  async function reset(email) {
    try {
        return await account.createRecovery(email, endpoint + '/recover');
    } catch (error) {
        throw new Error(error.message);
    }
}


  async function recover(userId, secret, password, confirmPassword)
  {
    try{
      return await account.updateRecovery(
          userId,
          secret,
          password,
          confirmPassword
      );
    }
    catch(error)
    {
      throw new Error(error.message);
    }
  }

  async function logout() {
    try {
      await account.deleteSession("current");
    }
    catch(error)
    {
      throw new Error(error.message);
    }
    finally
    {
      setLoggedInUser(null);
    }
  }

  async function deleteAccount()
  {
    try
    {
      await databases.deleteDocument(
        'db', // databaseId
        'users', // collectionId
        loggedInUser.$id // documentId
      );

      console.log(loggedInUser.$id);

      setLoggedInUser(null);

    }
    catch(error)
    {
      console.log(error);
      throw new Error(error.message)
    }
  }

  async function register(username, email, password) {
    try {
      return await account.create(username, email, password, username);
    }
    catch(error)
    {
      throw new Error(error.message);
    }
  }

  async function init() {
    try {
      console.log("user init");
      const loggedIn = await account.get();
      setLoggedInUser(loggedIn);
      
      /*
      const url = "https://cloud.appwrite.io/v1/avatars/initials?name=" + loggedIn.$id;
      console.log(url);
      */
    
    } catch (error) {
      setLoggedInUser(null);
    }
    finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <UserContext.Provider value={{ user: loggedInUser, userLoading: isLoading, login, logout, register, reset, recover, verify, deleteAccount }}>
      {props.children}
    </UserContext.Provider>
  );
}