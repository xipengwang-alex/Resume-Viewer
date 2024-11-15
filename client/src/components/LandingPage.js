/* client/src/components/LandingPage.js */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Setup4 from './Setup4';
import { getCurrentOrganization } from '../config';

function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const showSuccess = location.state && location.state.showSuccess;

  const handleEditProfile = () => {
    const organization = getCurrentOrganization();
    navigate(`/${organization}/edit-profile`);
  };

  const handleViewProfile = () => {
    const organization = getCurrentOrganization();
    navigate(`/${organization}/myprofile`);
  };

  return (
    <div className="landing-page">
      <Setup4 showSuccess={showSuccess} />
      <div className="button-container">
        <button className="button gold" onClick={handleViewProfile}>
          View Profile
        </button>
        <button className="button gold" onClick={handleEditProfile}>
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default LandingPage;