# Chess Web App

A full-stack web-based chess game built with a React frontend and Node.js backend.

## Features

- Interactive chessboard with real-time move validation
- Sign In / Sign Up sync with MongoDB
- Modular React components for a clean UI
- Game state management using React Context API
- Backend API for future multiplayer
- Clean, scalable folder structure
- JWT authentification
- Security: Hashing of password

## Installation

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB Compass (required for Sign In / Sign Up, but the project could run without it)

### Setup

1.  **Clone the repository**

    git clone https://github.com/artem-zborovskiy/cs-nea-chess.git
    cd chess-web-app

2.  Install dependencies for both frontend and backend


    cd backend
    npm install

    cd frontend
    npm install

3.  Run the backend


    cd backend
    npm start

4. Run the frontend

    cd frontend
    npm start

The frontend will usually run at http://localhost:3000 and the backend at http://localhost:3001

# Technologies Used

- Frontend: React, CSS

- Backend: Node.js, Express

- State Management: Context API