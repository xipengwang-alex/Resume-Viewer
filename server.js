const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'resumes/')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
});


const upload = multer({ storage: storage });
const uri = "mongodb+srv://wangx:a2UKOohXAiXd05iC@us-east-serverlessinsta.cnthoht.mongodb.net/resume_viewer?retryWrites=true&w=majority&appName=US-East-ServerlessInstance";


try {
  // Connect to MongoDB
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log(" Mongoose is connected")
} catch (e) {
  console.log("could not connect");
}

const app = express();

// Allow cross-origin requests
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());


// Route to serve PDF files
app.use('/resumes', express.static(path.join(__dirname, 'resumes')));


// Define the StudentProfile Schema
const StudentProfileSchema = new mongoose.Schema({
  fileName: String,
  filePath: String,
  tags: {
    'first name': String,
    'last name': String,
    gender: String,
    year: String,
    gpa: Number,
    major: String
  },
  uploadedAt: { type: Date, default: Date.now }
});

// Define the StudentProfile/Resume Model
const Resume = mongoose.model('student_profiles', StudentProfileSchema);

// Define routes
app.get('/resumes', async (req, res) => {
  const resumes = await Resume.find();
  res.json(resumes);
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const tags = JSON.parse(req.body.tags);
    
    const resume = new Resume({
      fileName: file.originalname,
      filePath: `/resumes/${file.originalname}`,
      tags,
    });
    
    await resume.save();
    
    res.json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
