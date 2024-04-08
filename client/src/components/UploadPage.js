import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Setup2 from './Setup2';
import Setup3 from './Setup3';

function UploadPage() {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({ examsPassed: {} });
  const [file, setFile] = useState(null);

  const handleFileChange = (file) => {
    setFile(file);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const form = new FormData();

      for (const [key, value] of Object.entries(formData)) {
        if (key === 'examsPassed') {
          form.append(key, JSON.stringify(value));
        } else {
          form.append(key, value);
        }
      }
      
      console.log('Form Data:', formData);

      if (file) {
        form.append('resume', file);
      }

      // post
      const response = await axios.post('http://localhost:3000/resumes', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data.message);
      navigate('/resumes');
    } catch (error) {
      console.error(error);
    }
  };


    return (
        <div className="upload-page">
            <Setup2
            formData={formData}
            setFormData={setFormData}
            handleFileChange={handleFileChange} 
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
                <button className="button gold" onClick={handleSave}>Save</button>
            </div>
        </div>
    );
}

export default UploadPage;
