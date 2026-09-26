import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

const API_URL =
  "http://localhost:5000/api/auth";


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);


  // ===============================
  // Get current user
  // ===============================

  const loadUser = async () => {

    const token =
      localStorage.getItem("careerAI_token");

    if (!token) {
      setLoading(false);
      return;
    }


    try {

      const response =
        await fetch(`${API_URL}/me`, {

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

        });


      const data =
        await response.json();


      if (response.ok) {

        setUser(data.user);

      } else {

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


  useEffect(() => {
    loadUser();
  }, []);


  // ===============================
  // Login
  // ===============================

  const login = async (
    email,
    password
  ) => {

    const response =
      await fetch(`${API_URL}/login`, {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),

      });


    const data =
      await response.json();


    if (!response.ok) {
      throw new Error(
        data.message || "Login failed"
      );
    }


    localStorage.setItem(
      "careerAI_token",
      data.token
    );


    setUser(data.user);

    return data;

  };


  // ===============================
  // Logout
  // ===============================

  const logout = () => {

    localStorage.removeItem(
      "careerAI_token"
    );

    setUser(null);

  };


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


export const useAuth = () =>
  useContext(AuthContext);