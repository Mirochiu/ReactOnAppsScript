import React from 'react';
import { BsCartFill } from 'react-icons/bs';
import Badge from 'react-bootstrap/Badge';
import useCart from '../hooks/useCart';

const CartIcon = () => {
  const { cartList } = useCart();
  return (
    <div className="border border-dark rounded p-2 d-inline-flex align-items-center">
      <BsCartFill className="me-1" />
      購物車
      {cartList && cartList.length ? (
        <Badge bg="dark" pill={true} className="ms-1">
          {cartList.length}
        </Badge>
      ) : null}
    </div>
  );
};

export default CartIcon;
