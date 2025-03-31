import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './staff.css';

const Staff = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalStaff, setTotalStaff] = useState(0);
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    // Load staff from localStorage
    const storedStaff = JSON.parse(localStorage.getItem('staff')) || [];
    setStaffMembers(storedStaff);
    setTotalStaff(storedStaff.length);
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAddStaff = () => {
    navigate('/new-staff');
  };

  // Calculate pagination
  const indexOfLastStaff = currentPage * rowsPerPage;
  const indexOfFirstStaff = indexOfLastStaff - rowsPerPage;
  const currentStaff = staffMembers.slice(indexOfFirstStaff, indexOfLastStaff);

  return (
    <div className="staff-container">
      <div className="staff-header">
        <h1>Staff Management</h1>
        <button className="add-staff-btn" onClick={handleAddStaff}>
          + Add Staff
        </button>
      </div>
      
      <div className="registered-departments">
        <h2>Departments</h2>
        <div className="department-types">
            <button className="department-type-btn" onClick={() => navigate("/")}>Home</button>
          <button className="department-type-btn">Administration</button>
          <button className="department-type-btn">Security</button>
          <button className="department-type-btn">Maintenance</button>
        </div>
      </div>
      
      <div className="divider"></div>
      
      <div className="staff-tabs">
        {['All', 'Active', 'Inactive', 'On Leave'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search by staff name, ID, or department" 
        />
        <div className="staff-types">
          <span>Full-time</span>
          <span>Part-time</span>
        </div>
      </div>
      
      <div className="action-header">
        <div className="action-title">STAFF RECORDS</div>
        <div className="header-row">
          <div>ID</div>
          <div>NAME</div>
          <div>DEPARTMENT</div>
          <div>CONTACT NO.</div>
          <div>EMAIL</div>
          <div>POSITION</div>
          <div>JOIN DATE</div>
          <div>STATUS</div>
          <div>ACTIONS</div>
        </div>
      </div>
      
      <div className="staff-list">
        {currentStaff.map(staff => (
          <div key={staff.id} className="staff-row">
            <div className="staff-cell">{staff.id}</div>
            <div className="staff-cell">{staff.name}</div>
            <div className="staff-cell">{staff.department}</div>
            <div className="staff-cell">{staff.contact}</div>
            <div className="staff-cell">{staff.email}</div>
            <div className="staff-cell">{staff.position}</div>
            <div className="staff-cell">{staff.joinDate}</div>
            <div className={`staff-cell status-${staff.status.toLowerCase()}`}>
              {staff.status}
            </div>
            <div className="staff-cell">
              <button className="action-btn edit-btn">Edit</button>
              <button className="action-btn delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pagination">
        <div className="rows-per-page">
          Rows per page: 
          <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className="page-info">
          {`${indexOfFirstStaff + 1}-${Math.min(indexOfLastStaff, totalStaff)} of ${totalStaff}`}
        </div>
        <div className="page-buttons">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage * rowsPerPage >= totalStaff}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Staff;