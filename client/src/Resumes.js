import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [nameFilter, setFilter] = useState('');
  const [majorFilter, setMajorFilter] = useState('');
  const [gpaFilter, setGpaFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sortBy, setSortBy] = useState('fileName');
  const [sortOrder, setSortOrder] = useState('asc');

  const yearValues = {
    Freshman: 1,
    Sophomore: 2,
    Junior: 3,
    Senior: 4,
  };
  
  function resetFilters() {
    setFilter('');
    setGpaFilter('');
    setYearFilter('');
    setMajorFilter('');
    setSortBy('year');
    setSortOrder('asc');
  }
  

  
  useEffect(() => {
    axios.get('http://localhost:3000/resumes')
      .then(response => {
        setResumes(response.data);
      });
  }, []);

  const openResume = (url) => {
    window.open(url, '_blank');
  };
  

  const filteredResumes = resumes.filter(resume =>
    `${resume.tags["first name"]} ${resume.tags["last name"]}`
    .toLowerCase()
    .includes(nameFilter.toLowerCase()) &&
    (resume.tags.major ? resume.tags.major.toLowerCase().includes(majorFilter.toLowerCase()) : true) &&
    (gpaFilter === '' || (resume.tags && resume.tags.gpa >= gpaFilter)) &&
    (yearFilter ? yearValues[resume.tags.year] >= parseInt(yearFilter) : true)
);

  const sortedResumes = [...filteredResumes].sort((a, b) => {
    const isAsc = sortOrder === 'asc' ? 1 : -1;
    let aValue, bValue;
    
    if (sortBy === 'year') {
      aValue = yearValues[a.tags.year];
      bValue = yearValues[b.tags.year];
    } else if (['gpa', 'last name'].includes(sortBy)) {
      aValue = a.tags[sortBy];
      bValue = b.tags[sortBy];
    } else {
      aValue = a[sortBy];
      bValue = b[sortBy];
    }
    
    return aValue < bValue ? -1 * isAsc : 1 * isAsc;
  });


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
            <input
                type="text"
                placeholder="Major"
                value={majorFilter}
                onChange={(e) => setMajorFilter(e.target.value)}
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
            <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
            >
                <option value="1">Freshman</option>
                <option value="2">Sophomore</option>
                <option value="3">Junior</option>
                <option value="4">Senior</option>
            </select>
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
                        <th>Major</th>
                        <th>Gender</th>
                        <th>GPA</th>
                        <th>Year</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedResumes.map(resume => (
                        <tr key={resume._id}>
                            <td>{resume.tags && `${resume.tags["first name"]} ${resume.tags["last name"]}`}</td>
                            <td>{resume.tags && resume.tags.major}</td>
                            <td>{resume.tags && resume.tags.gender}</td>
                            <td>{resume.tags && resume.tags.gpa}</td>
                            <td>{resume.tags && resume.tags.year}</td>
                            <td>
                                <button onClick={() => openResume(`http://localhost:3000${resume.filePath}`)}>
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

export default Resumes;