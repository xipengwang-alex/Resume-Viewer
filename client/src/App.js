import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Outlet, useLocation } from 'react-router-dom';
import UploadPage from './components/UploadPage';
import ResumesPage from './components/ResumesPage';
import SetupWizard from './components/SetupWizard';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import UserProfile from './components/UserProfile';
import BasicLayout from './BasicLayout';
import './styles.css';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WithTopBarLayout />}>
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/resumes" element={<ResumesPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="/myprofile" element={<UserProfile />} />
                </Route>
                
                <Route path="/setup" element={<BasicLayout />}>
                    <Route index element={<SetupWizard />} />
                </Route>
            </Routes>
        </Router>
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


function WithTopBarLayout() {
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
                </ul>
            </nav>
            <div className="content">
                <Outlet /> 
            </div>
        </div>
    );
}
export default App;