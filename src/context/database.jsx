import { createContext, useContext, useEffect, useState } from "react";
import { account, databases, functions, Query, ID } from "../lib/appwrite";
import { useUser } from "./user";
import axios from 'axios';

const DatabaseContext = createContext();

export function useDatabase() {
  return useContext(DatabaseContext);
}

export function DatabaseProvider(props) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  
  async function init() {
    //console.log(user);
    
   
    try {
      setIsLoading(true);
    } catch (error) {
      console.error("Error fetching following:", error)
    }
    finally
    {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if(user)
      {
        init();
      }
  }, [user]);

  return (
    <DatabaseContext.Provider value={{ databaseLoading: isLoading }}>
      {props.children}
    </DatabaseContext.Provider>
  );
}