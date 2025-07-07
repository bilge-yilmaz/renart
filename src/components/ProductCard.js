import React, { useState } from 'react';
import ColorPicker from './ColorPicker';
import StarRating from './StarRating';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  // Get available colors and set initial color
  const availableColors = product.images ? Object.keys(product.images) : [];
  const initialColor = availableColors.length > 0 ? availableColors[0] : 'yellow';
  
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const colors = product.images ? Object.keys(product.images) : [];
  const currentImage = product.images ? product.images[selectedColor] : '';

  return (
    <div className="product-card">
      <div className="product-image-container">
        <div className={`product-image ${imageLoaded ? 'loaded' : 'loading'}`}>
          {currentImage ? (
            <img 
              src={currentImage} 
              alt={product.name}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          ) : (
            <div className="no-image-placeholder">
              <span>No Image Available</span>
            </div>
          )}
          {!imageLoaded && currentImage && (
            <div className="image-placeholder">
              <div className="image-spinner"></div>
            </div>
          )}
        </div>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">
          ${product.price ? product.price.toFixed(2) : '0.00'} USD
        </div>
        
        <div className="product-rating">
          <StarRating rating={product.rating || 0} />
          <span className="rating-text">{product.rating ? product.rating.toFixed(1) : '0.0'}/5</span>
        </div>
        
        <div className="product-colors">
          {colors.length > 0 && (
            <ColorPicker 
              colors={colors}
              selectedColor={selectedColor}
              onColorChange={handleColorChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 