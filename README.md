# Hacker House Goa 2026 - Frame & Builder ID Generator

A fast, fully client-side web application built for Hacker House Goa 2026. This tool allows attendees and builders to generate custom Profile Frames (1:1 avatars) and Builder ID cards to share on social media.

## Features

- **Profile Frames & Builder IDs**: Choose from 8 unique, Goa-flavoured pixel-art templates (4 profile frames, 4 ID cards).
- **Client-Side Image Processing**: All image cropping, scaling, and compositing happens directly in the browser using the HTML5 Canvas API. No images are uploaded to any server, guaranteeing 100% privacy.
- **Dynamic Text Overlay**: Automatically fits and renders custom text (Name, Role, Title, Team) onto the Builder ID cards with custom fonts (Space Grotesk and Press Start 2P).
- **Smart Image Cropping**: Utilizes `react-easy-crop` to let users perfectly frame their face before rendering. The crop aspect ratio automatically adapts to the selected template's hole size.
- **Export & Share**: Download the generated PNG directly, share it using the native Web Share API, or post directly to X (Twitter).
- **Responsive Design**: Built with Tailwind CSS, ensuring a seamless experience across mobile, tablet, and desktop devices.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Routing**: TanStack Router / TanStack Start
- **Styling**: Tailwind CSS v4 + Radix UI Primitives
- **Build Tool**: Vite 8
- **Image Processing**: HTML Canvas API + `react-easy-crop` + `heic2any` (for iOS image support)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository and navigate to the directory:
   ```bash
   git clone <repository-url>
   cd frame-creator-goa-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:8080/` (or the port specified in your terminal).

## How it works

1. **Pick a format**: Choose between a Profile Frame (square) or a Builder ID (vertical card).
2. **Upload a photo**: Select an image (JPG, PNG, WebP, HEIC). The image is processed entirely on the client side.
3. **Crop**: Adjust the zoom and position of your photo. The crop aspect ratio is locked exactly to the selected template's cutout.
4. **Enter Details**: (For Builder IDs only) Type in your Name, Role, Title, and Team. The text is drawn directly onto the canvas with auto-sizing logic to prevent overflow.
5. **Select a Design**: Switch between different templates. The live preview updates instantly.
6. **Download / Share**: Export your creation as a high-quality PNG or share it directly to social media.

## Privacy Note

This application is completely stateless and serverless. Uploaded images are processed using in-memory object URLs and the HTML5 Canvas. Your photos never leave your device.
