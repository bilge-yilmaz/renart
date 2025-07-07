import React from 'react';
import './ColorPicker.css';

const ColorPicker = ({ colors, selectedColor, onColorChange }) => {
  const getColorStyle = (color) => {
    const colorMap = {
      yellow: '#E6CA97',
      rose: '#E1A4A9', 
      white: '#D9D9D9'
    };
    return colorMap[color] || '#E6CA97';
  };

  const getColorName = (color) => {
    const nameMap = {
      yellow: 'Yellow Gold',
      rose: 'Rose Gold',
      white: 'White Gold'
    };
    return nameMap[color] || color;
  };

  return (
    <div className="color-picker-container">
      <div className="color-picker">
        {colors.map((color) => (
          <button
            key={color}
            className={`color-option ${selectedColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: getColorStyle(color) }}
            onClick={() => onColorChange(color)}
            aria-label={`Select ${getColorName(color)}`}
          >
          </button>
        ))}
      </div>
      <span className="selected-color-name">{getColorName(selectedColor)}</span>
    </div>
  );
};

export default ColorPicker; 