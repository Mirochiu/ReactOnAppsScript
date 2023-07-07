import React, { createContext, useState, useEffect, useContext } from 'react';
import { serverFunctions } from '../../utils/serverFunctions';
import LocalStorage from '../utils/LocalStorage';

const NAME_OF_TOKEN = 'reactonappscript.user-token';

const AuthContext = createContext({
  authed: null,
  login: () => {},
  logout: () => {},
  register: () => {},
  getToken: () => '',
});

const useAuthenticator = () => {
  const [authed, setAuthed] = useState(null);

  useEffect(() => {
    let mounted = true;
    const token = LocalStorage.getItem(NAME_OF_TOKEN);
    if (token) {
      serverFunctions
        .authLogin(token)
        .then(() => mounted && setAuthed(true))
        .catch(() => mounted && setAuthed(false));
    } else {
      setAuthed(false);
    }

    return () => {
      mounted = false;
    };
  }, []);

  const login = (form) =>
    serverFunctions.loginUser(form).then((resp) => {
      LocalStorage.setItem(NAME_OF_TOKEN, resp.token);
      setAuthed(true);
      return resp;
    });

  const logout = () =>
    new Promise((res) => {
      LocalStorage.removeItem(NAME_OF_TOKEN);
      setAuthed(false);
      res('done');
    });

  const register = (form) => serverFunctions.register(form);

  const getToken = () => LocalStorage.getItem(NAME_OF_TOKEN);

  return { authed, login, logout, register, getToken };
};

const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const auth = useAuthenticator();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default useAuth;
