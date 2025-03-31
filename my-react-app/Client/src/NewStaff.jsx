import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewStaff.css';

const NewStaff = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    contact: '',
    email: '',
    position: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'Active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newStaff = {
      id: `STAFF-${Date.now()}`,
      ...formData
    };

    // Save to localStorage
    const existingStaff = JSON.parse(localStorage.getItem('staff')) || [];
    const updatedStaff = [newStaff, ...existingStaff];
    localStorage.setItem('staff', JSON.stringify(updatedStaff));

    navigate('/staff');
  };

  return (
    <div className="new-staff-container">
      <h1>ADD NEW STAFF MEMBER</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Contact Number:</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email Address:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Employment Details</h2>
          <div className="form-group">
            <label>Department:</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option value="Administration">Administration</option>
              <option value="Security">Security</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Housekeeping">Housekeeping</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Position:</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Join Date:</label>
            <input
              type="date"
              name="joinDate"
              value={formData.joinDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/staff')}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Add Staff Member
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewStaff;