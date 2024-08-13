import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Setup2 from './Setup2';
import Setup3 from './Setup3';
import { API_BASE_URL } from '../config';

function UserProfilePage() {
    const navigate = useNavigate(); 
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`${API_BASE_URL}/myprofile`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProfile(res.data);
            } catch (err) {
                    console.error('Failed to fetch profile', err);
                    setError('Failed to load profile. Please try again.');
                } finally {
                    setLoading(false);
                }
            };

        fetchProfile();
    }, []);


    const handleBack = () => {
        navigate('/landing');
      };
    
    return (
        <div className="edit-profile-page">
            {loading ? (
                <div>Loading profile...</div>
            ) : error ? (
                <div>{error}</div>
            ) : profile ? (
                <>
                    <Setup2
                    formData={profile}
                    header={0}
                    className="edit-profile-page-content"
                    readOnly={true} 
                    showResumeView={false}
                    />
                    <Setup3
                    formData={profile}
                    header={0}
                    className="edit-profile-page-content"
                    readOnly={true} 
                    />
                    <Setup2
                    formData={profile}
                    header={0}
                    className="edit-profile-page-content"
                    readOnly={true} 
                    showPersonalInfo={false}
                    />
                    <div className="button-container">
                    <button className="button black" onClick={handleBack}>Back</button>
                    </div>
                </>
            ) : (
                <p>No profile found.</p>
            )}
        </div>
    );
}

export default UserProfilePage;
