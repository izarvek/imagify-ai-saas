import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/Axios";

export const AppContext = createContext();

const AppProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [showLogin , setShowLogin] = useState(false);
  const [credits , setCredits] = useState(false);

  const loadCredits = async () => {
    try {
      const response = await api.get("/users/credit");
      setCredits(response.data.credits);
    } catch (error) {
      console.log("Error fetching credits:", error);
    }
  }
  
  const generateImages = async (prompt) => {
    try {
      const response = await api.post("/images/generate-image", { prompt });
      if(response.data.success){
        setCredits(response.data.creditBalance);
      } 
      return response.data.image;
    } catch (error) {
      console.log("Error generating images:", error);
    }
  };

  useEffect(() => {
    loadCredits();
  }, [user]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    credits,
    setCredits,
    generateImages
  };

  return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
  );
};

export default AppProvider