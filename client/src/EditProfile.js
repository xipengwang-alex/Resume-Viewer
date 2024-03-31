import React, { useState } from 'react';
import './Setup.css';
import { exams } from './Setup2';



function EditProfile({ formData, setFormData }) {
  // Define the handleChange method to update the formData state
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  // Define the handleFileChange method for file input
  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  // Define a handleSubmit method for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the submission of the form data to a backend service
    console.log(formData);
  };

  return (
    <div className="content">
      <h1>Edit Your Resume Book Profile</h1>
      <form onSubmit={handleSubmit} className="form-container">

        {/* Form fields from Setup2 */}
        {/* Include First Name, Last Name, Expected Graduation, Major, Passed Exams, and Resume Upload */}

        {/* Fields from Setup3 */}
        {/* Include Sponsorship Questions, Opportunity Type, Past Internships, Current GPA */}

        {/* Combine both sections in a single form */}
        {/* First Name, Last Name */}
        {/* ... */}

        {/* Expected Graduation, Major */}
        {/* ... */}
        
        {/* Passed Exams */}
        {/* ... */}

        {/* Sponsorship Questions */}
        {/* ... */}
        
        {/* Opportunity Type */}
        {/* ... */}
        
        {/* Past Internships */}
        {/* ... */}
        
        {/* Current GPA */}
        {/* ... */}

        {/* Resume Upload */}
        {/* ... */}

        {/* Submit Button */}
        <div className="submit-container">
          <button type="submit" className="submit-button">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
