import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UploadPage from './UploadPage';
import ResumesPage from './ResumesPage';
import './styles.css';

function App() {
    return (
        <Router>
            <div className="App">
                <nav className="sidebar">
                    <ul>
                        <li><Link to="/upload">Upload Resume</Link></li>
                        <li><Link to="/resumes">View Resumes</Link></li>
                    </ul>
                </nav>
                <div className="content">
                    <Routes>
                        <Route path="/upload" element={<UploadPage />} />
                        <Route path="/resumes" element={<ResumesPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;