# Quick Start Guide

Get your BHS School Map running in 5 minutes!

## Prerequisites

- Node.js 16+ installed ([Download here](https://nodejs.org/))
- A code editor (VS Code recommended)
- Your floor plan PDFs converted to PNG images

## Installation Steps

### 1. Install Dependencies

```bash
cd school-map
npm install
```

This will take 2-3 minutes to download all packages.

### 2. Add Floor Plans

1. Create folder: `public/floor-plans/`
2. Add your floor plan images:
   - `floor-1.png`
   - `floor-2.png`
   - `floor-3.png`

**Don't have images yet?**
- Use online tool: [pdf2png.com](https://pdf2png.com)
- Or temporarily use placeholder images to test

### 3. Start Development Server

```bash
npm start
```

The app will automatically open at `http://localhost:3000`

## First Time Setup

### Adjust Room Coordinates

The room positions need to match your floor plans:

1. Open `src/data/roomCoordinates.js`
2. For each room, adjust the x, y, width, height values
3. Save and the app will auto-reload

**Tips for finding coordinates:**
- Open your floor plan image in an image editor (GIMP, Photoshop, etc.)
- Use the ruler/measure tool to find pixel positions
- Start with one room, test, then adjust others

### Verify Class Data

Check that your class data loaded correctly:

1. Open browser console (F12)
2. Look for any error messages
3. Verify data in `src/data/classData.js`

## Testing

### Basic Functionality

✓ Floor selector changes floors
✓ Period selector changes periods  
✓ Clicking rooms shows modal
✓ Rooms with classes are highlighted
✓ Modal shows correct class information

### If Something Doesn't Work

1. **Floor plan not showing?**
   - Check image is in `public/floor-plans/`
   - Check image name matches exactly: `floor-1.png`
   - Try refreshing browser (Ctrl+Shift+R)

2. **Rooms not clickable?**
   - Verify `roomCoordinates.js` has correct floor numbers
   - Check coordinates are positive numbers
   - Ensure width and height are reasonable (50-500px)

3. **Classes not showing?**
   - Check `classData.js` for errors
   - Verify room names match format: "Room 101"
   - Check period names match exactly

4. **Console errors?**
   - Read the error message carefully
   - Check for typos in file names
   - Verify all imports are correct

## Next Steps

Once basic functionality works:

1. 📖 Read [README.md](README.md) for full documentation
2. 🔥 Follow [FIREBASE_SETUP.md](FIREBASE_SETUP.md) to add cloud features
3. 💻 Study [CODE_WALKTHROUGH.md](CODE_WALKTHROUGH.md) to understand the code
4. 🎨 Customize colors and styling in `src/App.css`
5. ➕ Add more features (search, statistics, etc.)

## Common Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Install new package
npm install package-name
```

## Getting Help

If you're stuck:

1. Check the troubleshooting sections in README.md
2. Review the code walkthrough for explanations
3. Check browser console for error messages
4. Try searching the error on Google/Stack Overflow

## Project Structure Quick Reference

```
school-map/
├── public/
│   └── floor-plans/          ← Add your images here
├── src/
│   ├── App.js                ← Main application
│   ├── App.css               ← Styles
│   ├── components/           ← UI components
│   ├── data/
│   │   ├── classData.js      ← Your class schedules
│   │   └── roomCoordinates.js ← Adjust these!
│   └── firebase/             ← Cloud features (optional)
└── package.json
```

## Success Checklist

Before moving on, make sure:

- [ ] App runs without errors
- [ ] Floor plans display correctly
- [ ] Can switch between floors
- [ ] Can switch between periods
- [ ] Can click on rooms
- [ ] Modal shows room information
- [ ] Classes display in modal

---

**Ready to go?** Start customizing and building your perfect school map! 🚀
