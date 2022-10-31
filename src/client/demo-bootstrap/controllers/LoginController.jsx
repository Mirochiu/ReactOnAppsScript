import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';

const NAME_OF_PAGE = 'reactonappscript.page';

const LoginController = ({ submitForm, registForm, children }) => {
  const { authed, login, register } = useAuth();
  const [isSubmiting, setSubmiting] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [hintMsg, setHintMsg] = useState(null);
  const [isRegisteration, setRegister] = useState(false);

  const clearMsg = () => {
    setErrorMsg(null);
    setHintMsg(null);
  };

  if (authed) {
    if (children) {
      const lastPageAction = sessionStorage.getItem(NAME_OF_PAGE);
      if (lastPageAction) {
        console.debug('last page action', lastPageAction);
        return React.cloneElement(children, { lastPageAction });
      }
      return React.cloneElement(children);
    }

    // console.warn('not found component when logined');
    return undefined;
  }

  const onCancel = (e) => {
    if (e) e.preventDefault();
    clearMsg();
    setRegister(false);
  };

  if (registForm) {
    const onRegister = (e) => {
      e.preventDefault();
      setSubmiting(true);
      setHintMsg('註冊中...');
      register(e.target)
        .then((resp) => {
          e.target.reset();
          setHintMsg(resp.message);
        })
        .catch((err) => {
          setHintMsg(null);
          setErrorMsg(`註冊失敗:${err.message}`);
        })
        .finally(() => setSubmiting(false));
    };

    if (isRegisteration) {
      return React.cloneElement(registForm, {
        onSubmit: onRegister,
        isSubmiting,
        hintMsg,
        errorMsg,
        onCancel,
      });
    }
  }

  const onLogin = (e) => {
    e.preventDefault();
    setSubmiting(true);
    setHintMsg('登入中，請稍候...');
    login(e.target)
      .then(() => {
        e.target.reset();
        // console.debug('logined');
      })
      .catch((err) => setErrorMsg(`登入失敗:${err.message}`))
      .finally(() => {
        setHintMsg(null); // 成功不在意登入成功的資訊,所以就在這裡清除
        setSubmiting(false);
      });
  };

  const goRegist = (e) => {
    if (e) e.preventDefault();
    clearMsg();
    setRegister(true);
  };

  return React.cloneElement(submitForm, {
    onSubmit: onLogin,
    isSubmiting,
    hintMsg,
    errorMsg,
    goRegist: registForm ? goRegist : undefined,
  });
};

export default LoginController;
