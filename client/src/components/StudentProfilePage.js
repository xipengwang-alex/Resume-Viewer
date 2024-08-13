import React from 'react';
import Setup2 from './Setup2';
import Setup3 from './Setup3';
import { useLocation, useNavigate } from 'react-router-dom';

function StudentProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const studentProfile = location.state?.studentProfile;

  const handleBack = () => {
    navigate('/resumes');
  };

  return (
    <div className="student-profile-page">
        {studentProfile ? (
        <>
            <Setup2
            formData={studentProfile}
            header={0}
            className="student-profile-page-content"
            readOnly={true}
            showResumeView={false}
            />
            <Setup3
            formData={studentProfile}
            header={0}
            className="student-profile-page-content"
            readOnly={true}
            />
            <Setup2
            formData={studentProfile}
            header={0}
            className="student-profile-page-content"
            readOnly={true}
            showPersonalInfo={false}
            />
            <div className="button-container">
            <button className="button black" onClick={handleBack}>
                Back
            </button>
            </div>
        </>
        ) : (
        <p>Student profile not found.</p>
        )}
    </div>
  );
}

export default StudentProfilePage;