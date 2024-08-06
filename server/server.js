const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
global.secretKey = process.env.JWT_SECRET;

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const resumesDir = path.join(__dirname, 'resumes');
    cb(null, resumesDir);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage });

const uri = process.env.MONGODB_URI;

const authMiddleware = require('./middleware/authMiddleware');
const loginRoutes = require('./routes/loginRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const StudentProfile = require('./models/StudentProfile');
const RecruiterProfile = require('./models/RecruiterProfile');
const User = require('./models/User');

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, ssl: true })
  .then(() => console.log("Mongoose is connected"))
  .catch(e => console.log("could not connect", e));


const app = express();
app.use(cors());
app.use(express.json());

app.use('/login', loginRoutes);
app.use('/register', registrationRoutes);
app.use('/resumes', express.static(path.join(__dirname, 'resumes')));





app.get('/validateToken', authMiddleware, (req, res) => {

  res.status(200).json({
    message: 'Token is valid',
    user: {
      id: req.user.id,
      role: req.user.role
    }
  });
});


app.get('/student-profiles', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const profiles = await StudentProfile.find();
    res.json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/recruiter-profile', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const profile = await RecruiterProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/myprofile', authMiddleware, async (req, res) => {
  try {
    if (req.user.role == 'recruiter') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const profile = await StudentProfile.findOne({ user: req.user.id }); 
    if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});




app.put('/myprofile', authMiddleware, async (req, res) => {
  try {
    const { isHidden } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { user: user.id },
      { isHidden },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ message: 'Profile visibility updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

    
app.post('/student-profiles', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    console.log('Request Body:', req.body);

    
    const { examsPassed, firstName, lastName, gpa, graduation, major, willNeedSponsorship, sponsorshipTimeframe, opportunityType, pastInternships } = req.body;
    const parsedExamsPassed = JSON.parse(examsPassed);
    const resume = req.file;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const existingProfile = await StudentProfile.findOne({ user: user.id });

    if (existingProfile) {
      existingProfile.firstName = firstName;
      existingProfile.lastName = lastName;
      existingProfile.gpa = gpa;
      existingProfile.graduation = graduation;
      existingProfile.major = major;
      existingProfile.willNeedSponsorship = willNeedSponsorship;
      existingProfile.sponsorshipTimeframe = sponsorshipTimeframe;
      existingProfile.opportunityType = opportunityType;
      existingProfile.pastInternships = pastInternships;
      existingProfile.examsPassed = parsedExamsPassed;
      
      if (resume) {
        existingProfile.resume = {
          filePath: `/resumes/${resume.originalname}`,
        };
      }

      await existingProfile.save();
      res.json({ message: 'Profile updated successfully' });
    } else {

      const newProfile = new StudentProfile({
        user: user.id,
        firstName,
        lastName,
        isHidden: false,
        gpa,
        graduation,
        major,
        willNeedSponsorship,
        sponsorshipTimeframe, 
        opportunityType,
        pastInternships,
        examsPassed: parsedExamsPassed,
        resume: {
          filePath: `/resumes/${resume.originalname}`,
        },
      });

      await newProfile.save();
      res.json({ message: 'Profile created successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on http://localhost:3000');
});