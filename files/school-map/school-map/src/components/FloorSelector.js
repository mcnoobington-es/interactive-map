import React from 'react';

const FloorSelector = ({ currentFloor, onFloorChange }) => {
  const floors = [1, 2, 3];

  return (
    <div className="selector">
      <label htmlFor="floor-select">Floor</label>
      <select 
        id="floor-select"
        value={currentFloor} 
        onChange={(e) => onFloorChange(parseInt(e.target.value))}
      >
        {floors.map(floor => (
          <option key={floor} value={floor}>
            Floor {floor}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FloorSelector;
