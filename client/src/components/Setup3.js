import React from 'react';
import SetupHeader from './SetupHeader';

function Setup3({ formData, setFormData, header = 1, className }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className={`content ${className}`}>
      {header === 1 && <SetupHeader />}
      <div className="questions">
        {/* Question 1 */}
        <div className="question">
          <p>1. Will you need sponsorship?</p>
          <select
            name="willNeedSponsorship"
            value={formData.willNeedSponsorship || ''}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="notSure">Not Sure</option>
          </select>
        </div>

        {/* Question 2 */}
        <div className="question">
          <p>2. Do you need sponsorship now or in the future?</p>
          <select
            name="sponsorshipTimeframe"
            value={formData.sponsorshipTimeframe || ''}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="now">Now</option>
            <option value="future">In the future</option>
            <option value="never">Never</option>
          </select>
        </div>

        {/* Question 3 */}
        <div className="question">
          <p>3. Are you looking for an internship or a full time opportunity?</p>
          <select
            name="opportunityType"
            value={formData.opportunityType || ''}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="internship">Internship</option>
            <option value="fullTime">Full Time</option>
          </select>
        </div>

        {/* Question 4 */}
        <div className="question">
          <p>4. Have you had internships in the past?</p>
          <select
            name="pastInternships"
            value={formData.pastInternships || ''}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        {/* Question 5 */}
        <div className="question">
          <p>5. What is your current GPA?</p>
          <select
            name="currentGPA"
            value={formData.currentGPA || ''}
            onChange={handleChange}
          >
            <option value="">Select GPA</option>
            <option value="3.5-4.0">3.5 - 4.0</option>
            <option value="3.0-3.49">3.0 - 3.49</option>
            <option value="2.5-2.99">2.5 - 2.99</option>
            <option value="0.0-2.49">Below 2.5</option> 
          </select>
        </div>
      </div>
    </div>
  );
}

export default Setup3;
