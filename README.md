ArcPlan

A full-stack web application that uses AI to analyze a room tour video and generate a simplified 2D blueprint of the space and its objects.

Tech Stack

Frontend: React, Vite, TypeScript, Tailwind CSS

Backend: Python, Flask, flask-cors

AI / Computer Vision: Ultralytics YOLOv8, OpenCV

Core Libraries: Lucide-React (icons), NumPy

Project Structure

ArcPlan/
├── backend/
│   ├── uploads/      # Temp folder for uploaded videos
│   ├── venv/         # Python virtual environment
│   ├── app.py        # The Flask API server
│   ├── detect.py     # The YOLO + OpenCV processing script
│   └── yolov8n.pt    # The AI model
│
├── src/
│   ├── components/
│   │   ├── UploadScreen.tsx
│   │   ├── ProcessingScreen.tsx
│   │   └── ResultsScreen.tsx
│   ├── App.tsx       # Main app component and state logic
│   └── index.css     # Tailwind imports
│
├── .gitignore        # Ignores venv, node_modules, .pt, etc.
├── index.html        # App entry point
├── package.json
├── README.md         # This file
└── tsconfig.json


Setup & Usage

You must run two servers in two separate terminals for the app to work.

1. Backend Server (Python + Flask)

 Navigate to the backend folder
cd backend

 (If you haven't) Create and activate a virtual environment
 python -m venv venv
 venv\Scripts\activate  (on Windows)
 source venv/bin/activate (on Mac/Linux)

 Install Python dependencies
pip install Flask flask-cors ultralytics opencv-python numpy

 Run the server
python app.py


Your backend will now be running at http://127.0.0.1:5000.

2. Frontend Server (React + Vite)

In a new terminal, go to the root project folder
cd ..

 Install Node.js dependencies
npm install

# Run the frontend
npm run dev
