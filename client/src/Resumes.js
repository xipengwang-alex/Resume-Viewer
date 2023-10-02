import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Resumes() {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/resumes')
      .then(response => {
        setResumes(response.data);
      });
  }, []);

  const openResume = (url) => {
    window.open(url, '_blank');
  };
  

  return (
    <div>
      {resumes.map(resume => (
        <div key={resume._id}>
          <button onClick={() => openResume(`http://localhost:3000${resume.filePath}`)}>
          {resume.tags["first name"]} {resume.tags["last name"]}
          </button>
        </div>
      ))}
    </div>
  );



}

export default Resumes;