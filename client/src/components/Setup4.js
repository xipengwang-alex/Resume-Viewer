import React from 'react';

function Setup4({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="content">
      <h1>Your Resume Book Profile</h1>

      <p><br/><br/><br/><br/><br/><br/><br/><br/>Success!</p>

      <p>Thank You for Uploading Your Resume!</p>

      <p>View the Actuarial Science Calendar <a href="http://example.com/calendar" target="_blank" rel="noopener noreferrer">Here</a>.</p>

    </div>
  );
}

export default Setup4;
