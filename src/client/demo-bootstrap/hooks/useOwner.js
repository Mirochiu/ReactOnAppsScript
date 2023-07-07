import React, { createContext, useState, useEffect, useContext } from 'react';
import { serverFunctions } from '../../utils/serverFunctions';

const OwnerContext = createContext({
  isOwner: null,
});

const useOwnerAuthenticator = () => {
  const [isOwner, setOwner] = useState(null);

  useEffect(() => {
    let mounted = true;
    try {
      serverFunctions
        .isOwner()
        .then(() => mounted && setOwner(true))
        .catch(() => mounted && setOwner(false));
    } catch (error) {
      console.error('cannot determine isOwner or not', error);
      setOwner(false);
    }

    return () => {
      mounted = false;
    };
  }, []);

  return { isOwner };
};

const useOwner = () => useContext(OwnerContext);

export const OwnerProvider = ({ children }) => {
  const auth = useOwnerAuthenticator();

  return <OwnerContext.Provider value={auth}>{children}</OwnerContext.Provider>;
};

export default useOwner;
