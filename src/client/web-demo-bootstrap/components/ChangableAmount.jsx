import React from 'react';
import { BsPlus, BsDash } from 'react-icons/bs';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

const ChangableAmount = ({
  amount = '',
  onIncrement = () => {},
  onDecrement = () => {},
  variant = 'light',
  borderColor = 'dark',
  style,
}) => {
  return (
    <InputGroup>
      <Button
        variant={variant}
        className={`border-${borderColor}`}
        onClick={() => onDecrement()}
      >
        <BsDash />
      </Button>
      <Form.Control
        readOnly={true}
        type="text"
        value={amount}
        className={`border-${borderColor} text-center`}
        style={style}
      />
      <Button
        variant={variant}
        className={`border-${borderColor}`}
        onClick={() => onIncrement()}
      >
        <BsPlus />
      </Button>
    </InputGroup>
  );
};

export default ChangableAmount;
