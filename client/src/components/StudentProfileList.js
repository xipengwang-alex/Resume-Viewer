import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';
import { API_BASE_URL } from '../config';

function StudentProfileList() {
  const [resumes, setResumes] = useState([]);
  const [nameFilter, setFilter] = useState('');
  const [majorFilter, setMajorFilter] = useState('ACTSCI');
  const [gpaFilter, setGpaFilter] = useState('');
  const [graduationYearFilter, setGraduationYearFilter] = useState('');
  const [sortBy, setSortBy] = useState('fileName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  function resetFilters() {
    setFilter('');
    setGpaFilter('');
    setGraduationYearFilter('');
    setMajorFilter('ACTSCI');
    setSortBy('year');
    setSortOrder('asc');
  }
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    axios.get(`${API_BASE_URL}/student-profiles`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setResumes(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching profiles:', error);
        setError('Failed to fetch profiles. Please try again.');
        setLoading(false);
      });
  }, []);

  /*
  const openResume = (url) => {
    window.open(url, '_blank');
  };
  */

  const openStudentProfile = (studentProfile) => {
    navigate('/student-profile', { state: { studentProfile } });
  };
  
  const filteredResumes = resumes.filter(resume =>
    `${resume.firstName} ${resume.lastName}`
      .toLowerCase()
      .includes(nameFilter.toLowerCase()) &&
      (resume.major ? resume.major.toLowerCase().includes(majorFilter.toLowerCase()) : true) &&
      (gpaFilter === '' || (resume.gpa >= gpaFilter)) &&
      (graduationYearFilter === '' || (resume.graduation.toString() === graduationYearFilter))
  );
  
  const sortedResumes = [...filteredResumes].sort((a, b) => {
    const isAsc = sortOrder === 'asc' ? 1 : -1;
    let aValue, bValue;
  
    if (sortBy === 'graduation') {
      aValue = a.graduation;
      bValue = b.graduation;
    } else if (sortBy === 'gpa') {
      aValue = a.gpa;
      bValue = b.gpa;
    } else if (sortBy === 'lastName') {
      aValue = a.lastName;
      bValue = b.lastName;
    } else if (sortBy === 'uploadedAt') {
      aValue = new Date(a.resume.uploadedAt);
      bValue = new Date(b.resume.uploadedAt);
    } else {
      aValue = a[sortBy];
      bValue = b[sortBy];
    }
  
    if (aValue < bValue) return -1 * isAsc;
    if (aValue > bValue) return 1 * isAsc;
    return 0;
  });

  if (loading) return <div>Loading profiles...</div>;
  if (error) return <div>{error}</div>;
  
  return (
    <div>
        <div className="filters">
            <input
                type="text"
                placeholder="Name"
                value={nameFilter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ width: '150px' }}
            />
            {/*
            <input
                type="text"
                placeholder="Major"
                value={majorFilter}
                onChange={(e) => setMajorFilter(e.target.value)}
                style={{ width: '150px' }}
            />
            */}
            <input
                type="number"
                placeholder="GPA"
                value={gpaFilter}
                onChange={(e) => setGpaFilter(e.target.value)}
                min="0"
                max="4"
                step="0.5"
                style={{ width: '80px' }}
            />
            <input
                type="number"
                placeholder="Graduation Year"
                value={graduationYearFilter}
                onChange={(e) => setGraduationYearFilter(e.target.value)}
                min="2020"
                max="2030"
                style={{ width: '150px' }}
            />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="year">Sort by Year</option>
                <option value="gpa">Sort by GPA</option>
                <option value="last name">Sort by Last Name</option>
                <option value="uploadedAt">Sort by Upload Date</option>
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
            <button onClick={resetFilters}>Clear</button>
        </div>
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        {/*<th>Major</th>*/}
                        <th>GPA</th>
                        <th>Expected Graduation</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                  {sortedResumes.map((resume, index) => (
                    <tr key={index}>
                      <td>{`${resume.firstName} ${resume.lastName}`}</td>
                      {/*<td>{resume.major || 'N/A'}</td>*/}
                      <td>{resume.gpa || 'N/A'}</td>
                      <td>{resume.graduation || 'N/A'}</td>
                      <td>
                        <button onClick={() => openStudentProfile(resume)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}

export default StudentProfileList;