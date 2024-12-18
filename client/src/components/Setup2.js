/* client/src/components/Setup2.js */

import React, { useState, useEffect, useCallback } from 'react';
import SetupHeader from './SetupHeader';
import { BASE_URL, organizationConfig, getCurrentOrganization } from '../config';

function Setup2({ formData, setFormData, header = 1, handleFileChange, file, readOnly = false, className, onValidityChange, showResumeView = true, showPersonalInfo = true }) {
  const organization = getCurrentOrganization();
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);


  useEffect(() => {
    if (file) {
      setSelectedFile(file);
    }
    
    const { firstName, lastName, undergradYear, graduation } = formData;
    const isValid = firstName && lastName && undergradYear && graduation && (selectedFile || file);

    if (onValidityChange) {
      onValidityChange(isValid);
    }

    if (!formData.major && setFormData) {
      setFormData(prevFormData => ({
        ...prevFormData,
        major: organizationConfig[organization].majorOptions[0]
      }));
    }
  }, [file, formData, selectedFile, onValidityChange, setFormData, organization]);

  const handleChange = (e) => {
    if (!readOnly) {
      const { name, value, type, checked } = e.target;
      if (type === "checkbox" && organization === 'actuarial_science') {
        setFormData(prevFormData => ({
          ...prevFormData,
          examsPassed: {
            ...prevFormData.examsPassed,
            [name]: checked
          }
        }));
      } else {
        setFormData(prevFormData => ({
          ...prevFormData,
          [name]: value
        }));
      }
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleFiles = useCallback((file) => {
    setSelectedFile(file);
    setFormData(prevFormData => ({
      ...prevFormData,
      resume: file.name
    }));
    handleFileChange(file);
  }, [setFormData, handleFileChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  }, [handleFiles]);

  const handleLocalFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const renderExams = () => {
    if (organization !== 'actuarial_science') return null;
    
    const numExamsPassed = Object.values(formData.examsPassed || {}).filter(Boolean).length;
    const examsList = organizationConfig.actuarial_science.exams;

    return (
      <>
        <label htmlFor="skills">Passed Exams:</label>
        <div
          className="exams-grid"
          style={readOnly ? { height: `${Math.ceil(numExamsPassed / 3) * 35 - 35}px` } : {}}
        >
          {readOnly ? (
            examsList.filter(exam => formData.examsPassed?.[exam.id]).map(exam => (
              <div key={exam.id} className="exam-checkbox">
                <label>
                  <input 
                    type="checkbox" 
                    name={exam.id} 
                    checked={formData.examsPassed?.[exam.id] || false} 
                    onChange={handleChange} 
                    readOnly={readOnly}
                    className={readOnly ? "read-only" : ""}
                  />
                  <span className="exam-label">{exam.label}</span>
                </label>
              </div>
            ))
          ) : (
            examsList.map(exam => (
              <div key={exam.id} className="exam-checkbox">
                <label>
                  <input 
                    type="checkbox" 
                    name={exam.id} 
                    checked={formData.examsPassed?.[exam.id] || false} 
                    onChange={handleChange} 
                    readOnly={readOnly}
                    className={readOnly ? "read-only" : ""}
                  />
                  <span className="exam-label">{exam.label}</span>
                </label>
              </div>
            ))
          )}
        </div>
      </>
    );
  };

  const renderDataMineFields = () => {
    if (organization !== 'data_mine') return null;
    return (
      <>
        <div className="input-group">
          <div className="input-container">
            <label htmlFor="linkedInUrl">LinkedIn URL:</label>
            <input 
              type="text" 
              name="linkedInUrl" 
              value={formData.linkedInUrl || ""} 
              onChange={handleChange} 
              className={readOnly ? "read-only" : ""}
            />
          </div>
          <div className="input-container">
            <label htmlFor="nonPurdueEmail">Non-Purdue Email:</label>
            <input 
              type="text" 
              name="nonPurdueEmail" 
              value={formData.nonPurdueEmail || ""} 
              onChange={handleChange}
              className={readOnly ? "read-only" : ""}
            />
          </div>
          <div className="input-container">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input 
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              className={readOnly ? "read-only" : ""}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={`content ${className}`}>
      {header === 1 && <SetupHeader />}
      {showPersonalInfo && (
        <form className="form-container">
          <div className="input-group">
            <div className="input-container">
              <label htmlFor="firstName">First Name*:</label>
              <input 
                type="text" 
                name="firstName" 
                value={formData.firstName || ""} 
                onChange={handleChange} 
                className={readOnly ? "read-only" : ""}
                required
              />
            </div>
            <div className="input-container">
              <label htmlFor="lastName">Last Name*:</label>
              <input 
                type="text" 
                name="lastName" 
                value={formData.lastName || ""} 
                onChange={handleChange} 
                className={readOnly ? "read-only" : ""}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <div className="input-container">
              <label htmlFor="undergradYear">Year of Study*:</label>
              <select 
                name="undergradYear" 
                value={formData.undergradYear || ""} 
                onChange={handleChange} 
                className={readOnly ? "read-only-select" : ""}
                required
              >
                <option value="">Select Year</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>
            <div className="input-container">
              <label htmlFor="graduation">Expected Graduation*:</label>
              <select 
                name="graduation" 
                value={formData.graduation || ""} 
                onChange={handleChange} 
                className={readOnly ? "read-only-select" : ""}
                required
              >
                <option value="">Select Year</option>
                <option value="Fall 2028">Fall 2028</option>
                <option value="Spring 2028">Spring 2028</option>
                <option value="Fall 2027">Fall 2027</option>
                <option value="Spring 2027">Spring 2027</option>
                <option value="Fall 2026">Fall 2026</option>
                <option value="Spring 2026">Spring 2026</option>
                <option value="Fall 2025">Fall 2025</option>
                <option value="Spring 2025">Spring 2025</option>
                <option value="Fall 2024">Fall 2024</option>
                <option value="Spring 2024">Spring 2024</option>
              </select>
            </div>
            <div className="input-container">
              <label htmlFor="major">Major*:</label>
              <select 
                name="major" 
                value={formData.major || ""} 
                onChange={handleChange} 
                className={readOnly ? "read-only-select" : ""}
                required
              >
                <option value="">Select Major</option>
                {organizationConfig[organization].majorOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          
          {renderExams()}
          {renderDataMineFields()}
          <br/>
        </form>
      )}
      {showResumeView && (
        readOnly ? (
          formData.resume && formData.resume.filePath ? (
            <div className="resume-viewer">
              <p>View Resume:</p>
              <object
                className="object-pdf"
                data={`${BASE_URL}${formData.resume.filePath}`}
                type="application/pdf"
                data-zoom="1"
                aria-label="Resume PDF Viewer"
              ></object>
            </div>
          ) : (
            <p>No resume uploaded.</p>
          )
        ) : (
          <div 
            className={`resume-upload ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <label htmlFor="resume" className="resume-upload-label">
              <div className="resume-upload-area">
                {selectedFile ? (
                  <p className="selected-file-name">Selected file: {typeof selectedFile === 'string' ? selectedFile.split('/').pop() : selectedFile.name}</p>
                ) : (
                  <>
                    <h1>Upload a new resume from device*</h1>
                    <p>or drag and drop resume</p>
                  </>
                )}
                <input
                  type="file"
                  name="resume"
                  id="resume"
                  accept=".pdf"
                  onChange={handleLocalFileChange}
                  readOnly={readOnly}
                  className={readOnly ? "read-only" : ""}
                  required
                />
              </div>
            </label>
          </div>
        )
      )}
    </div>
  );
}

export default Setup2;