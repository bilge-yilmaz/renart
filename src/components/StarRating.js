import React from 'react';
import './StarRating.css';

const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <svg key={i} className="star star-filled" width="16" height="16" viewBox="0 0 16 16">
        <path d="M8 0L10.4 4.8L16 5.6L12 9.4L12.8 15.2L8 12.8L3.2 15.2L4 9.4L0 5.6L5.6 4.8L8 0Z" />
      </svg>
    );
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push(
      <svg key="half" className="star star-half" width="16" height="16" viewBox="0 0 16 16">
        <defs>
          <linearGradient id="half-star" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#E0E0E0" />
          </linearGradient>
        </defs>
        <path d="M8 0L10.4 4.8L16 5.6L12 9.4L12.8 15.2L8 12.8L3.2 15.2L4 9.4L0 5.6L5.6 4.8L8 0Z" fill="url(#half-star)" />
      </svg>
    );
  }

  // Add empty stars
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <svg key={`empty-${i}`} className="star star-empty" width="16" height="16" viewBox="0 0 16 16">
        <path d="M8 0L10.4 4.8L16 5.6L12 9.4L12.8 15.2L8 12.8L3.2 15.2L4 9.4L0 5.6L5.6 4.8L8 0Z" />
      </svg>
    );
  }

  return <div className="star-rating">{stars}</div>;
};

export default StarRating; 