# React Resource Planner

A DAW-inspired visual resource planning tool for consultancies to plan resource allocations by role across a timeline. Build allocations on a timeline, adjust them with arrow buttons, see real-time cost calculations, get over-allocation warnings, and undo/redo changes.

![Resource Planner](https://img.shields.io/badge/React-18-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-cyan) ![Vite](https://img.shields.io/badge/Vite-5.0-purple)

## Features

- **Visual Timeline**: Plan resources across a 13-week timeline (Week 0-12)
- **Multiple Roles**: 6 pre-configured roles with distinct colors
- **Smart Splitting**: Automatically splits resources when hours exceed 40h/week
- **Drag to Reposition**: Click and drag resources to change start week
- **Arrow Controls**: Adjust duration, hours, role, and start week with dedicated controls
- **Grouping**: Related resources are grouped together with collective controls
- **Undo/Redo**: Full history support with keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- **Cost Tracking**: Real-time cost calculations at $250/hour
- **Over-Allocation Warnings**: Get alerts when a role exceeds 80h/week
- **Collapse/Expand**: Hide individual resources to focus on group totals
- **Dark Theme**: Professional dark UI with smooth animations

## Tech Stack

- **React 18** - Functional components with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **No Backend** - Runs entirely in the browser

## Setup Instructions

### Prerequisites

Make sure you have Node.js installed (version 16 or higher). You can check by running:

```bash
node --version
npm --version
```

If you don't have Node.js, download it from [nodejs.org](https://nodejs.org/)

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all the required packages:
- React and React DOM
- Vite and plugins
- Tailwind CSS and dependencies
- Lucide React for icons

### Step 2: Start Development Server

Once installation is complete, start the development server:

```bash
npm run dev
```

You should see output like:

```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Step 3: Open in Browser

Open your browser and navigate to:

```
http://localhost:5173
```

You should see the Resource Planner application running!

### Step 4: Build for Production (Optional)

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` folder, ready to deploy.

To preview the production build locally:

```bash
npm run preview
```

## How to Use

### Adding Resources

1. Click the **"Add Allocation"** button in the header
2. A new resource appears with default settings (Senior Developer, 40h, 2 weeks, starting at Week 1)

### Adjusting Resources

1. **Select a resource** by clicking on its bar (gets yellow outline)
2. Use the **4 control boxes** at the top:
   - **Duration**: Use left/right arrows to adjust number of weeks (1-12)
   - **Hours**: Use up/down arrows to adjust total hours (5-200)
   - **Role**: Use left/right arrows to cycle through roles
   - **Start Week**: Use left/right arrows to shift position on timeline

### Dragging Resources

1. Click and hold on a resource bar
2. Drag left or right to change the start week
3. Release to save the new position

### Automatic Splitting

When you increase hours beyond 40h/week:
- Resources automatically split into multiple people
- Each person works 40h max (except the last one with remaining hours)
- They appear as "Developer 1", "Developer 2", etc.

When you decrease hours below 40h:
- Multiple resources merge back into a single resource

### Group Controls

Each group has a header (fades when single resource) with:
- **Up/Down arrows**: Adjust total hours for the entire group
- **Chevron**: Collapse/expand individual resources (only visible with multiple resources)
- **Trash icon**: Delete the entire group

### Undo/Redo

- Click the undo/redo buttons in the header
- Or use keyboard shortcuts:
  - **Ctrl+Z** (or Cmd+Z on Mac): Undo
  - **Ctrl+Y** or **Ctrl+Shift+Z**: Redo

### Understanding Warnings

Yellow warning panels appear when a role exceeds 80h/week total across all allocations. This helps you identify over-allocation issues.

### Cost Summary

At the bottom, see:
- Total allocations, hours, and cost
- Cost breakdown by role with visual bar charts
- All costs calculated at $250/hour

## Project Structure

```
src/
├── App.jsx                    # Main app with state management
├── main.jsx                   # React entry point
├── styles/
│   └── index.css             # Tailwind CSS and custom styles
└── components/
    ├── Controls.jsx          # 4 control boxes with arrows
    ├── Timeline.jsx          # Week headers and grid
    ├── GroupHeader.jsx       # Group total with controls
    ├── ResourceRow.jsx       # Individual resource bar
    ├── Summary.jsx           # Stats and cost breakdown
    └── Warnings.jsx          # Over-allocation alerts
```

## Available Roles

1. **Senior Developer** - Blue (#3b82f6)
2. **Junior Developer** - Purple (#8b5cf6)
3. **Designer** - Pink (#ec4899)
4. **Product Manager** - Orange (#f59e0b)
5. **QA Engineer** - Green (#10b981)
6. **DevOps Engineer** - Cyan (#06b6d4)

## Constants

- Hourly rate: **$250/hour**
- Full-time threshold: **40h/week**
- Over-allocation warning: **80h/week** total per role
- Timeline: **Weeks 0-12**
- Week width: **80px**

## Key Behaviors

### Selection System
- Click any resource bar to select (yellow ring)
- Selection persists until clicking another resource
- Controls are disabled when nothing is selected

### Height Calculation
Resource bar height is proportional to hours:
- Formula: `(hours / 40) × 64px`
- 40h = full height (64px)
- 20h = half height (32px)
- 80h = double height (128px) but auto-splits into 2×40h

### Positioning
- Each week is 80px wide
- Bars start at: `startWeek × 80px + 4px`
- Bars width: `weeks × 80px - 8px`
- This creates 4px padding on each side

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port. Check the terminal output for the correct URL.

### Installation Errors

If you get errors during `npm install`:
1. Delete the `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again

### Build Errors

Make sure you're using Node.js version 16 or higher:
```bash
node --version
```

### Styles Not Appearing

If Tailwind CSS styles don't appear:
1. Stop the dev server (Ctrl+C)
2. Run `npm run dev` again
3. Hard refresh your browser (Ctrl+Shift+R)

## Development Tips

- **Hot Reload**: The app automatically reloads when you save files
- **Console**: Open browser DevTools (F12) to see any errors
- **State**: All state is managed in `App.jsx` - check there if something's not working
- **Styling**: Use Tailwind utility classes - check [tailwindcss.com](https://tailwindcss.com)

## License

MIT License - Feel free to use this for your projects!

---

**Need help?** Check the code comments in each file - they explain the key logic and behaviors.
