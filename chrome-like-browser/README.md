# Chrome-like Browser

This is a Chrome-like browser built with Electron. It features a clean interface with navigation buttons, an address bar, and a browser view.

## Features

- Forward and backward navigation buttons
- Address bar for entering URLs
- Refresh button
- Home button that goes to Google
- Status bar showing current URL
- Clean Chrome-like interface

## Requirements

- Node.js (v12 or higher)
- npm
- System libraries: libgtk-3-0, libxss1, libnss3, libasound2, libgbm1

## Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Usage

To start the browser:

```bash
npm start
```

Note: If running in a containerized environment without a display server, the application may not run properly. This application is designed to run on a local machine with a graphical interface.

## How to Use

- Type a URL or search query in the address bar and press Enter to navigate
- Use the back (←) and forward (→) buttons to navigate through history
- Click the home (★) button to go to the default page (Google)
- Click the refresh (⟳) button to reload the current page

## Project Structure

- `main.js` - The main Electron process
- `preload.js` - Security bridge between main and renderer processes
- `index.html` - The browser interface
- `package.json` - Project configuration and dependencies