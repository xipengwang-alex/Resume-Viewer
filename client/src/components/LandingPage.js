import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Setup4 from './Setup4';

function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const showSuccess = location.state && location.state.showSuccess;

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleViewProfile = () => {
    navigate('/myprofile');
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