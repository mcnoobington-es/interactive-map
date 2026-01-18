# Code Walkthrough: Understanding React and Konva.js

This document explains how the BHS School Map application works, teaching you the fundamentals of React and Konva.js for future projects.

## Table of Contents

1. [React Fundamentals](#react-fundamentals)
2. [Konva.js Basics](#konvajs-basics)
3. [Application Architecture](#application-architecture)
4. [Component Breakdown](#component-breakdown)
5. [Data Flow](#data-flow)
6. [Interactive Canvas with Konva](#interactive-canvas-with-konva)
7. [State Management](#state-management)
8. [Event Handling](#event-handling)
9. [Best Practices](#best-practices)
10. [Common Patterns](#common-patterns)

---

## React Fundamentals

### What is React?

React is a JavaScript library for building user interfaces. Think of it as a way to create reusable UI components that automatically update when data changes.

**Key Concepts:**

1. **Components**: Reusable pieces of UI
2. **Props**: Data passed to components (like function parameters)
3. **State**: Data that can change over time
4. **Hooks**: Special functions that let you use React features

### Basic React Component

```javascript
// Function component (modern way)
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Usage
<Greeting name="Isaac" />
// Renders: <h1>Hello, Isaac!</h1>
```

**Breaking it down:**
- `function Greeting` - Define a component (just a JavaScript function)
- `({ name })` - Destructure props (receive data)
- `return <h1>...</h1>` - Return JSX (looks like HTML, but it's JavaScript)
- `{name}` - Embed JavaScript expression in JSX

### State with useState

State is data that can change. When state changes, React re-renders the component.

```javascript
import { useState } from 'react';

function Counter() {
  // Declare state variable
  const [count, setCount] = useState(0);
  //     ↑current  ↑function   ↑initial
  //     value     to update   value
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

**How it works:**
1. `useState(0)` creates state with initial value 0
2. Returns array: [currentValue, updateFunction]
3. Calling `setCount(newValue)` updates state and re-renders
4. React efficiently updates only what changed

### Side Effects with useEffect

useEffect lets you perform side effects (like fetching data, subscriptions, timers).

```javascript
import { useState, useEffect } from 'react';

function WindowSize() {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    // This runs after render
    const handleResize = () => setWidth(window.innerWidth);
    
    // Subscribe to window resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup function (runs before next effect and unmount)
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty array = run once on mount
  //  ↑ Dependencies: re-run effect when these change
  
  return <p>Window width: {width}px</p>;
}
```

**Dependencies array:**
- `[]` - Run once on mount
- `[count]` - Run when `count` changes
- No array - Run after every render (rarely needed)

---

## Konva.js Basics

### What is Konva.js?

Konva is a 2D canvas library for drawing shapes and handling interactions. It's perfect for:
- Interactive diagrams
- Games
- Data visualizations
- Floor plans (like our app!)

### Core Concepts

```
Stage (container)
  └── Layer (like Photoshop layers)
      ├── Shape 1 (rectangle, circle, etc.)
      ├── Shape 2
      └── Shape 3
```

### Basic Konva Setup

```javascript
import { Stage, Layer, Rect, Circle, Text } from 'react-konva';

function MyCanvas() {
  return (
    <Stage width={800} height={600}>
      <Layer>
        {/* Rectangle */}
        <Rect
          x={100}        // Position from left
          y={100}        // Position from top
          width={150}    // Width in pixels
          height={100}   // Height in pixels
          fill="blue"    // Fill color
          stroke="black" // Border color
          strokeWidth={2}// Border width
        />
        
        {/* Circle */}
        <Circle
          x={300}
          y={150}
          radius={50}
          fill="red"
        />
        
        {/* Text */}
        <Text
          x={400}
          y={100}
          text="Hello Konva!"
          fontSize={24}
          fill="green"
        />
      </Layer>
    </Stage>
  );
}
```

### Coordinate System

```
(0,0) ────────────→ X
  │
  │     (100, 50)
  │        ⬤
  │
  ↓
  Y
```

- Origin (0, 0) is top-left corner
- X increases to the right
- Y increases downward
- All measurements in pixels

### Interactive Shapes

```javascript
function ClickableShape() {
  const [color, setColor] = useState('blue');
  
  return (
    <Rect
      x={100}
      y={100}
      width={150}
      height={100}
      fill={color}
      
      // Click handlers
      onClick={() => setColor('red')}
      onTap={() => setColor('red')} // For touch devices
      
      // Hover handlers
      onMouseEnter={(e) => {
        const stage = e.target.getStage();
        stage.container().style.cursor = 'pointer';
      }}
      onMouseLeave={(e) => {
        const stage = e.target.getStage();
        stage.container().style.cursor = 'default';
      }}
    />
  );
}
```

---

## Application Architecture

### File Structure Explained

```
src/
├── App.js                    # Main application (orchestrates everything)
├── components/
│   ├── FloorSelector.js      # Dropdown for floor selection
│   ├── PeriodSelector.js     # Dropdown for period selection
│   └── RoomModal.js          # Popup showing room details
├── data/
│   ├── classData.js          # All class schedules
│   └── roomCoordinates.js    # Room positions on floor plans
└── firebase/
    ├── config.js             # Firebase connection setup
    └── services.js           # Database operations
```

### Data Flow Diagram

```
User Action
    ↓
App.js (state updates)
    ↓
    ├─→ FloorSelector (gets new floor)
    ├─→ PeriodSelector (gets new period)
    ├─→ Konva Stage (renders updated floor)
    │       ↓
    │   RoomPolygons (show rooms for floor)
    │       ↓
    │   User clicks room
    │       ↓
    └─→ RoomModal (shows room details)
```

---

## Component Breakdown

### 1. App.js - The Main Component

```javascript
function App() {
  // ========== STATE MANAGEMENT ==========
  // Track which floor user is viewing
  const [currentFloor, setCurrentFloor] = useState(1);
  
  // Track which period user selected
  const [currentPeriod, setCurrentPeriod] = useState('Period 1');
  
  // Track selected room (null = no room selected)
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  // Track canvas size (for responsive design)
  const [stageSize, setStageSize] = useState({ 
    width: 800, 
    height: 600 
  });
  
  // Track loaded image size (for scaling)
  const [imageSize, setImageSize] = useState({ 
    width: 800, 
    height: 600 
  });
  
  // ========== EFFECTS ==========
  // Handle window resizing
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
    
    handleResize(); // Initial size
    window.addEventListener('resize', handleResize);
    
    // Cleanup: remove listener when component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Run once on mount
  
  // ========== DERIVED DATA ==========
  // Calculate scale to fit image in container
  const scale = Math.min(
    stageSize.width / imageSize.width,
    stageSize.height / imageSize.height
  ) * 0.9; // 90% to add some padding
  
  // Get rooms for current floor
  const currentFloorRooms = roomCoordinates.filter(
    room => room.floor === currentFloor
  );
  
  // ========== HELPER FUNCTIONS ==========
  // Get classes for a specific room and current period
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
      ...room,           // Spread existing room data
      classes: classes   // Add classes array
    });
  };
  
  // ========== RENDER ==========
  return (
    <div className="App">
      {/* Header with controls */}
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
      
      {/* Konva canvas */}
      <div className="map-container">
        <Stage 
          width={stageSize.width} 
          height={stageSize.height}
          scaleX={scale}
          scaleY={scale}
        >
          <Layer>
            {/* Background floor plan image */}
            <FloorPlanImage 
              floor={currentFloor} 
              onLoad={handleImageLoad} 
            />
            
            {/* Clickable room overlays */}
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
      
      {/* Room details modal (only shows if room selected) */}
      {selectedRoom && (
        <RoomModal
          room={selectedRoom}
          period={currentPeriod}
          onClose={() => setSelectedRoom(null)}
        />
      )}
      
      {/* Info panel */}
      <div className="info-panel">
        {/* ... instructions ... */}
      </div>
    </div>
  );
}
```

**Key Takeaways:**
- State variables track user's selections
- useEffect handles side effects (window resize)
- Helper functions process data
- Conditional rendering (`{selectedRoom && ...}`)
- Props pass data to child components

### 2. FloorPlanImage - Loading Images in Konva

```javascript
import useImage from 'use-image';

const FloorPlanImage = ({ floor, onLoad }) => {
  // useImage hook loads image from URL
  // Returns [image, status]
  const [image] = useImage(`/floor-plans/floor-${floor}.png`);
  //     ↑ loaded image object
  //                     ↑ image URL (in public folder)
  
  // Call onLoad callback when image loads
  useEffect(() => {
    if (image && onLoad) {
      onLoad(image); // Pass image to parent
    }
  }, [image, onLoad]);
  
  // Render Konva Image component
  return <KonvaImage image={image} />;
};
```

**How it works:**
1. `useImage` fetches image from URL
2. Returns `null` while loading, then image object
3. When image loads, call `onLoad` to notify parent
4. Parent can use image dimensions for scaling

### 3. RoomPolygon - Interactive Room Overlays

```javascript
const RoomPolygon = ({ room, onClick, isHighlighted }) => {
  // Extract position and size from room object
  const { x, y, width, height } = room;
  
  return (
    <>
      {/* Rectangle overlay for room */}
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        
        // Conditional fill color
        fill={isHighlighted 
          ? 'rgba(59, 130, 246, 0.3)'  // Blue if has classes
          : 'rgba(59, 130, 246, 0.1)'  // Light blue if empty
        }
        
        // Conditional border
        stroke={isHighlighted ? '#3b82f6' : '#60a5fa'}
        strokeWidth={isHighlighted ? 3 : 1}
        
        // Click handlers
        onClick={onClick}
        onTap={onClick}  // For touch devices
        
        // Hover effect - change cursor
        onMouseEnter={(e) => {
          const container = e.target.getStage().container();
          container.style.cursor = 'pointer';
        }}
        onMouseLeave={(e) => {
          const container = e.target.getStage().container();
          container.style.cursor = 'default';
        }}
      />
      
      {/* Room number label */}
      <Text
        x={x}
        y={y + height / 2 - 10}  // Center vertically
        width={width}
        text={room.number}
        fontSize={16}
        fontStyle="bold"
        fill="#1e40af"
        align="center"
        listening={false}  // Don't intercept clicks
      />
    </>
  );
};
```

**Key Concepts:**
- **Conditional rendering**: Different colors based on state
- **Event handling**: onClick, onMouseEnter, onMouseLeave
- **React Fragment** (`<>...</>`): Return multiple elements
- **listening={false}**: Text doesn't block clicks to rectangle

### 4. RoomModal - Popup Component

```javascript
const RoomModal = ({ room, period, onClose }) => {
  return (
    // Overlay covers entire screen
    <div className="modal-overlay" onClick={onClose}>
      {/* Modal content - stop propagation */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/*         ↑ Prevent clicks from closing modal */}
        
        {/* Header */}
        <div className="modal-header">
          <h2>Room {room.number}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        {/* Content */}
        <div className="modal-content">
          {/* Room info */}
          <div className="room-info">
            <p><strong>Floor:</strong> {room.floor}</p>
            <p><strong>Room Type:</strong> {room.type}</p>
            <p><strong>Selected Period:</strong> {period}</p>
          </div>
          
          {/* Classes section */}
          <div className="classes-section">
            <h3>Classes During {period}</h3>
            
            {/* Conditional rendering */}
            {room.classes && room.classes.length > 0 ? (
              // Has classes - map over them
              room.classes.map((classItem, index) => (
                <div key={index} className="class-card">
                  <h4>{classItem.description}</h4>
                  <p><strong>Teacher:</strong> {classItem.teacher}</p>
                  <p><strong>Students:</strong> {classItem.studentBreakdown}</p>
                </div>
              ))
            ) : (
              // No classes - show message
              <div className="no-classes">
                <p>No classes scheduled</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```

**Key Patterns:**
- **Event propagation**: `e.stopPropagation()` prevents bubbling
- **Conditional rendering**: Ternary operator (`condition ? true : false`)
- **Array mapping**: `.map()` creates elements from array
- **Key prop**: React needs unique `key` for list items

### 5. FloorSelector & PeriodSelector - Controlled Inputs

```javascript
const FloorSelector = ({ currentFloor, onFloorChange }) => {
  const floors = [1, 2, 3];
  
  return (
    <div className="selector">
      <label htmlFor="floor-select">Floor</label>
      <select 
        id="floor-select"
        value={currentFloor}  // Controlled component
        onChange={(e) => onFloorChange(parseInt(e.target.value))}
        //                ↑ Convert string to number
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
```

**Controlled vs Uncontrolled:**
- **Controlled**: React state controls value (`value={currentFloor}`)
- **Uncontrolled**: DOM controls value (use `ref`)
- **Best practice**: Use controlled components

---

## Data Flow

### Complete Flow Example: User Clicks Room

```
1. User clicks Room 101
   ↓
2. RoomPolygon receives click event
   onClick={() => handleRoomClick(room)}
   ↓
3. handleRoomClick in App.js executes
   const classes = getClassesForRoom(room.number);
   setSelectedRoom({ ...room, classes });
   ↓
4. App.js state updates
   selectedRoom: null → { floor: 1, number: '101', classes: [...] }
   ↓
5. React re-renders App component
   ↓
6. Conditional render evaluates to true
   {selectedRoom && <RoomModal ... />}
   ↓
7. RoomModal renders with room data
   ↓
8. User sees modal with class information
```

### Props vs State

**State** (useState):
- Data that belongs to THIS component
- Can change over time
- Triggers re-render when updated

```javascript
const [count, setCount] = useState(0);
```

**Props**:
- Data passed FROM parent TO child
- Read-only (child can't modify)
- Component re-renders when props change

```javascript
<Child name="Isaac" age={17} />

function Child({ name, age }) {
  // Can read, but not modify
  return <p>{name} is {age}</p>;
}
```

### Lifting State Up

When two components need to share state, lift it to their common parent:

```javascript
function Parent() {
  // State lives here
  const [selectedFloor, setSelectedFloor] = useState(1);
  
  return (
    <>
      {/* Both children share same state */}
      <FloorSelector 
        floor={selectedFloor} 
        onChange={setSelectedFloor} 
      />
      <FloorMap floor={selectedFloor} />
    </>
  );
}
```

---

## Interactive Canvas with Konva

### Scaling and Responsiveness

```javascript
// Calculate scale to fit image in container
const scale = Math.min(
  containerWidth / imageWidth,
  containerHeight / imageHeight
) * 0.9; // 90% to add padding

// Apply scale to Stage
<Stage 
  width={containerWidth}
  height={containerHeight}
  scaleX={scale}
  scaleY={scale}
>
  {/* Content is automatically scaled */}
</Stage>
```

**How it works:**
- `Math.min` ensures image fits in both dimensions
- Multiply by 0.9 to add 10% padding
- Konva scales all children automatically

### Layering

```javascript
<Stage width={800} height={600}>
  <Layer>
    {/* Background image */}
    <FloorPlanImage />
  </Layer>
  
  <Layer>
    {/* Interactive elements on top */}
    <RoomPolygon />
    <RoomPolygon />
  </Layer>
  
  <Layer>
    {/* UI elements (always on top) */}
    <Text />
  </Layer>
</Stage>
```

**Why layers?**
- Better performance (can cache layers)
- Easier to manage z-index
- Can show/hide entire layers

### Hit Detection

Konva automatically handles hit detection:

```javascript
<Rect
  x={100}
  y={100}
  width={150}
  height={100}
  onClick={(e) => {
    console.log('Clicked!');
    console.log('X:', e.evt.clientX);
    console.log('Y:', e.evt.clientY);
  }}
/>
```

**Event object:**
- `e.evt` - Native browser event
- `e.target` - Konva shape that was clicked
- `e.currentTarget` - Shape that has the event handler

---

## State Management

### When to Use State

Use state when:
- ✅ Value changes over time (user interactions)
- ✅ Value needs to trigger re-render
- ✅ Value is specific to this component

Don't use state when:
- ❌ Value never changes (use const)
- ❌ Value can be calculated from other state (derive it)
- ❌ Value is the same for all instances (use props)

### Derived State

Instead of storing calculated values, compute them:

```javascript
// ❌ Bad - storing derived state
const [rooms, setRooms] = useState(allRooms);
const [currentFloorRooms, setCurrentFloorRooms] = useState([]);

useEffect(() => {
  setCurrentFloorRooms(rooms.filter(r => r.floor === currentFloor));
}, [currentFloor, rooms]);

// ✅ Good - calculating derived state
const [rooms, setRooms] = useState(allRooms);
const currentFloorRooms = rooms.filter(r => r.floor === currentFloor);
```

### State Updates

State updates are **asynchronous**:

```javascript
const [count, setCount] = useState(0);

// ❌ Wrong - doesn't work as expected
setCount(count + 1);
setCount(count + 1);
// count is still 1, not 2!

// ✅ Correct - use functional update
setCount(prev => prev + 1);
setCount(prev => prev + 1);
// count is 2
```

---

## Event Handling

### Synthetic Events

React wraps browser events:

```javascript
function handleClick(e) {
  // e is a SyntheticEvent (React wrapper)
  e.preventDefault();    // Prevent default action
  e.stopPropagation();   // Stop event bubbling
  
  // Access native event
  console.log(e.nativeEvent);
}

<button onClick={handleClick}>Click me</button>
```

### Event Delegation

React automatically delegates events (single listener at root):

```javascript
// Don't worry about adding/removing listeners
{rooms.map(room => (
  <div onClick={() => handleRoomClick(room.id)}>
    {room.name}
  </div>
))}
// React handles this efficiently
```

### Common Patterns

```javascript
// Inline arrow function (creates new function each render)
<button onClick={() => setCount(count + 1)}>+</button>

// Defined function (better performance for complex handlers)
const handleIncrement = () => setCount(count + 1);
<button onClick={handleIncrement}>+</button>

// With parameters
<button onClick={() => updateRoom(roomId, data)}>Update</button>
```

---

## Best Practices

### 1. Component Organization

```javascript
function MyComponent({ prop1, prop2 }) {
  // 1. Hooks (always at top, same order)
  const [state1, setState1] = useState(initial);
  const [state2, setState2] = useState(initial);
  useEffect(() => { /* ... */ }, []);
  
  // 2. Derived values
  const derived = state1 + state2;
  
  // 3. Event handlers
  const handleClick = () => { /* ... */ };
  
  // 4. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### 2. Props Destructuring

```javascript
// ✅ Good - clear what props are used
function Room({ number, floor, type, onClick }) {
  return <div onClick={onClick}>{number}</div>;
}

// ❌ Harder to read
function Room(props) {
  return <div onClick={props.onClick}>{props.number}</div>;
}
```

### 3. Conditional Rendering

```javascript
// For simple conditions
{isLoading && <Spinner />}

// For if-else
{isLoading ? <Spinner /> : <Content />}

// For multiple conditions
{status === 'loading' && <Spinner />}
{status === 'error' && <Error />}
{status === 'success' && <Content />}
```

### 4. Lists and Keys

```javascript
// ✅ Good - unique, stable key
{rooms.map(room => (
  <RoomCard key={room.id} room={room} />
))}

// ⚠️ OK for static lists only
{rooms.map((room, index) => (
  <RoomCard key={index} room={room} />
))}

// ❌ Bad - can cause bugs
{rooms.map(room => (
  <RoomCard room={room} />
))}
```

### 5. Performance Optimization

```javascript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return rooms.filter(/* complex logic */);
}, [rooms]); // Only recalculate when rooms change

// Memoize callback functions
const handleClick = useCallback(() => {
  doSomething(prop1);
}, [prop1]); // Only recreate when prop1 changes
```

---

## Common Patterns

### Pattern 1: Loading States

```javascript
function DataLoader() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await api.getData();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>Data: {JSON.stringify(data)}</div>;
}
```

### Pattern 2: Form Handling

```javascript
function Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    room: ''
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit:', formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      {/* ... more fields ... */}
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Pattern 3: Modal Management

```javascript
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  
  const openModal = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };
  
  return (
    <>
      <button onClick={() => openModal({ id: 1 })}>
        Open Modal
      </button>
      
      {isModalOpen && (
        <Modal data={modalData} onClose={closeModal} />
      )}
    </>
  );
}
```

### Pattern 4: Custom Hooks

Extract reusable logic:

```javascript
// Custom hook
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
}

// Usage
function MyComponent() {
  const { width, height } = useWindowSize();
  return <div>Window: {width} x {height}</div>;
}
```

---

## Next Steps

Now that you understand the fundamentals, try:

1. **Add a search feature**: Search for rooms or teachers
2. **Add animations**: Animate room highlights with Konva
3. **Add a zoom feature**: Let users zoom into floor plans
4. **Add teacher profiles**: Click teacher name to see schedule
5. **Add statistics**: Show room utilization by period
6. **Add pathfinding**: Show route between two rooms

### Resources

- [React Docs](https://react.dev)
- [Konva Docs](https://konvajs.org/docs/)
- [React Konva Docs](https://konvajs.org/docs/react/)

---

**Questions?** Review the code, experiment with changes, and see what happens!
