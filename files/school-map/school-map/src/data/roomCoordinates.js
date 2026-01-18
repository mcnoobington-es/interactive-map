// Room coordinates for each floor based on the PDF floor plans
// Coordinates are approximate and should be adjusted based on actual floor plan images

export const roomCoordinates = [
  // Floor 1 (P1) Rooms
  { floor: 1, number: '101', x: 150, y: 700, width: 120, height: 150, type: 'classroom' },
  { floor: 1, number: '102', x: 150, y: 550, width: 120, height: 140, type: 'classroom' },
  { floor: 1, number: '103', x: 150, y: 400, width: 120, height: 140, type: 'classroom' },
  { floor: 1, number: '104', x: 280, y: 300, width: 140, height: 180, type: 'classroom' },
  { floor: 1, number: '105', x: 430, y: 150, width: 160, height: 140, type: 'classroom' },
  { floor: 1, number: '106', x: 600, y: 150, width: 140, height: 140, type: 'classroom' },
  { floor: 1, number: '107', x: 750, y: 150, width: 140, height: 140, type: 'classroom' },
  { floor: 1, number: '108', x: 750, y: 450, width: 140, height: 150, type: 'classroom' },
  { floor: 1, number: '109', x: 600, y: 650, width: 180, height: 150, type: 'classroom' },
  { floor: 1, number: '110', x: 600, y: 850, width: 180, height: 140, type: 'classroom' },
  
  // Floor 2 (P2) Rooms
  { floor: 2, number: '201', x: 280, y: 700, width: 120, height: 150, type: 'classroom' },
  { floor: 2, number: '202', x: 280, y: 550, width: 120, height: 140, type: 'classroom' },
  { floor: 2, number: '203', x: 280, y: 400, width: 120, height: 140, type: 'classroom' },
  { floor: 2, number: '204', x: 280, y: 250, width: 140, height: 140, type: 'classroom' },
  { floor: 2, number: '205', x: 430, y: 150, width: 160, height: 140, type: 'classroom' },
  { floor: 2, number: '206', x: 600, y: 150, width: 140, height: 140, type: 'classroom' },
  { floor: 2, number: '207', x: 750, y: 150, width: 140, height: 140, type: 'classroom' },
  { floor: 2, number: '208', x: 750, y: 450, width: 140, height: 150, type: 'classroom' },
  { floor: 2, number: '209', x: 600, y: 650, width: 180, height: 150, type: 'classroom' },
  { floor: 2, number: '210', x: 150, y: 1050, width: 90, height: 80, type: 'office' },
  { floor: 2, number: '211', x: 150, y: 950, width: 90, height: 90, type: 'office' },
  { floor: 2, number: '212', x: 150, y: 850, width: 90, height: 90, type: 'office' },
  
  // Floor 3 (P3) Rooms
  { floor: 3, number: '301', x: 280, y: 700, width: 120, height: 150, type: 'classroom' },
  { floor: 3, number: '302', x: 280, y: 550, width: 120, height: 140, type: 'classroom' },
  { floor: 3, number: '303', x: 280, y: 400, width: 120, height: 140, type: 'classroom' },
  { floor: 3, number: '304', x: 280, y: 250, width: 140, height: 140, type: 'classroom' },
  { floor: 3, number: '305', x: 430, y: 150, width: 160, height: 140, type: 'classroom' },
  { floor: 3, number: '306', x: 600, y: 150, width: 140, height: 140, type: 'classroom' },
  { floor: 3, number: '307', x: 750, y: 150, width: 140, height: 140, type: 'classroom' },
  { floor: 3, number: '308', x: 750, y: 450, width: 140, height: 150, type: 'classroom' },
  { floor: 3, number: '309', x: 600, y: 400, width: 140, height: 140, type: 'classroom' },
  { floor: 3, number: '310', x: 600, y: 850, width: 180, height: 140, type: 'classroom' },
  { floor: 3, number: '311', x: 600, y: 1000, width: 180, height: 100, type: 'classroom' },
  { floor: 3, number: '312', x: 240, y: 1050, width: 90, height: 80, type: 'office' },
  { floor: 3, number: '313', x: 150, y: 950, width: 90, height: 90, type: 'office' },
  { floor: 3, number: '314', x: 150, y: 850, width: 90, height: 90, type: 'office' }
];

// Helper function to get rooms by floor
export const getRoomsByFloor = (floor) => {
  return roomCoordinates.filter(room => room.floor === floor);
};

// Helper function to get room by number
export const getRoomByNumber = (roomNumber) => {
  return roomCoordinates.find(room => room.number === roomNumber);
};
