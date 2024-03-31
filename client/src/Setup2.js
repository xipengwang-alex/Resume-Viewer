import React from 'react';

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
  

function Setup2({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleFileChange = (e) => {
    // Assuming you want to store only the file name in formData
    setFormData({ ...formData, resume: e.target.files[0].name });
  };

  return (
    <div className="content">
      <h1>Your Resume Book</h1>
      <h3>Please provide the following information to show to recruiters:</h3>
      <form className="form-container">
        <div className="input-group">
          <div className="input-container">

            <label htmlFor="firstName">First Name:</label>
            <input 
                type="text" 
                id="firstName" 
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
                id="lastName" 
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
                id="graduation" 
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
                id="major" 
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

        <label htmlFor="skills">Passed Exams</label>
        <div className="exams-grid">
            {exams.map(exam => (
                <div key={exam.id} className="exam-checkbox">
                <input 
                    type="checkbox" 
                    id={exam.id} 
                    name={exam.id} 
                    checked={formData[exam.id] || false} 
                    onChange={handleChange} 
                />
                <label htmlFor={exam.id}>{exam.label}</label>
                </div>
            ))}
        </div>

        <label htmlFor="resume">Upload Resume:</label>
        <input 
          type="file" 
          id="resume" 
          name="resume" 
          accept=".pdf,.doc,.docx" 
          onChange={handleFileChange} 
          required
        />

      </form>
    </div>
  );
}

export default Setup2;
