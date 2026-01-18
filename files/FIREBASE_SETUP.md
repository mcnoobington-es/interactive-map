# Firebase Setup Guide for BHS School Map

This guide will walk you through setting up Firebase for your school mapping application.

## Table of Contents

1. [Why Firebase?](#why-firebase)
2. [Creating Your Firebase Project](#creating-your-firebase-project)
3. [Setting Up Firestore Database](#setting-up-firestore-database)
4. [Configuring Your Application](#configuring-your-application)
5. [Data Structure](#data-structure)
6. [Uploading Initial Data](#uploading-initial-data)
7. [Security Rules](#security-rules)
8. [Authentication (Optional)](#authentication-optional)
9. [Storage for Floor Plans (Optional)](#storage-for-floor-plans-optional)
10. [Best Practices](#best-practices)

## Why Firebase?

Firebase provides several benefits for your school mapping app:

- **Real-time updates**: Changes to class schedules sync instantly
- **Cloud storage**: No need to manage your own servers
- **Scalability**: Handles increasing users automatically
- **Authentication**: Built-in user management
- **Free tier**: Generous free quota for school projects
- **Easy integration**: Simple JavaScript SDK

## Creating Your Firebase Project

### Step 1: Create Firebase Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Google account (use school Gmail if available)
3. Accept the terms of service

### Step 2: Create New Project

1. Click **"Add project"** or **"Create a project"**
2. Enter project name: `bhs-school-map`
3. Click **Continue**
4. Enable/disable Google Analytics (optional for this project)
5. Click **Create project**
6. Wait for project to be created (30-60 seconds)

### Step 3: Register Web App

1. In your new project, click the **Web icon** (</>)
2. Enter app nickname: `BHS Map Web App`
3. Check **"Also set up Firebase Hosting"** (optional but recommended)
4. Click **"Register app"**
5. **IMPORTANT**: Copy the `firebaseConfig` object (you'll need this soon)

Example config:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB1234567890abcdefghijk",
  authDomain: "bhs-school-map.firebaseapp.com",
  projectId: "bhs-school-map",
  storageBucket: "bhs-school-map.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Setting Up Firestore Database

### Step 1: Create Firestore Database

1. In Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll secure it later)
4. Choose location closest to your school (e.g., `us-central1` for USA)
5. Click **"Enable"**

### Step 2: Understand Test Mode

**Test Mode** means:
- ✅ Anyone can read data
- ✅ Anyone can write data
- ⚠️ TEMPORARY - automatically expires in 30 days
- 🔒 We'll add proper security rules later

## Configuring Your Application

### Step 1: Add Firebase Config

1. Open your project: `src/firebase/config.js`
2. Replace the placeholder config with your actual config:

```javascript
// Replace this entire object with yours from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 2: Verify Connection

Create a test file `src/testFirebase.js`:

```javascript
import { db } from './firebase/config';
import { collection, getDocs } from 'firebase/firestore';

async function testConnection() {
  try {
    const testCollection = collection(db, 'test');
    const snapshot = await getDocs(testCollection);
    console.log('✅ Firebase connected!');
    console.log('Documents:', snapshot.size);
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
```

Run this in your browser console after starting the app.

## Data Structure

Your Firestore database will use this structure:

```
bhs-school-map (Database)
├── rooms (Collection)
│   ├── room-001 (Document)
│   │   ├── floor: 1
│   │   ├── number: "101"
│   │   ├── x: 150
│   │   ├── y: 700
│   │   ├── width: 120
│   │   ├── height: 150
│   │   └── type: "classroom"
│   └── room-002 (Document)
│       └── ...
│
├── classes (Collection)
│   ├── class-001 (Document)
│   │   ├── classId: "ALG_1_1"
│   │   ├── block: "Period 3"
│   │   ├── description: "Algebra 1 Sec 1"
│   │   ├── teacher: "Romio, Sol"
│   │   ├── room: "Room 208"
│   │   ├── studentCount: "8"
│   │   └── studentBreakdown: "8 (M: 4, F: 3)"
│   └── class-002 (Document)
│       └── ...
│
├── teachers (Collection)
│   ├── teacher-001 (Document)
│   │   ├── name: "Romio, Sol"
│   │   ├── department: "Mathematics"
│   │   ├── email: "sromio@school.edu"
│   │   └── room: "208"
│   └── teacher-002 (Document)
│       └── ...
│
└── students (Collection - Optional)
    └── ...
```

### Why This Structure?

- **Flat collections**: Easier to query and manage
- **Denormalized data**: Room info duplicated for faster reads
- **Flexible**: Easy to add new fields later
- **Scalable**: Can handle thousands of documents

## Uploading Initial Data

### Option 1: Manual Upload (Small Dataset)

1. Go to Firestore Database in Firebase Console
2. Click **"Start collection"**
3. Collection ID: `rooms`
4. Add first document manually:
   - Document ID: Auto-ID
   - Fields: floor (number), number (string), x (number), etc.

### Option 2: Programmatic Upload (Recommended)

Create `src/uploadData.js`:

```javascript
import { batchUploadClasses, batchUploadRooms } from './firebase/services';
import { classData } from './data/classData';
import { roomCoordinates } from './data/roomCoordinates';

async function uploadAllData() {
  console.log('Starting data upload...');
  
  try {
    // Upload rooms
    console.log('Uploading rooms...');
    await batchUploadRooms(roomCoordinates);
    console.log('✅ Rooms uploaded!');
    
    // Upload classes
    console.log('Uploading classes...');
    await batchUploadClasses(classData);
    console.log('✅ Classes uploaded!');
    
    console.log('🎉 All data uploaded successfully!');
  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}

// Uncomment to run:
// uploadAllData();
```

Run this ONCE by:
1. Uncommenting `uploadAllData()`
2. Running your app: `npm start`
3. Check browser console for progress
4. Verify in Firebase Console under Firestore Database
5. Comment out `uploadAllData()` to prevent duplicates

### Option 3: Firebase CLI Import

Save your data as JSON and use Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase firestore:import data-export/
```

## Security Rules

After uploading data, secure your database:

### Basic Rules (Public Read, No Write)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can read rooms and classes
    match /rooms/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    
    match /classes/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    
    match /teachers/{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

### Authenticated Users Only

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

### Admin Write Access

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.admin == true;
    }
    
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
  }
}
```

To set admin status:
```javascript
// In Firebase Console > Authentication > Users
// Click on a user > Custom claims
// Set: { "admin": true }
```

## Authentication (Optional)

To require users to sign in:

### Step 1: Enable Authentication

1. Firebase Console > **Authentication**
2. Click **"Get started"**
3. Click **"Email/Password"**
4. Enable **"Email/Password"**
5. Save

### Step 2: Add Sign In to Your App

Create `src/components/SignIn.js`:

```javascript
import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

function SignIn({ onSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSignIn();
    } catch (error) {
      alert('Sign in failed: ' + error.message);
    }
  };
  
  return (
    <form onSubmit={handleSignIn}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="School Email"
        required
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Sign In</button>
    </form>
  );
}

export default SignIn;
```

### Step 3: Protect Your App

Wrap your App component:

```javascript
import { useState, useEffect } from 'react';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import SignIn from './components/SignIn';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <SignIn onSignIn={() => setUser(auth.currentUser)} />;
  
  // Your existing App component code
  return (
    <div className="App">
      {/* ... */}
    </div>
  );
}
```

## Storage for Floor Plans (Optional)

Instead of storing floor plans locally, use Firebase Storage:

### Step 1: Enable Storage

1. Firebase Console > **Storage**
2. Click **"Get started"**
3. Start in test mode
4. Click **"Done"**

### Step 2: Upload Floor Plans

```javascript
import { storage } from './firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

async function uploadFloorPlan(file, floorNumber) {
  const storageRef = ref(storage, `floor-plans/floor-${floorNumber}.png`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}
```

### Step 3: Update Image Component

```javascript
const FloorPlanImage = ({ floor, onLoad }) => {
  const [imageUrl, setImageUrl] = useState('');
  
  useEffect(() => {
    const storageRef = ref(storage, `floor-plans/floor-${floor}.png`);
    getDownloadURL(storageRef).then(setImageUrl);
  }, [floor]);
  
  const [image] = useImage(imageUrl);
  // ... rest of component
};
```

## Best Practices

### 1. Cost Management

Firebase free tier includes:
- 50,000 reads/day
- 20,000 writes/day
- 1GB storage
- 10GB/month transfer

**Tips to stay free:**
- Cache data locally using localStorage
- Implement pagination for large lists
- Use Firebase Hosting (free for < 10GB)

### 2. Performance

```javascript
// ✅ Good: Query only what you need
const q = query(
  collection(db, 'classes'),
  where('room', '==', 'Room 101'),
  where('block', '==', 'Period 1')
);

// ❌ Bad: Fetch everything then filter
const all = await getDocs(collection(db, 'classes'));
const filtered = all.filter(/* ... */);
```

### 3. Error Handling

```javascript
try {
  const data = await getAllClasses();
  setClasses(data);
} catch (error) {
  console.error('Error:', error);
  setError('Failed to load classes. Please refresh.');
}
```

### 4. Environment Variables

For production, use environment variables:

Create `.env`:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

Update config:
```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // ...
};
```

### 5. Backup Your Data

Export regularly:
```bash
firebase firestore:export backup-$(date +%Y%m%d)
```

## Troubleshooting

### "Permission Denied" Error

**Cause**: Security rules too restrictive
**Fix**: Check your rules allow the operation

### "Firebase not initialized"

**Cause**: Config not set properly
**Fix**: Verify firebase/config.js has correct values

### Data Not Appearing

**Cause**: Upload didn't complete
**Fix**: Check browser console for errors

### Quota Exceeded

**Cause**: Too many reads/writes
**Fix**: Implement caching, reduce queries

## Next Steps

After Firebase is set up:

1. ✅ Test reading data from Firestore
2. ✅ Update room coordinates to match your floor plans
3. ✅ Set up proper security rules
4. ✅ Consider adding authentication
5. ✅ Deploy to Firebase Hosting

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/data-model)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)

---

Need help? Check the main README.md or contact the development team!
