# Building the Chrome-like Browser

This document explains how to run and build the Chrome-like browser application.

## Prerequisites

Before you can run or build the application, you need to have the following installed:

- Node.js (version 12 or higher)
- npm (usually comes with Node.js)

## Installing Dependencies

To install all required dependencies, run:

```bash
npm install
```

## Running in Development Mode

To run the application in development mode:

```bash
npm start
```

This will launch the Electron application with the Chrome-like interface.

## Building for Distribution

The application can be built for different platforms using electron-builder:

### Build for the current platform (without creating installer)

```bash
npm run build
```

### Build for the current platform (with installer)

```bash
npm run dist
```

This will create distributable files in the `dist/` directory.

## Platform-Specific Requirements

### Linux

If you encounter issues running the application on Linux, you might need to install some additional libraries:

```bash
# Ubuntu/Debian
sudo apt-get install libgtk-3-0 libxss1 libnss3 libasound2 libgbm1

# CentOS/RHEL/Fedora
sudo dnf install gtk3 libXScrnSaver nss alsa-lib gbm
```

### Windows

Windows builds are created as NSIS installers by default.

### macOS

macOS builds are created as DMG files by default.

## Troubleshooting

### Running as root

If you get an error about running as root without --no-sandbox, this is expected when running Electron as the root user. The application is already configured to run with the --no-sandbox flag.

### Missing system libraries

If Electron fails to start with errors about missing libraries, install the required system libraries as mentioned in the Linux section above.

### Memory issues

Electron applications can be memory-intensive. Ensure your system has sufficient RAM to run the application.

## Project Structure

- `main.js` - Main Electron process that controls the application lifecycle
- `preload.js` - Runs before the renderer process and provides a secure bridge between the main process and the renderer
- `index.html` - The UI of the browser application with navigation controls and iframe for browsing
- `package.json` - Configuration file with dependencies and build scripts
- `README.md` - General information about the project
- `BUILDING.md` - This file