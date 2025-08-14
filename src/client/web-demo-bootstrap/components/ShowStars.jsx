import React from 'react';
import { BsStarFill, BsStar, BsStarHalf } from 'react-icons/bs';

const ShowStars = ({ stars }) => {
  if (!stars) return null;
  return (
    <div className="d-flex justify-content-center small text-warning mb-2">
      {[0, 1, 2, 3, 4].map((lv, idx) => {
        const d = stars - lv;
        const k = `star-${idx}`;
        if (d >= 1) return <BsStarFill key={k} />;
        if (d >= 0.5) return <BsStarHalf key={k} />;
        return <BsStar key={k} />;
      })}
    </div>
  );
};

export default ShowStars;
