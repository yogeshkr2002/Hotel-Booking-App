import { createContext, useEffect, useReducer } from "react";

// Initial state
const INITIAL_STATE = {
  user: (() => {
    const storedUser = localStorage.getItem("user");
    try {
      return storedUser && storedUser !== "undefined"
        ? JSON.parse(storedUser)
        : null;
    } catch (error) {
      return null;
    }
  })(),
  loading: false,
  error: null,
};

// Create AuthContext
export const AuthContext = createContext(INITIAL_STATE);

// Reducer function to handle state updates
const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      console.log("object", action.payload);
      return {
        user: action.payload, // Set user data from payload
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload, // Set error message
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state; // Return current state for unrecognized actions
  }
};

// AuthContextProvider component
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  // Effect to update localStorage whenever the user state changes
  useEffect(() => {
    // console.log("User state updated:", state.user); // Debugging log
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user"); // Clear user from localStorage on logout
    }
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Sample login function (this could be in a different file)
export const login = async (dispatch, credentials) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const userData = await mockApiLogin(credentials);
    console.log("Login successful:", userData); // Debugging log
    dispatch({ type: "LOGIN_SUCCESS", payload: userData });
  } catch (error) {
    console.error("Login failed:", error.message); // Debugging log
    dispatch({ type: "LOGIN_FAILURE", payload: error.message });
  }
};

// Mock API login function (for demonstration purposes)
const mockApiLogin = (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulated user data (you would typically get this from your server)
      const mockUser = {
        username: credentials.username,
        email: "john@example.com",
      };

      // Simulate successful login if username and password are correct
      if (
        credentials.username === "test" &&
        credentials.password === "password"
      ) {
        resolve(mockUser);
      } else {
        reject(new Error("Invalid username or password")); // Simulate login failure
      }
    }, 1000);
  });
};
