import React from 'react';

const PricePanel = ({ price, orgPrice, priceList }) => {
  if (Array.isArray(priceList)) {
    const Max = Math.max(...priceList);
    const Min = Math.min(...priceList);
    return `$${Min} - ${Max}`;
  }
  if (!price) return null;
  return (
    <>
      {orgPrice ? (
        <span className="text-muted text-decoration-line-through">{`$${orgPrice}`}</span>
      ) : null}
      {`$${price}`}
    </>
  );
};

export default PricePanel;
