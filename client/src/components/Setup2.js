import React, { useState } from 'react';
import SetupHeader from './SetupHeader';

export const exams = [
    { id: "p", label: "P" }, 
    { id: "fm", label: "FM" }, 
    { id: "ifm", label: "IFM" },
    { id: "srm", label: "SRM" },
    { id: "fam", label: "FAM" },
    { id: "fams", label: "FAMS" },
    { id: "faml", label: "FAML" },
    { id: "ltam", label: "LTAM" },
    { id: "stam", label: "STAM" },
    { id: "altam", label: "ALTAM" },
    { id: "astam", label: "ASTAM" },
    { id: "pa", label: "PA" },
    { id: "mas1", label: "MAS1" },
    { id: "mas2", label: "MAS2" },
    { id: "exam5", label: "Exam 5" }, 
    { id: "exam6", label: "Exam 6" } 
  ];
  

function Setup2({ formData, setFormData, header = 1, handleFileChange, className }) {

  const [selectedFile, setSelectedFile] = useState(null);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (exams.some(exam => exam.id === name)) {
      setFormData(prevFormData => ({
        ...prevFormData,
        examsPassed: {
          ...prevFormData.examsPassed,
          [name]: checked
        }
      }));
    } else {
      const newValue = type === "checkbox" ? checked : value;
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: newValue
      }));
    }
  };


  const handleLocalFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFormData({ ...formData, resume: e.target.files[0].name });
    handleFileChange(file);
  };

  /* 
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFormData({ ...formData, resume: e.target.files[0].name });
  };
  */

  return (
    <div className={`content ${className}`}>
      {header === 1 && <SetupHeader />}
      <form className="form-container">
        <div className="input-group">
          <div className="input-container">

            <label htmlFor="firstName">First Name:</label>
            <input 
                type="text" 
                name="firstName" 
                value={formData.firstName || ""} 
                onChange={handleChange} 
                required
            />
          </div>
          <div className="input-container">
        
            <label htmlFor="lastName">Last Name:</label>
            <input 
                type="text" 
                name="lastName" 
                value={formData.lastName || ""} 
                onChange={handleChange} 
                required
            />
          </div>
        </div>
        <div className="input-group">
          <div className="input-container">
            <label htmlFor="graduation">Expected Graduation:</label>
            <select 
                name="graduation" 
                value={formData.graduation || ""} 
                onChange={handleChange} 
                required
            >
                <option value="">Select Year</option>
                <option value="2028">2028</option>
                <option value="2027">2027</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
            </select>
          </div>
          <div className="input-container">
            
            <label htmlFor="major">Major:</label>
            <select 
                name="major" 
                value={formData.major || ""} 
                onChange={handleChange} 
                required
            >
              <option value="">Select Major</option>
              <option value="ACTSCI">Actuarial Science</option>
              <option value="UIUX">UI/UX</option>
              <option value="WEBDEV">Web Development</option>
              <option value="CS">Computer Science</option> 
            </select>
          </div>
        </div>

        <label htmlFor="skills">Passed Exams:</label>
        <div className="exams-grid">
          {exams.map(exam => (
            <div key={exam.id} className="exam-checkbox">
              <label>
                <input 
                  type="checkbox" 
                  name={exam.id} 
                  checked={formData.examsPassed[exam.id] || false} 
                  onChange={handleChange} 
                />
                <span className="exam-label">{exam.label}</span>
              </label>
            </div>
          ))}
        </div>

       <br/>

        <div className="resume-upload">
          <label htmlFor="resume" className="resume-upload-label">
            <div className="resume-upload-area">
              {selectedFile ? (
                <p className="selected-file-name">Selected file: {selectedFile.name}</p>
              ) : (
                <>
                  <h1>Upload a new resume from device</h1>
                  <p>or drag and drop resume</p>
                </>
              )}
              <input
                type="file"
                name="resume"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleLocalFileChange}
                required
              />
            </div>
          </label>
        </div>

      </form>
    </div>
  );
}

export default Setup2;
