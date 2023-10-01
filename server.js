const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/resume-viewer', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

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
