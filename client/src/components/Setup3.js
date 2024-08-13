import React, { useEffect } from 'react';
import SetupHeader from './SetupHeader';

function Setup3({ formData, setFormData, header = 1, readOnly = false, className, onValidityChange }) {
  
  useEffect(() => {
    const { willNeedSponsorship, opportunityType, pastInternships, gpa } = formData;
    const isValid = willNeedSponsorship && opportunityType && pastInternships && gpa;
    if (onValidityChange) {
      onValidityChange(isValid);
    }
  }, [formData, onValidityChange]);

  
  const handleChange = (e) => {
    if (!readOnly) {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className={`content ${className}`}>
      {header === 1 && <SetupHeader />}
      <div className="questions-grid">
        <div className="question-text">
          <p>1. Do you require sponsorship to work in the U.S.?</p>
        </div>
        <div className="input-container">
          <select
            name="willNeedSponsorship"
            value={formData.willNeedSponsorship || ''}
            onChange={handleChange}
            className={readOnly ? "read-only-select" : ""}
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="notSure">Not Sure</option>
          </select>
        </div>

        <div className="question-text">
          <p>2. Are you looking for an internship, a full-time position, or both?</p>
        </div>
        <div className="input-container">
          <select
            name="opportunityType"
            value={formData.opportunityType || ''}
            onChange={handleChange}
            className={readOnly ? "read-only-select" : ""}
          >
            <option value="">Select</option>
            <option value="internship">Internship</option>
            <option value="fullTime">Full Time</option>
            <option value="bothInternshipAndFullTime">Both</option>
          </select>
        </div>

        <div className="question-text">
          <p>3. Have you completed at least one actuarial related internship in the past?</p>
        </div>
        <div className="input-container">
          <select
            name="pastInternships"
            value={formData.pastInternships || ''}
            onChange={handleChange}
            className={readOnly ? "read-only-select" : ""}
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="question-text">
          <p>4. What is your current GPA?</p>
        </div>
        <div className="input-container">
          <input 
            type="number" 
            name="gpa" 
            value={formData.gpa || ""} 
            onChange={handleChange} 
            className={readOnly ? "read-only" : ""}
            required
          />
        </div>
      </div>
    </div>
  );
}

export default Setup3;
