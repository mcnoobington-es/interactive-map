import React, { useState, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Text } from 'react-konva';
import useImage from 'use-image';
import './App.css';
import { classData } from './data/classData';
import { roomCoordinates } from './data/roomCoordinates';
import RoomModal from './components/RoomModal';
import FloorSelector from './components/FloorSelector';
import PeriodSelector from './components/PeriodSelector';

// Floor plan image component
const FloorPlanImage = ({ floor, onLoad }) => {
  const [image] = useImage(`/floor-plans/floor-${floor}.png`);
  
  useEffect(() => {
    if (image && onLoad) {
      onLoad(image);
    }
  }, [image, onLoad]);

  return <KonvaImage image={image} />;
};

// Room polygon component - represents clickable rooms
const RoomPolygon = ({ room, onClick, isHighlighted }) => {
  const { x, y, width, height } = room;
  
  return (
    <>
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={isHighlighted ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.1)'}
        stroke={isHighlighted ? '#3b82f6' : '#60a5fa'}
        strokeWidth={isHighlighted ? 3 : 1}
        onClick={onClick}
        onTap={onClick}
        onMouseEnter={(e) => {
          const container = e.target.getStage().container();
          container.style.cursor = 'pointer';
        }}
        onMouseLeave={(e) => {
          const container = e.target.getStage().container();
          container.style.cursor = 'default';
        }}
      />
      <Text
        x={x}
        y={y + height / 2 - 10}
        width={width}
        text={room.number}
        fontSize={16}
        fontStyle="bold"
        fill="#1e40af"
        align="center"
        listening={false}
      />
    </>
  );
};

function App() {
  const [currentFloor, setCurrentFloor] = useState(1);
  const [currentPeriod, setCurrentPeriod] = useState('Period 1');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [imageSize, setImageSize] = useState({ width: 800, height: 600 });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const container = document.querySelector('.map-container');
      if (container) {
        setStageSize({
          width: container.offsetWidth,
          height: container.offsetHeight
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle image load to get dimensions
  const handleImageLoad = (image) => {
    setImageSize({
      width: image.width,
      height: image.height
    });
  };

  // Calculate scale to fit image in container
  const scale = Math.min(
    stageSize.width / imageSize.width,
    stageSize.height / imageSize.height
  ) * 0.9;

  // Get rooms for current floor
  const currentFloorRooms = roomCoordinates.filter(
    room => room.floor === currentFloor
  );

  // Get classes for the selected period and room
  const getClassesForRoom = (roomNumber) => {
    return classData.filter(
      classItem => 
        classItem.room === `Room ${roomNumber}` && 
        classItem.block === currentPeriod
    );
  };

  // Handle room click
  const handleRoomClick = (room) => {
    const classes = getClassesForRoom(room.number);
    setSelectedRoom({
      ...room,
      classes: classes
    });
  };

  return (
    <div className="App">
      <header className="header">
        <h1>BHS Interactive School Map</h1>
        <div className="controls">
          <FloorSelector 
            currentFloor={currentFloor} 
            onFloorChange={setCurrentFloor} 
          />
          <PeriodSelector 
            currentPeriod={currentPeriod} 
            onPeriodChange={setCurrentPeriod} 
          />
        </div>
      </header>

      <div className="map-container">
        <Stage 
          width={stageSize.width} 
          height={stageSize.height}
          scaleX={scale}
          scaleY={scale}
        >
          <Layer>
            <FloorPlanImage floor={currentFloor} onLoad={handleImageLoad} />
            {currentFloorRooms.map((room) => {
              const classes = getClassesForRoom(room.number);
              return (
                <RoomPolygon
                  key={room.number}
                  room={room}
                  onClick={() => handleRoomClick(room)}
                  isHighlighted={classes.length > 0}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>

      {selectedRoom && (
        <RoomModal
          room={selectedRoom}
          period={currentPeriod}
          onClose={() => setSelectedRoom(null)}
        />
      )}

      <div className="info-panel">
        <h3>How to Use</h3>
        <ul>
          <li>Select a floor using the floor selector</li>
          <li>Choose a period to see which classes are active</li>
          <li>Click on highlighted rooms to view class details</li>
          <li>Blue highlighted rooms have classes during the selected period</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
