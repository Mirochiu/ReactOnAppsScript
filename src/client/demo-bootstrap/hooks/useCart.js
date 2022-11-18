import React, { createContext, useState, useEffect, useContext } from 'react';

const NAME_OF_CART = 'reactonappscript.user-cart';

const context = createContext({
  cartList: null,
  add: () => {},
  remove: () => {},
  reseet: () => {},
});

const initCart = () => {
  const [cartList, setCartList] = useState(() => {
    const jsonString = localStorage.getItem(NAME_OF_CART);
    try {
      const array = JSON.parse(jsonString);
      if (!Array.isArray(array)) {
        return [];
      }
      return array;
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    if (Array.isArray(cartList)) {
      localStorage.setItem(NAME_OF_CART, JSON.stringify(cartList));
    }
  }, [cartList]);

  const add = (id, amount, option) => {
    if (!id || !amount || typeof amount !== 'number') {
      console.error(
        `cart.add ${id},${amount},${option} t:${typeof id},${typeof amount},${typeof option}`
      );
      return;
    }
    setCartList((list) => {
      const idx = list.findIndex(
        (p) => p.id === id && (option === undefined || p.option === option)
      );
      if (idx === -1) {
        return [...list, { id, amount, option }]; // new one
      }
      const target = list[idx];
      return [
        ...list.slice(0, idx),
        { ...target, amount: target.amount + amount },
        ...list.slice(idx + 1),
      ];
    });
  };

  const remove = (id, amount, option) => {
    if (!id || !amount || typeof amount !== 'number') {
      console.error(
        `cart.remove ${id},${amount},${option} t:${typeof id},${typeof amount},${typeof option}`
      );
      return;
    }
    setCartList((list) => {
      const idx = list.findIndex(
        (p) => p.id === id && (option === undefined || p.option === option)
      );
      if (idx === -1) {
        return list; // nothing to do
      }
      const target = list[idx];
      // target removed
      if (target.amount <= amount) {
        return [...list.slice(0, idx), ...list.slice(idx + 1)];
      }
      return [
        ...list.slice(0, idx),
        { ...target, amount: target.amount - amount },
        ...list.slice(idx + 1),
      ];
    });
  };

  const reset = () => {
    console.debug(`cart.reset`);
    setCartList([]);
  };

  return { cartList, add, remove, reset };
};

const useCart = () => useContext(context);

export const CartProvider = ({ children }) => {
  const values = initCart();

  return <context.Provider value={values}>{children}</context.Provider>;
};

export default useCart;
