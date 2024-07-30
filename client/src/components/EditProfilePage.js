import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Setup2 from './Setup2';
import Setup3 from './Setup3';
import { API_BASE_URL } from '../config';

function EditProfilePageWithAuth() {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({ examsPassed: {} });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get(`${API_BASE_URL}/myprofile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setFormData(res.data);
          if (res.data.resume && res.data.resume.filePath) {
            const resumeUrl = `${API_BASE_URL}` + res.data.resume.filePath;
            setFile(resumeUrl);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch profile', err);
        setError('Failed to load profile. Please try again.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (file) => {
    setFile(file);
  };

  const handleCancel = () => {
    navigate('/landing');
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
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

      if (file) {
        form.append('resume', file);
      }

      console.log('Form Data:', formData);

      // post
      const response = await axios.post(`${API_BASE_URL}/student-profiles`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data.message);
      navigate('/landing', { state: { showSuccess: true } });
    } catch (error) {
      console.error(error);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

    return (
        <div className="edit-profile-page">
            <Setup2
            formData={formData}
            setFormData={setFormData}
            handleFileChange={handleFileChange} 
            file={file}
            header={0}
            className="edit-profile-page-content"
            />
            <Setup3
            formData={formData}
            setFormData={setFormData}
            header={0}
            className="edit-profile-page-content"
            />

            <div className="navigation-container edit">
                <button className="button black" onClick={handleCancel}>Cancel</button>
                <button className="button gold" onClick={handleSave}>Save</button>
            </div>
        </div>
    );
}

export default EditProfilePageWithAuth;
