/* client/src/components/StudentProfilePage.js */

import React from 'react';
import Setup2 from './Setup2';
import Setup3 from './Setup3';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentOrganization } from '../config';

function StudentProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentProfile, filters } = location.state || {};

  const handleBack = () => {
    const organization = getCurrentOrganization();
    navigate(`/${organization}/resumes`, { 
      state: { 
        preserveFilters: true, 
        filters 
      },
      replace: true 
    });
  };

  return (
    <div className="edit-profile-page">
      {studentProfile ? (
        <>
          <Setup2
            formData={studentProfile}
            header={0}
            className="edit-profile-page-content"
            readOnly={true}
            showResumeView={false}
          />
          <Setup3
            formData={studentProfile}
            header={0}
            className="edit-profile-page-content"
            readOnly={true}
          />
          <Setup2
            formData={studentProfile}
            header={0}
            className="edit-profile-page-content"
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