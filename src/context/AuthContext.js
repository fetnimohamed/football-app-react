import React, { useState, useCallback, useEffect, useMemo } from 'react';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';

export const AuthContext = React.createContext();

const AuthProvider = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);
  const [expDate, setExpDate] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  const [check, setCheck] = useState(false);
  const [users, setUsers] = useState([]);
  const [displayModal, setDisplayModal] = useState(false);
  const clearLocalStorage = () => {
    setUser(null);
    setLoggedIn(false);
    setToken(null);
    localStorage.setItem('firstTime', false);
    localStorage.removeItem('userData');
  };

  const signIn = useCallback((token) => {
    const decodedToken = jwt_decode(token);
    setLoggedIn(true);
    setToken(token);
    setExpDate(decodedToken.exp);
    setDecodedToken(decodedToken);
    setDisplayModal(true);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        token,
        loggedIn: true,
        expDate: decodedToken.exp,
      }),
    );
  }, []);

  const editUserData = (newUserdata) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) userData.user = newUserdata;
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(newUserdata);
  };

  useEffect(() => {
    console.log('checking session...');
    if (expDate && new Date(expDate * 1000) <= new Date()) {
      clearLocalStorage();
      toast.error('Session terminé');
    }
    setTimeout(() => {
      if (expDate && new Date(expDate * 1000) > new Date()) setCheck(!check);
    }, [5000]);
  }, [check]);

  useMemo(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      signIn(userData.token);
    }
  }, [signIn]);

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        clearLocalStorage,
        signIn,
        user,
        setUser,
        token,
        editUserData,
        decodedToken,
        users,
        setUsers,
        displayModal,
        setDisplayModal,
      }}
    >
      <>{props.children}</>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
