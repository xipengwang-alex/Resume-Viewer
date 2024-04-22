import React from 'react';

function Setup4({ formData, setFormData, showSuccess = false}) {

  return (
    <div className="content">
      <h1>Your Resume Book Profile</h1>

      <br/><br/><br/><br/><br/><br/><br/>
      
      {showSuccess && <p>Success!</p>}

      <p>Thank You for Uploading Your Resume!</p>

      <p>View the Actuarial Science Website <a href="https://web.ics.purdue.edu/~actuary/recruitment.html" target="_blank" rel="noopener noreferrer">Here</a>.</p>

    </div>
  );
}

export default Setup4;
