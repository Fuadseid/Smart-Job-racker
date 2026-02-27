import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Define interfaces for the state and user
interface User {
  id: string;
  name: string;
  refreshToken: string;
  refreshTokenExpiration: string;
  email: string;
  token: string;
  type: string;
  permissions: [];
  shops: [] | null;
  warehouses: [] | null;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  notifications: string[];
  refreshToken: string;
  refreshTokenExpiration: string;
  csrf_token: string;
  app_url: string;
  media_url: string;
  upload_url: string;
  lang: string;
  tenant: string;
}

// Initialize state from localStorage
const initializeUser = (): User | null => {
  if (typeof window !== "undefined") {
    const item = window?.localStorage.getItem("user-info");
    return item ? (JSON.parse(item) as User) : null;
  }
  return null;
};

//for now i do the below one to check the token also in the local storage
const initializeAuthenticated = (): boolean => {
  if (typeof window !== "undefined") {
    const item =
      window?.localStorage.getItem("user-info") ||
      window?.localStorage.getItem("token");
    return item ? true : false;
  }
  return false;
};

const initializeToken = (): string | null => {
  if (typeof window !== "undefined") {
    const item = window?.localStorage.getItem("token");
    console.log("token", item);
    return item ? item : null;
  }
  return null;
};

// Create the auth slice
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: initializeToken(),
    refreshToken: "",
    refreshTokenExpiration: "",
    isAuthenticated: initializeAuthenticated(),
    user: initializeUser(),
    notifications: [] as string[],
    csrf_token: "",
    /*     
    front_url: "https://test.afro-billboard.com",
     front_url: "https://afro-billboard.com", */

    media_url: "http://localhost:5000/storage/uploads/",
    app_url: "http://localhost:5000/",
    front_url: "http://localhost:3000",
    upload_url: "http://localhost:5000/api/uploadFile",



    /*          front_url: "http://localhost:5173",
     */

    /*    media_url: "http://backend.maid-match.com/storage/uploads/",
    app_url: "http://backend.maid-match.com",
 */
    lang: "en",
    tenant: "test",
  } as AuthState,
  reducers: {
    authenticateUser: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.refreshTokenExpiration = action.payload.refreshTokenExpiration;
      window?.localStorage.setItem("user-info", JSON.stringify(state.user));
      window?.localStorage.setItem("token", state.token);
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      window?.localStorage.removeItem("user-info");
      window?.localStorage.removeItem("token");
      Cookies.remove("user");
      Cookies.remove("token");
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.lang = action.payload;
    },
    socialAuthenticate: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.token = action.payload;
      window?.localStorage.setItem("user-info", JSON.stringify(state.user));
      window?.localStorage.setItem("token", state.token);
    },
    setCSRFToken: (state, action: PayloadAction<string>) => {
      state.csrf_token = action.payload;
    },
    pushNotification: (state, action: PayloadAction<string>) => {
      state.notifications.push(action.payload);
    },
    removeNotifications: (state) => {
      state.notifications = [];
    },
  },
});

// Export actions and reducer
export const {
  authenticateUser,
  logoutUser,
  socialAuthenticate,
  setCSRFToken,
  setUser,
  pushNotification,
  removeNotifications,
  setLanguage,
  
} = authSlice.actions;

export default authSlice.reducer;
