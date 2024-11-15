/* server/server.js */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const { organizationConfig, getDbUri } = require('./serverConfig');
const { getStudentProfileModel } = require('./models/StudentProfileFactory');
const { processProfileData } = require('./utils/profileHelpers');
const authMiddleware = require('./middleware/authMiddleware');
const loginRoutes = require('./routes/loginRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const recruiterProfileSchema = require('./models/RecruiterProfile').schema;

global.secretKey = process.env.JWT_SECRET;

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const resumesDir = path.join(__dirname, 'resumes');
    cb(null, resumesDir);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

const app = express();

const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production' ? process.env.API_BASE_URL : true,
  credentials: true
};

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(cors(corsOptions));
app.use(express.json());

const connections = {};

const initializeDatabaseConnections = async () => {
  for (const organization in organizationConfig) {
    const uri = getDbUri(organization);
    try {
      const connection = mongoose.createConnection(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
      });
      connections[organization] = connection;
      console.log(`Connected to ${organization} database`);
    } catch (error) {
      console.error(`Failed to connect to ${organization} database`, error);
    }
  }
};

initializeDatabaseConnections();

app.get('/', (req, res) => {
  res.redirect('/actuarial_science');
});

const apiPaths = [
  '/login',
  '/register',
  '/validateToken',
  '/myprofile',
  '/student-profiles',
  '/recruiter-profile'
];

apiPaths.forEach((apiPath) => {
  app.use(`/:organization${apiPath}`, (req, res, next) => {
    const organization = req.params.organization;
    if (!organizationConfig[organization] || !connections[organization]) {
      return res.status(404).json({ message: 'Invalid organization or no database connection' });
    }
    req.dbConnection = connections[organization];
    req.organization = organization;
    next();
  });
});

app.use('/:organization/login', loginRoutes);
app.use('/:organization/register', registrationRoutes);

app.get('/:organization/validateToken', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'Token is valid',
    user: {
      id: req.user.id,
      role: req.user.role
    }
  });
});

app.get('/:organization/recruiter-profile', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const RecruiterProfile = req.dbConnection.model('RecruiterProfile', recruiterProfileSchema);

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

app.get('/:organization/student-profiles', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const StudentProfile = getStudentProfileModel(req.organization, req.dbConnection);
    const profiles = await StudentProfile.find({ isHidden: false });
    console.log(`Retrieved ${profiles.length} profiles from ${req.organization} database`);
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching student profiles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/:organization/myprofile', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'recruiter') {
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log(`Looking for profile in ${req.organization} database for user ${req.user.id}`);
    const StudentProfile = getStudentProfileModel(req.organization, req.dbConnection);
    const profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      console.log('No profile found');
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/:organization/myprofile', authMiddleware, async (req, res) => {
  try {
    const { isHidden } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const StudentProfile = getStudentProfileModel(req.organization, req.dbConnection);
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

app.post(
  '/:organization/student-profiles',
  authMiddleware,
  upload.single('resume'),
  async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const StudentProfile = getStudentProfileModel(req.organization, req.dbConnection);
      const profileData = processProfileData(req.organization, req.body, req.file);
      profileData.user = user.id;

      const existingProfile = await StudentProfile.findOne({ user: user.id });

      if (existingProfile) {
        Object.assign(existingProfile, profileData);
        await existingProfile.save();
        res.json({ message: 'Profile updated successfully' });
      } else {
        const newProfile = new StudentProfile(profileData);
        await newProfile.save();
        res.json({ message: 'Profile created successfully' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

app.use('/resumes', express.static(path.join(__dirname, 'resumes')));

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, '0.0.0.0', () => {
  console.log(`Server is running on ${process.env.API_BASE_URL}`);
});
