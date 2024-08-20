import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';
import { API_BASE_URL } from '../config';

function StudentProfileList() {
  const [resumes, setResumes] = useState([]);
  const [filters, setFilters] = useState({
    nameFilter: '',
    majorFilter: 'ACTSCI',
    undergradYearFilter: '',
    examsPassedFilter: '',
    gpaFilter: '',
    sortBy: 'graduationYear',
    sortOrder: 'asc'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const shouldRestoreScroll = useRef(true);

  const resetFilters = useCallback(() => {
    const defaultFilters = {
      nameFilter: '',
      majorFilter: 'ACTSCI',
      undergradYearFilter: '',
      examsPassedFilter: '',
      gpaFilter: '',
      sortBy: 'graduationYear',
      sortOrder: 'asc'
    };
    setFilters(defaultFilters);
    localStorage.setItem('resumeFilters', JSON.stringify(defaultFilters));
  }, []);

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/student-profiles`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      setResumes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setError('Failed to fetch profiles. Please try again.');
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem('resumeFilters'));
    if (savedFilters) {
      setFilters(savedFilters);
    }
    if (location.state?.preserveFilters && location.state?.filters) {
      setFilters(location.state.filters);
    }
  }, [location]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  useEffect(() => {
    localStorage.setItem('resumeFilters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    if (!loading && shouldRestoreScroll.current) {
      const savedScrollPosition = localStorage.getItem('resumeListScrollPosition');
      if (savedScrollPosition) {
        window.scrollTo(0, parseInt(savedScrollPosition));
        localStorage.removeItem('resumeListScrollPosition');
      }
      shouldRestoreScroll.current = false;
    }
  }, [loading]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
    shouldRestoreScroll.current = false; 
  };



  const openStudentProfile = (studentProfile) => {
    localStorage.setItem('resumeListScrollPosition', window.scrollY.toString());
    navigate('/student-profile', { 
      state: { 
        studentProfile,
        filters: filters
      } 
    });
  };

  const countExamsPassed = (examsPassed) => {
    if (!examsPassed) return 0;
    return Object.values(examsPassed).filter(Boolean).length;
  };

  const filteredResumes = resumes.filter(resume => {
    try {
      return (
        `${resume.firstName} ${resume.lastName}`
          .toLowerCase()
          .includes(filters.nameFilter.toLowerCase()) &&
        (resume.major ? resume.major.toLowerCase().includes(filters.majorFilter.toLowerCase()) : true) &&
        (filters.undergradYearFilter === '' || resume.undergradYear === filters.undergradYearFilter) &&
        (filters.examsPassedFilter === '' || countExamsPassed(resume.examsPassed) >= parseInt(filters.examsPassedFilter, 10)) &&
        (filters.gpaFilter === '' || (resume.gpa >= filters.gpaFilter)) 
      );
    } catch (error) {
      console.error('Error filtering resume:', error, resume);
      return false;
    }
  });
  
  const sortedResumes = [...filteredResumes].sort((a, b) => {
    const isAsc = filters.sortOrder === 'asc' ? 1 : -1;
    let aValue, bValue;
  
    if (filters.sortBy === 'graduationYear') {
      const convertGraduationToSortableValue = (graduation) => {
        if (!graduation) return '';
        const [term, year] = graduation.split(' ');
        const termValue = term === 'Spring' ? '1' : (term === 'Fall' ? '2' : '0');
        //console.log(`${year || '0000'}${termValue}`);
        return `${year || '0000'}${termValue}`;
      };
  
      aValue = convertGraduationToSortableValue(a.graduation);
      bValue = convertGraduationToSortableValue(b.graduation);
    } else if (filters.sortBy === 'gpa') {
      aValue = a.gpa;
      bValue = b.gpa;
    } else if (filters.sortBy === 'lastName') {
      aValue = a.lastName;
      bValue = b.lastName;
    } else if (filters.sortBy === 'uploadedAt') {
      aValue = new Date(a.resume.uploadedAt);
      bValue = new Date(b.resume.uploadedAt);
    } else if (filters.sortBy === 'examsPassed') {
      aValue = countExamsPassed(a.examsPassed);
      bValue = countExamsPassed(b.examsPassed);
    } else {
      aValue = a[filters.sortBy];
      bValue = b[filters.sortBy];
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
                name="nameFilter"
                placeholder="Name"
                value={filters.nameFilter}
                onChange={handleFilterChange}
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
              name="undergradYearFilter"
              value={filters.undergradYearFilter}
              onChange={handleFilterChange}
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
                name="examsPassedFilter"
                placeholder="Exams"
                value={filters.examsPassedFilter}
                onChange={handleFilterChange}
                min="0"
                max="16"
                style={{ width: '150px' }}
            />
            <input
                type="number"
                name="gpaFilter"
                placeholder="GPA"
                value={filters.gpaFilter}
                onChange={handleFilterChange}
                min="0"
                max="4"
                step="0.5"
                style={{ width: '80px' }}
            />
            <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
              <option value="graduationYear">Sort by Graduation Year</option>
              <option value="examsPassed">Sort by Exams Passed</option>
              <option value="gpa">Sort by GPA</option>
              <option value="lastName">Sort by Last Name</option>
              <option value="uploadedAt">Sort by Upload Date</option>
            </select>
            <select name="sortOrder" value={filters.sortOrder} onChange={handleFilterChange}>
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
                {sortedResumes.map((resume, index) => {
                  try {
                    return (
                      <tr key={index}>
                        <td>{`${resume.firstName} ${resume.lastName}`}</td>
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
                    );
                  } catch (error) {
                    console.error('Error rendering resume:', error, resume);
                    return null;
                  }
                })}
                </tbody>
            </table>
        </div>
    </div>
  );
}

export default StudentProfileList;