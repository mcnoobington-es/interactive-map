import React from 'react';

const RoomModal = ({ room, period, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Room {room.number}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="modal-content">
          <div className="room-info">
            <p><strong>Floor:</strong> {room.floor}</p>
            <p><strong>Room Type:</strong> {room.type.charAt(0).toUpperCase() + room.type.slice(1)}</p>
            <p><strong>Selected Period:</strong> {period}</p>
          </div>

          <div className="classes-section">
            <h3>Classes During {period}</h3>
            {room.classes && room.classes.length > 0 ? (
              room.classes.map((classItem, index) => (
                <div key={index} className="class-card">
                  <h4>{classItem.description}</h4>
                  <p><strong>Teacher:</strong> {classItem.teacher}</p>
                  <p><strong>Students:</strong> {classItem.studentBreakdown}</p>
                  <p><strong>Status:</strong> {classItem.status}</p>
                </div>
              ))
            ) : (
              <div className="no-classes">
                <p>No classes scheduled in this room during {period}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;
