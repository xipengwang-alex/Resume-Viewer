import React, { useState } from 'react';
import Setup2 from './Setup2';
import Setup3 from './Setup3';

function UploadPage() {
    const [formData, setFormData] = useState({
      // Initialize your form data structure here
    });


    return (
        <div className="upload-page">
            <Setup2
            formData={formData}
            setFormData={setFormData}
            header={0}
            className="upload-page-content"
            />
            <Setup3
            formData={formData}
            setFormData={setFormData}
            header={0}
            className="upload-page-content"
            />

            <div className="navigation-container edit">
                <button className="button black">Cancel</button>
                <button className="button gold">Save</button>
            </div>
        </div>
    );
}

export default UploadPage;
