# Resume-Viewer
Resume Viewer for Purdue Data Mine Program. Built using React, Express.js, and MongoDB.

## Prerequisites

- Node.js (v18.12.1 or later)
- npm (v8.19.2 or later)
- A MongoDB instance running locally or accessible over the network

## Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/xipengwang-alex/Resume-Viewer.git
   cd Resume-Viewer
   ```

2. **Install Backend Dependencies:**
   Run the following command to install dependencies for backend:
   ```bash
   npm install
   ```

3. **Install Frontend Dependencies:**
   Navigate to the client directory of your project and run the following command to install dependencies for frontend:
   ```bash
   cd client
   npm install
   ```

4. **(Optional) Start MongoDB:**
   Make sure your MongoDB instance is running.
   

5. **Start the Backend Server:**
   Open a new terminal and navigate to the Resume-Viewer directory, run the following command:
   ```bash
   node server.js
   ```

6. **Start the Frontend Server:**
   Open another terminal and navigate to the Resume-Viewer/client directory, run the following command:
   ```bash
   npm start
   ```

## Usage

Once both the backend and frontend servers are running, navigate to [http://localhost:3001](http://localhost:3001) in your web browser to access the application.

## Additional Information

- The backend server will be running on [http://localhost:3000](http://localhost:3000)
- The frontend server will proxy requests to the backend, so you can make API requests from the frontend to `/api/*` and they will be forwarded to the backend server.
