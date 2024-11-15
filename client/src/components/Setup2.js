/* client/src/components/Setup2.js */

import React, { useState, useEffect, useCallback } from 'react';
import SetupHeader from './SetupHeader';
import { API_BASE_URL, organizationConfig, getCurrentOrganization } from '../config';

function Setup2({ formData, setFormData, header = 1, handleFileChange, file, readOnly = false, className, onValidityChange, showResumeView = true, showPersonalInfo = true }) {
  const organization = getCurrentOrganization();
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  //const [skillsInput, setSkillsInput] = useState('');


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
    /*
    if (formData.skills) {
      setSkillsInput(formData.skills.join(', '));
    }
    */
  }, [file, formData, selectedFile, onValidityChange, setFormData, organization, formData.skills]);

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

  /*
  const handleSkillsInputChange = (e) => {
    if (!readOnly) {
      setSkillsInput(e.target.value);
    }
  };

  const handleSkillsInputBlur = () => {
    if (!readOnly) {
      const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(s => s);
      setFormData(prevFormData => ({
        ...prevFormData,
        skills: skillsArray
      }));
    }
  };

  const handleProjectChange = (index, field, value) => {
    if (!readOnly && organization === 'data_mine') {
      const newProjects = [...(formData.projects || [])];
      if (field === 'technologiesUsed') {
        newProjects[index] = {
          ...newProjects[index],
          [field]: value.split(',').map(t => t.trim()).filter(t => t)
        };
      } else {
        newProjects[index] = {
          ...newProjects[index],
          [field]: value
        };
      }
      setFormData({ ...formData, projects: newProjects });
    }
  };

  const addProject = () => {
    if (!readOnly && organization === 'data_mine') {
      setFormData(prevFormData => ({
        ...prevFormData,
        projects: [
          ...(prevFormData.projects || []),
          { name: '', description: '', technologiesUsed: [] }
        ]
      }));
    }
  };

  const removeProject = (index) => {
    if (!readOnly && organization === 'data_mine') {
      setFormData(prevFormData => ({
        ...prevFormData,
        projects: prevFormData.projects.filter((_, i) => i !== index)
      }));
    }
  };
 */
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
    /* 
    return (
      <>
        <div className="input-container">
          <label htmlFor="skills">Skills (comma-separated):</label>
          <input
            type="text"
            name="skills"
            value={skillsInput}
            onChange={handleSkillsInputChange}
            onBlur={handleSkillsInputBlur}
            readOnly={readOnly}
            className={readOnly ? "read-only" : ""}
          />
        </div>
        {!readOnly && (
          <div className="project-section">
            <label>Projects:</label>
            {formData.projects?.map((project, index) => (
              <div key={index} className="project-item">
                <input
                  type="text"
                  placeholder="Project name"
                  value={project.name}
                  onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                />
                <textarea
                  placeholder="Project description"
                  value={project.description}
                  onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Technologies used (comma-separated)"
                  value={project.technologiesUsed.join(', ')}
                  onChange={(e) => handleProjectChange(index, 'technologiesUsed', e.target.value)}
                />
                <button type="button" onClick={() => removeProject(index)}>Remove Project</button>
              </div>
            ))}
            <button type="button" onClick={addProject}>Add Project</button>
          </div>
        )}
        {readOnly && formData.projects?.length > 0 && (
          <div className="project-section">
            <label>Projects:</label>
            {formData.projects.map((project, index) => (
              <div key={index} className="project-item-readonly">
                <h4>{project.name}</h4>
                <p>{project.description}</p>
                <p><strong>Technologies:</strong> {project.technologiesUsed.join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </>
    );*/
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
              <label htmlFor="undergradYear">Undergraduate Year*:</label>
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
                data={`${API_BASE_URL}${formData.resume.filePath}`}
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