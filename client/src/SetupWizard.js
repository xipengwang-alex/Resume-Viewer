import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SetupProgressBar from './SetupProgressBar';
import Setup1 from './Setup1';
import Setup2 from './Setup2';
import Setup3 from './Setup3';
import Setup4 from './Setup4';
import './Setup.css';

function SetupWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Initialize your form data structure here
  });

  const navigate = useNavigate(); 
  const totalSteps = 4; // Update this if you have more steps
  const stepIndicator = `${currentStep-1}/${totalSteps-2}`;

  const nextStep = () => {
    setCurrentStep(currentStep >= totalSteps ? totalSteps : currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep <= 1 ? 1 : currentStep - 1);
  };

  const handleStart = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleEditProfile = () => {
    navigate('/edit');
  };

  const handleSubmit = async () => {
    // Submit your final form data to the server
  };

  return (
    <div className="setup-wizard">
      <SetupProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      {currentStep === 1 && <Setup1 formData={formData} setFormData={setFormData} />}
      {currentStep === 2 && <Setup2 formData={formData} setFormData={setFormData} />}
      {currentStep === 3 && <Setup3 formData={formData} setFormData={setFormData} />}
      {currentStep === 4 && <Setup4 formData={formData} setFormData={setFormData} />}
      {/* ... other conditional steps if any ... */}
      
      <div className="navigation-container">
        {currentStep > 1 && currentStep < totalSteps && (
          <button className="button black" onClick={prevStep}>Back</button>
        )}
        
        {currentStep > 1 && currentStep < totalSteps && (
          <span className="step-indicator">{stepIndicator}</span>
        )}
        
        {currentStep === 1 ? (
          <button className="button gold" onClick={handleStart}>Get Started</button>
        ) : currentStep === totalSteps ? (
          <button className="button gold" onClick={handleEditProfile}>Edit Profile</button>
        ) : (
          <button className="button gold" onClick={nextStep}>Next</button>
        )}
      </div>
    </div>
  );
}
export default SetupWizard;