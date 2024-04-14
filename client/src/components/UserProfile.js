import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Setup2 from './Setup2';
import Setup3 from './Setup3';

function UserProfile() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('http://localhost:3000/myprofile', {
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
                </>
            ) : (
                <p>Retrieving your profile...</p>
            )}
        </div>
    );
}

export default UserProfile;
