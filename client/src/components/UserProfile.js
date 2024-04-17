import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Setup2 from './Setup2';
import Setup3 from './Setup3';
import { API_BASE_URL } from '../config';

function UserProfile() {
    const navigate = useNavigate(); 
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/myprofile`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProfile(res.data);
            } catch (err) {
                console.error('Failed to fetch profile', err);
            }
        };

        fetchProfile();
    }, []);


    const handleBack = () => {
        navigate('/landing');
      };
    
    return (
        <div className="upload-page">
            {profile ? (
                <>
                    <Setup2
                    formData={profile}
                    header={0}
                    className="upload-page-content"
                    readOnly={true} 
                    />
                    <Setup3
                    formData={profile}
                    header={0}
                    className="upload-page-content"
                    readOnly={true} 
                    />
                    <div className="button-container">
                        <button className="button black" onClick={handleBack}>Back</button>
                    </div>
                </>
            ) : (
                <p>Retrieving your profile...</p>
            )}
        </div>
    );
}

export default UserProfile;
