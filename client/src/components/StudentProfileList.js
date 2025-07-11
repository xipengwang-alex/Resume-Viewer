import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';
import { API_BASE_URL, getCurrentOrganization } from '../config';

function StudentProfileList() {
  const [allResumes, setAllResumes] = useState([]);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [filters, setFilters] = useState({
    nameFilter: '',
    majorFilter: 'ACTSCI',
    undergradYearFilter: '',
    examsPassedFilter: '',
    gpaFilter: '',
    sortBy: 'graduationYear',
    sortOrder: 'asc',
    positionTypeFilter: '',
    workAuthorizationFilter: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const shouldRestoreScroll = useRef(true);
  const organization = getCurrentOrganization();

  const resetFilters = useCallback(() => {
    const defaultFilters = {
      nameFilter: '',
      majorFilter: 'ACTSCI',
      undergradYearFilter: '',
      examsPassedFilter: '',
      gpaFilter: '',
      sortBy: 'graduationYear',
      sortOrder: 'asc',
      positionTypeFilter: '',
      workAuthorizationFilter: ''
    };
    setFilters(defaultFilters);
    localStorage.setItem('resumeFilters', JSON.stringify(defaultFilters));
  }, []);

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/student-profiles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllResumes(response.data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setError('Failed to fetch profiles. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem('resumeFilters'));
    if (savedFilters) {
      setFilters(savedFilters);
    }
    if (location.state?.preserveFilters && location.state?.filters) {
      setFilters(location.state.filters);
    }
    fetchResumes();
  }, [location, fetchResumes]);

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

  const sortResumes = useCallback((resumes) => {
    return [...resumes].sort((a, b) => {
      const isAsc = filters.sortOrder === 'asc' ? 1 : -1;
      if (filters.sortBy === 'graduationYear') {
        return compareGraduation(a.graduation, b.graduation) * isAsc;
      } else if (filters.sortBy === 'gpa') {
        return (a.gpa - b.gpa) * isAsc;
      } else if (filters.sortBy === 'lastName') {
        return a.lastName.localeCompare(b.lastName) * isAsc;
      } else if (filters.sortBy === 'uploadedAt') {
        return (new Date(a.resume.uploadedAt) - new Date(b.resume.uploadedAt)) * isAsc;
      } else if (filters.sortBy === 'examsPassed') {
        return (countExamsPassed(a.examsPassed) - countExamsPassed(b.examsPassed)) * isAsc;
      }
      return 0;
    });
  }, [filters.sortBy, filters.sortOrder]);

  useEffect(() => {
    const filterAndSortResumes = () => {
      let result = allResumes;

      // Apply filters
      if (filters.nameFilter) {
        result = result.filter(resume =>
          `${resume.firstName} ${resume.lastName}`
            .toLowerCase()
            .includes(filters.nameFilter.toLowerCase())
        );
      }
      if (filters.undergradYearFilter) {
        result = result.filter(resume => resume.undergradYear === filters.undergradYearFilter);
      }
      if (filters.examsPassedFilter) {
        result = result.filter(resume => 
          countExamsPassed(resume.examsPassed) >= parseInt(filters.examsPassedFilter, 10)
        );
      }
      if (filters.gpaFilter) {
        result = result.filter(resume => resume.gpa >= filters.gpaFilter);
      }
      if (filters.positionTypeFilter) {
        result = result.filter(resume => {
          if (filters.positionTypeFilter === 'internship') {
            return resume.opportunityType === 'internship' || resume.opportunityType === 'bothInternshipAndFullTime';
          } else if (filters.positionTypeFilter === 'fullTime') {
            return resume.opportunityType === 'fullTime' || resume.opportunityType === 'bothInternshipAndFullTime';
          }
          return true;
        });
      }
      if (filters.workAuthorizationFilter) {
        result = result.filter(resume => {
          if (filters.workAuthorizationFilter === 'yes') {
            return resume.willNeedSponsorship === 'yes' || resume.willNeedSponsorship === 'notSure';
          } else {
            return resume.willNeedSponsorship === filters.workAuthorizationFilter;
          }
        });
      }
    
      // Apply sorting
      result = sortResumes(result);

      setFilteredResumes(result);
    };

    filterAndSortResumes();
  }, [allResumes, filters, sortResumes]);

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
    navigate(`/${organization}/student-profile`, { 
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

  const compareGraduation = (a, b) => {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;
    const [termA, yearA] = a.split(' ');
    const [ , yearB] = b.split(' ');
    if (yearA !== yearB) return yearA - yearB;
    return termA === 'Spring' ? -1 : 1;
  };

  const handleDownload = async (resumeFilePath, studentName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios({
        url: `${API_BASE_URL}${resumeFilePath}`,
        method: 'GET',
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${studentName}_resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume. Please try again.');
    }
  };

  const handleExcelDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios({
        url: `${API_BASE_URL}/export/excel`,
        method: 'GET',
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `student_profiles_${organization}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading Excel file:', error);
      alert('Failed to download Excel file. Please try again.');
    }
  };

  if (loading) return <div>Loading profiles...</div>;
  if (error) return <div>{error}</div>;
  
  return (
    <div>
      <div className="filters-container">

        <div className="filters-line">
          <input
            type="text"
            name="nameFilter"
            placeholder="Name"
            value={filters.nameFilter}
            onChange={handleFilterChange}
            style={{ width: '100px' }}
          />
          <select
            name="undergradYearFilter"
            value={filters.undergradYearFilter}
            onChange={handleFilterChange}
          >
            <option value="">Year of Study</option>
            <option value="Freshman">Freshman</option>
            <option value="Sophomore">Sophomore</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
            <option value="Graduate">Graduate</option>
          </select>

          {organization === 'actuarial_science' && (
            <input
              type="number"
              name="examsPassedFilter"
              placeholder="Exams"
              value={filters.examsPassedFilter}
              onChange={handleFilterChange}
              min="0"
              max="16"
              className="half-width"
            />
          )}

          <input
            type="number"
            name="gpaFilter"
            placeholder="GPA"
            value={filters.gpaFilter}
            onChange={handleFilterChange}
            min="0"
            max="4"
            step="0.5"
            className="half-width"
          />
          <select
            name="positionTypeFilter"
            value={filters.positionTypeFilter}
            onChange={handleFilterChange}
          >
            <option value="">Position Type</option>
            <option value="internship">Intern</option>
            <option value="fullTime">Full-time</option>
          </select>
          <select
            name="workAuthorizationFilter"
            value={filters.workAuthorizationFilter}
            onChange={handleFilterChange}
          >
            <option value="">Work Authorization</option>
            <option value="no">Eligible to work in the U.S. with no restrictions</option>
            <option value="yes">Will require visa sponsorship</option>
          </select>
        </div>
        <div className="sorting-line">
          <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
            <option value="graduationYear">Sort by Graduation Year</option>
            {organization === 'actuarial_science' && (
              <option value="examsPassed">Sort by Exams Passed</option>
            )}
            <option value="gpa">Sort by GPA</option>
            <option value="lastName">Sort by Last Name</option>
            <option value="uploadedAt">Sort by Upload Date</option>
          </select>
          <select name="sortOrder" value={filters.sortOrder} onChange={handleFilterChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <button onClick={resetFilters}>Clear</button>
          
          {organization === 'actuarial_science' && (
            <button onClick={handleExcelDownload} style={{ marginLeft: '10px' }}>
              Download as Excel
            </button>
          )}
        </div>
      </div>
      <div className="table-container">
        <table className="table">
          <colgroup>
            <col style={{ width: '25%' }} />{/* Name */}
            <col style={{ width: '20%' }} />{/* Year of Study */}
            <col style={{ width: '15%' }} />{/* Expected Graduation */}
            {organization === 'actuarial_science' && <col style={{ width: '10%' }} />}{/* Exams Passed */}
            <col style={{ width: '10%' }} />{/* GPA */}
            <col style={{ width: '30%' }} />{/* Actions */}
          </colgroup>
          <thead>
            <tr>
              <th>Name</th>
              <th>Year of Study</th>
              <th>Expected Graduation</th>
              {organization === 'actuarial_science' && <th>Exams Passed</th>}
              <th>GPA</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {filteredResumes.map((resume, index) => (
            <tr key={index}>
              <td>{`${resume.firstName} ${resume.lastName}`}</td>
              <td>{resume.undergradYear || 'N/A'}</td>
              <td>{resume.graduation || 'N/A'}</td>
              {organization === 'actuarial_science' && <td>{countExamsPassed(resume.examsPassed)}</td>}
              <td>{resume.gpa || 'N/A'}</td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => openStudentProfile(resume)}>
                    View
                  </button>
                  <button onClick={() => handleDownload(resume.resume.filePath, `${resume.firstName}_${resume.lastName}`)}>
                    Download
                  </button>
                </div>
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