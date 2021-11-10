import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Server from '../../utils/server';

const { serverFunctions } = Server;

const NAME_OF_TOKEN = 'user-token';

const authContext = createContext();

function useAuth() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(NAME_OF_TOKEN);
    serverFunctions.authLogin(token).then(() => setAuthed(true));
  }, []);

  const login = form => {
    return new Promise((res, rej) => {
      serverFunctions
        .loginUser(form)
        .then(response => {
          localStorage.setItem(NAME_OF_TOKEN, response.token);
          setAuthed(true);
          res(response);
        })
        .catch(rej);
    });
  };

  const logout = () => {
    return new Promise(res => {
      localStorage.removeItem(NAME_OF_TOKEN);
      setAuthed(false);
      res();
    });
  };

  return { authed, login, logout };
}

export function AuthProvider({ children }) {
  const auth = useAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.element,
};

export default function AuthConsumer() {
  return useContext(authContext);
}
