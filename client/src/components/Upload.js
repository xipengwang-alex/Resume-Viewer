import React, { useState } from 'react';
import axios from 'axios';

function Upload() {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState({});

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTagsChange = (e) => {
    const { name, value } = e.target;
    setTags(prevTags => ({ ...prevTags, [name]: value }));
  };

  const handleSubmit = async (e) => {    
    try {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('tags', JSON.stringify(tags));
        
        await axios.post('http://localhost:3000/upload', formData);
        
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert('An error occurred while uploading the file.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div className="input-row">
        <input type="file" onChange={handleFileChange} required />
        <input type="text" name="first name" placeholder="First Name" onChange={handleTagsChange} />
        <input type="text" name="last name" placeholder="Last Name" onChange={handleTagsChange} />
      </div>
      <div className="input-row">
        <input type="text" name="gender" placeholder="Gender" onChange={handleTagsChange} />
        <select name="year" style={{ height: '43px'}} onChange={handleTagsChange}>
          <option value="" disabled selected>Select your Year</option>
          <option value="Freshman">Freshman</option>
          <option value="Sophomore">Sophomore</option>
          <option value="Junior">Junior</option>
          <option value="Senior">Senior</option>
        </select>
        <input type="number" step="0.5" name="gpa" placeholder="GPA" onChange={handleTagsChange} />
        <input type="text" name="major" placeholder="Major" onChange={handleTagsChange} />
      </div>
      <button type="submit">Upload</button>
    </form>
  );
}
export default Upload;
