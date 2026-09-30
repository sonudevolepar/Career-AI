import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

const API_URL = "http://localhost:5000/api/auth";


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);


  // ==========================================
  // GET CURRENT USER
  // ==========================================

  const loadUser = async () => {

    const token =
      localStorage.getItem("careerAI_token");


    // Token nahi hai
    if (!token) {

      setUser(null);
      setLoading(false);

      return;
    }


    try {

      const response = await fetch(
        `${API_URL}/me`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      const data = await response.json();


      if (response.ok) {

        setUser(data.user);

      } else {

        // Token invalid / expired
        localStorage.removeItem(
          "careerAI_token"
        );

        setUser(null);
      }


    } catch (error) {

      console.error(
        "Load user error:",
        error
      );

      localStorage.removeItem(
        "careerAI_token"
      );

      setUser(null);

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // LOAD USER WHEN APP STARTS
  // ==========================================

  useEffect(() => {

    loadUser();

  }, []);


  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (
    email,
    password
  ) => {

    const response = await fetch(
      `${API_URL}/login`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      }
    );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Login failed"
      );

    }


    // ======================================
    // SAVE JWT TOKEN
    // ======================================

    localStorage.setItem(
      "careerAI_token",
      data.token
    );


    // ======================================
    // SAVE USER
    // ======================================

    setUser(data.user);


    return data;

  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {

    localStorage.removeItem(
      "careerAI_token"
    );

    setUser(null);

  };


  // ==========================================
  // CONTEXT
  // ==========================================

  return (

    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        loadUser,
      }}
    >

      {children}

    </AuthContext.Provider>

  );
};


// ==========================================
// USE AUTH
// ==========================================

export const useAuth = () =>
  useContext(AuthContext);