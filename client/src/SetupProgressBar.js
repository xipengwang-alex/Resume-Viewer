import React from 'react';

function SetupProgressBar({ currentStep, totalSteps }) {
  const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100 +1;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
    </div>
  );
}

export default SetupProgressBar;

