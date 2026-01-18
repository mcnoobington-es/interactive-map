# BHS Interactive School Map

An interactive web-based school mapping application built with React and Konva.js that allows students and staff to navigate the school, view room locations, and see class schedules by period.

## Features

- **Interactive Floor Plans**: Click on rooms to view detailed information
- **Period-Based Scheduling**: View which classes are happening in each room by period
- **Multi-Floor Navigation**: Switch between floors 1, 2, and 3
- **Real-time Class Information**: See teacher names, student counts, and class descriptions
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Firebase Integration**: Ready for cloud-based data storage and real-time updates

## Technology Stack

- **React 18**: Modern UI framework
- **Konva.js**: HTML5 Canvas library for interactive graphics
- **Firebase**: Backend services (Firestore, Authentication, Storage)
- **CSS3**: Modern styling with animations

## Project Structure

```
school-map/
├── public/
│   ├── index.html
│   └── floor-plans/          # Add your floor plan images here
│       ├── floor-1.png
│       ├── floor-2.png
│       └── floor-3.png
├── src/
│   ├── components/
│   │   ├── FloorSelector.js  # Floor selection dropdown
│   │   ├── PeriodSelector.js # Period selection dropdown
│   │   └── RoomModal.js       # Room details modal
│   ├── data/
│   │   ├── classData.js       # Class schedule data
│   │   └── roomCoordinates.js # Room positions on floor plans
│   ├── firebase/
│   │   ├── config.js          # Firebase configuration
│   │   └── services.js        # Firebase CRUD operations
│   ├── App.js                 # Main application component
│   ├── App.css                # Application styles
│   ├── index.js               # React entry point
│   └── index.css              # Global styles
├── package.json
└── README.md
```

## Installation

### Prerequisites

- Node.js 16+ and npm installed
- Git installed
- A Firebase account (for backend features)

### Step 1: Clone or Download the Project

```bash
# If using git
git clone <your-repo-url>
cd school-map

# Or download and extract the ZIP file
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- React and React-DOM
- Konva.js and React-Konva
- Firebase SDK
- Other required dependencies

### Step 3: Add Floor Plan Images

1. Create a folder: `public/floor-plans/`
2. Convert your PDF floor plans to PNG/JPG images
3. Name them:
   - `floor-1.png` (or .jpg)
   - `floor-2.png` (or .jpg)
   - `floor-3.png` (or .jpg)

**Converting PDF to Images:**
- Use online tools like pdf2png.com
- Or use tools like Adobe Acrobat, GIMP, or ImageMagick
- Recommended resolution: 1200-2000px width

### Step 4: Adjust Room Coordinates

Open `src/data/roomCoordinates.js` and adjust the x, y, width, and height values to match your actual floor plans. You can do this by:

1. Opening your floor plan image in an image editor
2. Noting the pixel coordinates of each room
3. Updating the values in the file

### Step 5: Run the Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## Firebase Setup (Optional but Recommended)

Firebase provides cloud storage, real-time database, and authentication. Here's how to set it up:

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "bhs-school-map")
4. Follow the setup wizard

### Step 2: Register Your Web App

1. In Firebase Console, click the Web icon (</>)
2. Register app with a nickname (e.g., "BHS Map Web")
3. Copy the configuration object

### Step 3: Add Firebase Config to Your Project

Open `src/firebase/config.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### Step 4: Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your school)

### Step 5: Set Up Collections

Your Firestore will use these collections:
- `rooms`: Room information and coordinates
- `classes`: Class schedules and details
- `teachers`: Teacher information
- `students`: Student rosters (optional)

### Step 6: Upload Initial Data

You can use the provided Firebase services to upload your data:

```javascript
import { batchUploadClasses, batchUploadRooms } from './firebase/services';
import { classData } from './data/classData';
import { roomCoordinates } from './data/roomCoordinates';

// Upload classes
batchUploadClasses(classData);

// Upload rooms
batchUploadRooms(roomCoordinates);
```

### Step 7: Security Rules (Important!)

In Firestore Database > Rules, add:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all authenticated users
    match /rooms/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.auth.token.admin == true;
    }
    
    match /classes/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.auth.token.admin == true;
    }
    
    match /teachers/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.auth.token.admin == true;
    }
  }
}
```

## Customization

### Changing Colors

Edit `src/App.css` to customize the color scheme:

```css
/* Primary color (currently blue) */
fill: 'rgba(59, 130, 246, 0.3)'
stroke: '#3b82f6'

/* Background gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adding More Periods

Edit `src/components/PeriodSelector.js`:

```javascript
const periods = [
  'Period 1',
  'Period 2',
  // ... add more periods
  'Period 7',
  'Period 8'
];
```

### Adding More Floors

1. Add floor plan image to `public/floor-plans/`
2. Add room coordinates to `src/data/roomCoordinates.js`
3. Update `src/components/FloorSelector.js`:

```javascript
const floors = [1, 2, 3, 4]; // Add floor 4
```

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Deployment Options

**Firebase Hosting (Recommended):**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

**Other Options:**
- Netlify: Drag and drop the `build` folder
- Vercel: Connect your GitHub repo
- GitHub Pages: Use `gh-pages` package

## Troubleshooting

### Images Not Loading

- Check that images are in `public/floor-plans/`
- Verify image names match: `floor-1.png`, `floor-2.png`, etc.
- Clear browser cache (Ctrl+Shift+R)

### Room Coordinates Not Aligned

- Use an image editor to get exact pixel coordinates
- Remember coordinates are relative to image top-left corner
- Test by clicking and adjusting values

### Firebase Connection Issues

- Verify your Firebase config is correct
- Check that Firestore is enabled
- Ensure security rules allow read access
- Check browser console for specific error messages

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Future Enhancements

Potential features to add:
- Search functionality for teachers/rooms
- Calendar integration with bell schedules
- Mobile app version with React Native
- QR code generation for room navigation
- Indoor navigation with pathfinding
- Furniture arrangement planning (drag-and-drop desks)
- Admin dashboard for data management
- Real-time occupancy tracking
- Integration with student information system

## Contributing

This project was created for BHS. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For questions or issues:
- Check the troubleshooting section above
- Review the code walkthrough document
- Contact the development team

## License

This project is for educational use at BHS.

---

Built with ❤️ for BHS by Isaac and team
