import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SetupProgressBar from './SetupProgressBar';
import Setup1 from './Setup1';
import Setup2 from './Setup2';
import Setup3 from './Setup3';
import Setup4 from './Setup4';
import './Setup.css';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function SetupWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ examsPassed: {} });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalSteps = 4; 
  const stepIndicator = `${currentStep-1}/${totalSteps-2}`;
  const navigate = useNavigate(); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleFileChange = (file) => {
    setFile(file);
  };

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
    navigate('/myprofile');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const form = new FormData();

      for (const [key, value] of Object.entries(formData)) {
        if (key === 'examsPassed') {
          form.append(key, JSON.stringify(value));
        } else {
          form.append(key, value);
        }
      }
      
      console.log('Form Data:', formData);

      if (file) {
        form.append('resume', file);
      }

      const response = await axios.post(`${API_BASE_URL}/student-profiles`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data.message); 
      navigate('/landing', { state: { showSuccess: true } });
    } catch (error) {
      console.error(error);
      setError('Failed to submit profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Submitting profile...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="setup-wizard">
      <SetupProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      {currentStep === 1 && <Setup1 formData={formData} setFormData={setFormData} />}
      {currentStep === 2 && <Setup2 formData={formData} setFormData={setFormData} handleFileChange={handleFileChange} />}
      {currentStep === 3 && <Setup3 formData={formData} setFormData={setFormData} />}
      {currentStep === 4 && <Setup4 formData={formData} setFormData={setFormData} />}
      
      <div className="navigation-container setup">
        {currentStep > 1 && currentStep < totalSteps && (
          <button className="button black" onClick={prevStep}>Back</button>
        )}
        
        {currentStep > 1 && currentStep < totalSteps && (
          <span className="step-indicator">{stepIndicator}</span>
        )}
        
        {currentStep === 1 ? (
          <button className="button gold" onClick={handleStart}>Get Started</button>
        ) : currentStep === totalSteps ? (
          <button className="button gold" onClick={handleEditProfile}>View Profile</button>
        ) : currentStep === totalSteps - 1 ? (
          <button className="button gold" onClick={handleSubmit}>Submit</button>
        ) : (
          <button className="button gold" onClick={nextStep}>Next</button>
        )}
      </div>
    </div>
  );
}

export default SetupWizardPage;