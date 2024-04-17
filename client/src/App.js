import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Outlet, useLocation } from 'react-router-dom';
import UploadPage from './components/UploadPage';
import ResumesPage from './components/ResumesPage';
import SetupWizard from './components/SetupWizard';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import UserProfile from './components/UserProfile';
import BasicLayout from './BasicLayout';
import LandingPage from './components/LandingPage';
import withAuth from './components/withAuth';
import './styles.css';


const UploadPageWithAuth = withAuth(UploadPage);
const ResumesPageWithAuth = withAuth(ResumesPage);
const UserProfileWithAuth = withAuth(UserProfile);
const LandingPageWithAuth = withAuth(LandingPage);
const SetupWizardWithAuth = withAuth(SetupWizard);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WithTopBarLayout />}>
          <Route path="/upload" element={<UploadPageWithAuth />} />
          <Route path="/resumes" element={<ResumesPageWithAuth />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/myprofile" element={<UserProfileWithAuth />} />
          <Route path="/landing" element={<LandingPageWithAuth />} />
        </Route>

        <Route path="/setup" element={<BasicLayout />}>
          <Route index element={<SetupWizardWithAuth />} />
        </Route>
      </Routes>
    </Router>
  );
}



function WithTopBarLayout() {
    const [profile, setProfile] = useState(null);
    const [isHidden, setIsHidden] = useState(false);
  
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const res = await axios.get('http://localhost:3000/myprofile', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          setProfile(res.data);
          setIsHidden(res.data.isHidden);
        } catch (err) {
          console.error('Failed to fetch profile', err);
        }
      };
  
      fetchProfile();
    }, []);
  
    const getInitials = () => {
      if (profile) {
        const { firstName, lastName } = profile;
        return `${firstName.charAt(0)}${lastName.charAt(0)}`;
      }
      return '';
    };


    const handleToggle = async () => {
      try {
        await axios.put('http://localhost:3000/myprofile', { isHidden: !isHidden }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setIsHidden(!isHidden);
      } catch (err) {
        console.error('Failed to update profile visibility', err);
      }
    };
  

      


    return (
        <div className="App">
          <nav className="topbar">
            <ul>
              <li><Link to="/upload">Edit Profile</Link></li>
              <li><Link to="/resumes">View Resumes</Link></li>
              <li><Link to="/setup">Setup Wizard</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/myprofile">My Profile</Link></li>
              <li><Link to="/landing">Landing Page</Link></li>
            </ul>
            {profile && (
              <div className="profile-section">
                <label className="radio-button">
                  <input
                    type="checkbox"
                    checked={isHidden}
                    onChange={handleToggle}
                  />
                  <span className="checkmark"></span>
                </label>
                <div className="profile-circle">
                  <span>{getInitials()}</span>
                </div>
              </div>
            )}
          </nav>
          <div className="content">
            <Outlet />
          </div>
        </div>
      );
    }


/* 

function WithTopBarLayout() {
    const location = useLocation();
    let title = 'Resume Viewer'; 

    switch (location.pathname) {
        case '/login':
        case '/register':
            title = 'Resume Viewer';
            break;
        case '/upload':
            title = 'Edit Your Profile';
            break;
        case '/resumes':
            title = 'Search Resume Book';
            break;
    }

    return (
        <div className="App">
            <nav className="topbar">
                <ul>
                    <li style={{ color: 'white', fontWeight: 'bold', fontSize: '24px' }}>{title}</li>
                </ul>
            </nav>
            <div className="content">
                <Outlet /> 
            </div>
        </div>
    );
}

*/
export default App;