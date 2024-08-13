import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';
import { API_BASE_URL } from '../config';

function StudentProfileList() {
  const [resumes, setResumes] = useState([]);
  const [nameFilter, setFilter] = useState('');
  const [majorFilter, setMajorFilter] = useState('ACTSCI');
  const [undergradYearFilter, setUndergradYearFilter] = useState('');
  //const [graduationYearFilter, setGraduationYearFilter] = useState('');
  const [examsPassedFilter, setExamsPassedFilter] = useState('');
  const [gpaFilter, setGpaFilter] = useState('');
  const [sortBy, setSortBy] = useState('graduationYear');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  function resetFilters() {
    setFilter('');
    setUndergradYearFilter('');
    //setGraduationYearFilter('');
    setExamsPassedFilter('');
    setGpaFilter('');
    setMajorFilter('ACTSCI');
    setSortBy('graduationYear');
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
  
  const countExamsPassed = (examsPassed) => {
    return Object.values(examsPassed).filter(Boolean).length;
  };

  const filteredResumes = resumes.filter(resume =>
    `${resume.firstName} ${resume.lastName}`
      .toLowerCase()
      .includes(nameFilter.toLowerCase()) &&
      (resume.major ? resume.major.toLowerCase().includes(majorFilter.toLowerCase()) : true) &&
      (undergradYearFilter === '' || resume.undergradYear === undergradYearFilter) &&
      //(graduationYearFilter === '' || (resume.graduation.toString() === graduationYearFilter)) &&
      (examsPassedFilter === '' || countExamsPassed(resume.examsPassed) >= parseInt(examsPassedFilter, 10)) &&
      (gpaFilter === '' || (resume.gpa >= gpaFilter)) 
  );
  
  const sortedResumes = [...filteredResumes].sort((a, b) => {
    const isAsc = sortOrder === 'asc' ? 1 : -1;
    let aValue, bValue;
  
    if (sortBy === 'graduationYear') {
      const convertGraduationToSortableValue = (graduation) => {
        if (!graduation) return '';
        const [term, year] = graduation.split(' ');
        const termValue = term === 'Spring' ? '1' : (term === 'Fall' ? '2' : '0');
        //console.log(`${year || '0000'}${termValue}`);
        return `${year || '0000'}${termValue}`;
      };
  
      aValue = convertGraduationToSortableValue(a.graduation);
      bValue = convertGraduationToSortableValue(b.graduation);
    } else if (sortBy === 'gpa') {
      aValue = a.gpa;
      bValue = b.gpa;
    } else if (sortBy === 'lastName') {
      aValue = a.lastName;
      bValue = b.lastName;
    } else if (sortBy === 'uploadedAt') {
      aValue = new Date(a.resume.uploadedAt);
      bValue = new Date(b.resume.uploadedAt);
    } else if (sortBy === 'examsPassed') {
      aValue = countExamsPassed(a.examsPassed);
      bValue = countExamsPassed(b.examsPassed);
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
            <select
              value={undergradYearFilter}
              onChange={(e) => setUndergradYearFilter(e.target.value)}
              style={{ width: '150px' }}
            >
              <option value="">Undergrad Year</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>
            {/*
            <input
              type="text"
              placeholder="Graduation Term"
              value={graduationYearFilter}
              onChange={(e) => setGraduationYearFilter(e.target.value)}
              style={{ width: '150px' }}
            />
            */}
            <input
                type="number"
                placeholder="Exams"
                value={examsPassedFilter}
                onChange={(e) => setExamsPassedFilter(e.target.value)}
                min="0"
                max="16"
                style={{ width: '150px' }}
            />
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
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="graduationYear">Sort by Graduation Year</option>
                <option value="examsPassed">Sort by Exams Passed</option>
                <option value="gpa">Sort by GPA</option>
                <option value="lastName">Sort by Last Name</option>
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
                        <th>Undergrad Year</th>
                        <th>Expected Graduation</th>
                        <th>Exams Passed</th>
                        <th>GPA</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                  {sortedResumes.map((resume, index) => (
                    <tr key={index}>
                      <td>{`${resume.firstName} ${resume.lastName}`}</td>
                      {/*<td>{resume.major || 'N/A'}</td>*/}
                      <td>{resume.undergradYear || 'N/A'}</td>
                      <td>{resume.graduation || 'N/A'}</td>
                      <td>{countExamsPassed(resume.examsPassed)}</td>
                      <td>{resume.gpa || 'N/A'}</td>
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