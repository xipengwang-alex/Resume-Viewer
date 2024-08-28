import React from 'react';

function Setup4({ formData, setFormData, showSuccess = false}) {

  return (
    <div className="content">
      <h1>Your Resume Book Profile</h1>

      <br/><br/>
      {!showSuccess && [...Array(6)].map((_, i) => <br key={i} />)}

      {!showSuccess && <p>Thank you for completing your profile in Resume Book!</p>}
      
      {showSuccess && <p>Success!</p>}
      

      {showSuccess && 
      <div style={{ maxWidth: '800px', margin: '10px auto', padding: '10px', borderRadius: '8px' }}>
        <p>Additionally, please submit your resume to <strong>actuary@purdue.edu</strong> with the subject: <strong>Resume</strong>.</p>
        
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          It must be saved with this name format:
        </p>
        
        <p style={{
          backgroundColor: '#fff',
          padding: '10px',
          borderRadius: '8px',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto'
        }}>
          LastName_FirstName_Class_Internship/FullTime_PurdueEmailPrefix_P_FM(PassedExams)_Sponsorship(only required for international students).pdf
        </p>
        
        <p>If you have any questions, please email the Purdue Actuarial Club at <strong>actuary@purdue.edu</strong></p>
      </div>
      }

    </div>
  );
}

export default Setup4;


//<p>View the Actuarial Science Website <a href="https://web.ics.purdue.edu/~actuary/recruitment.html" target="_blank" rel="noopener noreferrer">Here</a>.</p>