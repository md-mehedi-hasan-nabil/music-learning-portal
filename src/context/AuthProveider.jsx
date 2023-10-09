import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { app } from "../firebase/firebaseConfig";

export const AuthContext = createContext(null);

const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  function googleLogin(provider) {
    setLoading(true);
    return signInWithPopup(auth, provider);
  }

  function registerUser(email, password) {
    // setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // login
  function login(email, password) {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  }

  function updateUser(displayName, photoURL) {
    setLoading(true);
    return updateProfile(auth.currentUser, {
      displayName,
      photoURL,
    });
  }

  const logout = () => {
    setLoading(true);
    localStorage.clear();
    return signOut(auth);
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    loading,
    registerUser,
    login,
    googleLogin,
    updateUser,
    logout,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
