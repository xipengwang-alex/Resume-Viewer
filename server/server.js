const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
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

const loginRoutes = require('./routes/loginRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const StudentProfile = require('./models/StudentProfile');
const User = require('./models/User');

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongoose is connected"))
  .catch(e => console.log("could not connect", e));




const app = express();
app.use(cors());
app.use(express.json());



app.use('/login', loginRoutes);
app.use('/register', registrationRoutes);
app.use('/resumes', express.static(path.join(__dirname, 'resumes')));

app.get('/resumes', async (req, res) => {
  const profiles = await StudentProfile.find();
  res.json(profiles);
});



app.post('/resumes', upload.single('resume'), async (req, res) => {
  try {
    const { firstName, lastName, gender, year, gpa, graduation, major, willNeedSponsorship, sponsorshipTimeframe, opportunityType, pastInternships, examsPassed } = req.body;
    const resume = req.file;

    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const newProfile = new StudentProfile({
      user: user._id,
      firstName,
      lastName,
      gender,
      year,
      gpa,
      graduation,
      major,
      willNeedSponsorship,
      sponsorshipTimeframe,
      opportunityType,
      pastInternships,
      examsPassed,
      resume: {
        fileName: resume.originalname,
        filePath: `/resumes/${resume.originalname}`,
      },
    });

    await newProfile.save();

    res.json({ message: 'Profile created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});




app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});