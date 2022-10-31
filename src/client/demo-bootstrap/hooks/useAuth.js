import React, { createContext, useState, useEffect, useContext } from 'react';
import { serverFunctions } from '../../utils/serverFunctions';

const NAME_OF_TOKEN = 'reactonappscript.user-token';

const AuthContext = createContext({
  authed: null,
  login: () => {},
  logout: () => {},
  register: () => {},
});

const useAuthenticator = () => {
  const [authed, setAuthed] = useState(null);

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem(NAME_OF_TOKEN);
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
      localStorage.setItem(NAME_OF_TOKEN, resp.token);
      setAuthed(true);
      return resp;
    });

  const logout = () =>
    new Promise((res) => {
      localStorage.removeItem(NAME_OF_TOKEN);
      setAuthed(false);
      res('done');
    });

  const register = (form) => serverFunctions.register(form);

  return { authed, login, logout, register };
};

const useHook = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const auth = useAuthenticator();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default useHook;
