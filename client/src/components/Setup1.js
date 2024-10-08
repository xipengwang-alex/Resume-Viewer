import React from 'react';

const StepCard = ({ number, description }) => (
  <div className="step-card">
    <div className="step-number">{number}</div>
    <div className="step-description">{description}</div>
  </div>
);

const steps = [
  {
    number: '1',
    description:
      'Get started by clicking below. Fill out your profile, and get in touch with companies.',
  },
  {
    number: '2',
    description: 'Update your information and resume whenever you achieve significant milestones.',
  },
  {
    number: '3',
    description:
      'Indicate or update if you will need sponsorship and the type of employment you are seeking (i.e., internship or full-time).',
  },
  {
    number: '4',
    description:
      "Companies can now conveniently access your professional profile through this Resume Book. Please monitor your email inbox, as companies may reach out to you.",
  },
];

function Setup1({ formData, setFormData }) {
    /*
    // handle change event for form elements
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
    */

  return (
    <div className="content">
        <h3>
          Welcome to the Resume Book! Please follow the instructions below <br/> to ensure companies can access your updated profile.
        </h3>
        {steps.map((step, index) => (
          <StepCard key={index} number={step.number} description={step.description} />
        ))}
    </div>
  );
}

export default Setup1;