import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Visitor.css';

const Visitor = () => {
  const [visitors, setVisitors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [activeTab, setActiveTab] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Main function to load visitors from localStorage
  const loadVisitors = () => {
    setIsLoading(true);
    try {
      const storedVisitors = JSON.parse(localStorage.getItem('visitors')) || [];
      // Sort by newest first
      const sortedVisitors = storedVisitors.sort((a, b) => b.id - a.id);
      setVisitors(sortedVisitors);
      setTotalVisitors(sortedVisitors.length);
    } catch (error) {
      console.error('Error loading visitors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load immediately on mount
    loadVisitors();

    // Create a custom event listener for our own storage updates
    const handleCustomStorageEvent = () => {
      loadVisitors();
    };

    // Listen for both standard storage events and our custom events
    window.addEventListener('storage', loadVisitors);
    window.addEventListener('custom-storage', handleCustomStorageEvent);
    
    // Poll localStorage as a fallback (every 2 seconds)
    const pollInterval = setInterval(loadVisitors, 2000);

    return () => {
      window.removeEventListener('storage', loadVisitors);
      window.removeEventListener('custom-storage', handleCustomStorageEvent);
      clearInterval(pollInterval);
    };
  }, []);

  // Handle page changes
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle rows per page changes
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'Visitor in') navigate('/visitor-in');
    else if (tab === 'Visitor Out') navigate('/visitor-out');
  };

  // Handle adding new visitor
  const handleAddVisitor = () => {
    navigate('/new-visitor');
  };

  // Calculate pagination
  const indexOfLastVisitor = currentPage * rowsPerPage;
  const indexOfFirstVisitor = indexOfLastVisitor - rowsPerPage;
  const currentVisitors = visitors.slice(indexOfFirstVisitor, indexOfLastVisitor);

  return (
    <div className="visitor-container">
      <div className="visitor-header">
        <h1>Visitor</h1>
        <button className="add-visitor-btn" onClick={handleAddVisitor}>
          + New Visitor
        </button>
      </div>
      
      <div className="registered-vehicles">
        <h2>Registered Vehicles</h2>
        <div className="vehicle-types">
          <button className="vehicle-type-btn" onClick={() => navigate("/staff")}>Staff</button>
          <button className="vehicle-type-btn">Patrolling</button>
          <button className="vehicle-type-btn">Goods In/Out</button>
        </div>
      </div>
      
      <div className="divider"></div>

      <div className="visitor-tabs">
        {['All', 'Visitor in', 'Visitor Out', 'Approvals', 'History', 'Logs', 'Self-Registration'].map(tab => (
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
          placeholder="Search using Visitor name, Host, vehicle number" 
        />
        <div className="visitor-types">
          <span>Expected visitor</span>
          <span>Unexpected visitor</span>
        </div>
      </div>
      
      <div className="action-header">
        <div className="action-title">ACTION</div>
        <div className="header-row1">
          <div>SR</div>
          <div>TYPE</div>
          <div>NAME</div>
          <div>CONTACT NO.</div>
          <div>PURPOSE</div>
          <div>PASS NO.</div>
          <div>DATE</div>
          <div>TIME</div>
          <div>ORIGIN</div>
          <div>STATUS</div>
        </div>
      </div>
      
      <div className="visitor-list">
        {isLoading ? (
          <div className="loading">Loading visitors...</div>
        ) : visitors.length === 0 ? (
          <div className="empty-state">No visitors found. Add a new visitor to get started.</div>
        ) : (
          currentVisitors.map((visitor, index) => (
            <div key={visitor.id} className="visitor-row">
              <div className="visitor-cell action-cell">{index + 1}</div>
              <div className="visitor-cell">{visitor.type}</div>
              <div className="visitor-cell">{visitor.name}</div>
              <div className="visitor-cell">{visitor.mobile}</div>
              <div className="visitor-cell">{visitor.purpose}</div>
              <div className="visitor-cell">{visitor.passNumber}</div>
              <div className="visitor-cell">{visitor.date}</div>
              <div className="visitor-cell">{visitor.time}</div>
              <div className="visitor-cell">{visitor.origin}</div>
              <div className="visitor-cell">{visitor.status || 'Pending'}</div>
            </div>
          ))
        )}
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
          {`${indexOfFirstVisitor + 1}-${Math.min(indexOfLastVisitor, totalVisitors)} of ${totalVisitors}`}
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
            disabled={currentPage * rowsPerPage >= totalVisitors}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Visitor;