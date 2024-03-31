import React, { useState } from 'react';
import Upload from './Upload';
import Setup2 from './Setup2';
import Setup3 from './Setup3';

function UploadPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
      // Initialize your form data structure here
    });


    return (
        <div className="upload-page">
            <Setup2
            formData={formData}
            setFormData={setFormData}
            className="upload-page-content"
            />
            <Setup3
            formData={formData}
            setFormData={setFormData}
            header={0}
            className="upload-page-content"
            />
        </div>
    );
}

export default UploadPage;
