import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Outlet } from 'react-router-dom';
import UploadPage from './components/UploadPage';
import ResumesPage from './components/ResumesPage';
import SetupWizard from './components/SetupWizard';
import BasicLayout from './BasicLayout';
import './styles.css';


function App() {
    return (
        <Router>
            <Routes>
                {/* Routes with the top bar */}
                <Route path="/" element={<WithTopBarLayout />}>
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/resumes" element={<ResumesPage />} />
                </Route>
                
                {/* Route without the top bar */}
                <Route path="/setup" element={<BasicLayout />}>
                    <Route index element={<SetupWizard />} />
                </Route>
            </Routes>
        </Router>
    );
}

function WithTopBarLayout() {
    return (
        <div className="App">
            <nav className="topbar">
                <ul>
                    <li><Link to="/upload">Edit Profile</Link></li>
                    <li><Link to="/resumes">View Resumes</Link></li>
                    <li><Link to="/setup">Setup Wizard</Link></li>
                </ul>
            </nav>
            <div className="content">
                <Outlet /> {/* Renders the child routes */}
            </div>
        </div>
    );
}

export default App;