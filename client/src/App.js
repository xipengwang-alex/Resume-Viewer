import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import EditProfilePage from './components/EditProfilePage';
import StudentProfileListPage from './components/StudentProfileListPage';
import SetupWizardPage from './components/SetupWizardPage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import UserProfilePage from './components/UserProfilePage';
import BasicLayout from './BasicLayout';
import LandingPage from './components/LandingPage';
import withAuth from './components/withAuth';
import './styles.css';
import { API_BASE_URL } from './config';


const EditProfilePageWithAuth = withAuth(EditProfilePage);
const StudentProfileListPageWithAuth = withAuth(StudentProfileListPage);
const UserProfilePageWithAuth = withAuth(UserProfilePage);
const LandingPageWithAuth = withAuth(LandingPage);
const SetupWizardPageWithAuth = withAuth(SetupWizardPage);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WithTopBarLayout />}>
          <Route path="/edit-profile" element={<EditProfilePageWithAuth />} />
          <Route path="/resumes" element={<StudentProfileListPageWithAuth />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/myprofile" element={<UserProfilePageWithAuth />} />
          <Route path="/landing" element={<LandingPageWithAuth />} />
        </Route>

        <Route path="/setup" element={<BasicLayout />}>
          <Route index element={<SetupWizardPageWithAuth />} />
        </Route>
      </Routes>
    </Router>
  );
}



function WithTopBarLayout() {
    const [profile, setProfile] = useState(null);
    const [isHidden, setIsHidden] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);


  
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/myprofile`, {
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


    useEffect(() => {
      function handleClickOutside(event) {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
              setShowDropdown(false);
          }
      }

      if (showDropdown) {
          document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, [showDropdown]);


  
    const getInitials = () => {
      if (profile) {
        const { firstName, lastName } = profile;
        return `${firstName.charAt(0)}${lastName.charAt(0)}`;
      }
      return '';
    };


    const handleToggle = async () => {
      const isProfileVisible = !isHidden; 
      try {
        await axios.put(`${API_BASE_URL}/myprofile`, { isHidden: isProfileVisible }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setIsHidden(isProfileVisible);
      } catch (err) {
        console.error('Failed to update profile visibility', err);
      }
    };
  

    const handleLogout = () => {
      localStorage.removeItem('token');

      navigate('/login', { replace: true });
      window.location.reload();
    };

      


    return (
        <div className="App">
          <nav className="topbar">
            <ul>
              <li><Link to="/edit-profile">Edit Profile</Link></li>
              <li><Link to="/resumes">View Resumes</Link></li>
              <li><Link to="/setup">Setup Wizard</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/myprofile">My Profile</Link></li>
              <li><Link to="/landing">Landing Page</Link></li>
            </ul>
            {profile && (
              <div className="profile-section" onClick={() => setShowDropdown(!showDropdown)}>



              <label className="toggle" htmlFor="myToggle">
                  <input 
                      className="toggle__input"
                      type="checkbox" 
                      id="myToggle"
                      checked={!isHidden}
                      onChange={handleToggle}
                  />
                  <div className="toggle__fill">
                      <span className="toggle__text toggle__text--on">Profile Visible</span>
                      <span className="toggle__text toggle__text--off">Profile Hidden</span>
                  </div>
              </label>




                <div className="profile-circle">
                  <span>{getInitials()}</span>
                </div>
                {showDropdown && (
                  <div className="dropdown-menu" ref={dropdownRef}>
                    <button onClick={handleLogout}>Log Out</button>
                  </div>
                )}
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
        case '/edit-profile':
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