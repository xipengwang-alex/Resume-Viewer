const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');


// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/resume-viewer', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

// Allow cross-origin requests
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());


// Route to serve PDF files
app.use('/resumes', express.static(path.join(__dirname, 'resumes')));


// Define the Resume Schema
const resumeSchema = new mongoose.Schema({
  fileName: String,
  filePath: String,
  tags: {
    gender: String,
    year: Number,
    gpa: Number,
    major: String
  },
  uploadedAt: { type: Date, default: Date.now }
});

// Define the Resume Model
const Resume = mongoose.model('Resume', resumeSchema);

// Define routes
app.get('/resumes', async (req, res) => {
  const resumes = await Resume.find();
  res.json(resumes);
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
