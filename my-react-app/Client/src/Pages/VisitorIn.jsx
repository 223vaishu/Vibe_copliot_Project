import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import './Visitor.css'; // Reuse the same CSS

const VisitorIn = () => {
  const [visitors, setVisitors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load visitors from localStorage and filter for "Visitor In" status
    const storedVisitors = JSON.parse(localStorage.getItem('visitors')) || [];
    const visitorsIn = storedVisitors.filter(visitor => 
      visitor.status === 'In' || visitor.status === 'Checked In'
    );
    setVisitors(visitorsIn);
    setTotalVisitors(visitorsIn.length);
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleAddVisitor = () => {
    navigate('/new-visitor');
  };

  const handleCheckOut = (visitorId) => {
    // Update visitor status to "Out"
    const updatedVisitors = visitors.map(visitor => 
      visitor.id === visitorId ? { ...visitor, status: 'Out', checkOutTime: new Date().toLocaleTimeString() } : visitor
    );
    setVisitors(updatedVisitors);
    // Update localStorage
    const allVisitors = JSON.parse(localStorage.getItem('visitors')) || [];
    const updatedAllVisitors = allVisitors.map(visitor => 
      visitor.id === visitorId ? { ...visitor, status: 'Out', checkOutTime: new Date().toLocaleTimeString() } : visitor
    );
    localStorage.setItem('visitors', JSON.stringify(updatedAllVisitors));
  };

  // Filter visitors based on search term
  const filteredVisitors = visitors.filter(visitor => 
    visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.mobile.includes(searchTerm) ||
    visitor.passNumber?.toString().includes(searchTerm)
  );

  // Calculate pagination
  const indexOfLastVisitor = currentPage * rowsPerPage;
  const indexOfFirstVisitor = indexOfLastVisitor - rowsPerPage;
  const currentVisitors = filteredVisitors.slice(indexOfFirstVisitor, indexOfLastVisitor);

  return (
    <div className="visitor-container">
      <div className="visitor-header">
        <h1>Visitors On Site</h1>
        <button className="add-visitor-btn" onClick={handleAddVisitor}>
          + New Visitor
        </button>
      </div>
      
      <div className="registered-vehicles">
        <h2>Current Visitors</h2>
        <div className="vehicle-types">
          <button className="vehicle-type-btn" onClick={() => navigate("/")}>All Visitors</button>
          <button className="vehicle-type-btn active">Currently In</button>
          <button className="vehicle-type-btn" onClick={() => navigate("/visitor-out")}>Checked Out</button>
        </div>
      </div>
      
      <div className="divider"></div>
      
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search by name, phone, or pass number..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="visitor-types">
          <span>Total On Site: {visitors.length}</span>
        </div>
      </div>
      
      <div className="action-header">
        <div className="action-title">ACTIONS</div>
        <div className="header-row1">
          <div>SR</div>
          <div>VISITOR NAME</div>
          <div>CONTACT NO.</div>
          <div>HOST</div>
          <div>PURPOSE</div>
          <div>PASS NO.</div>
          <div>CHECK-IN TIME</div>
          <div>DURATION</div>
          <div>STATUS</div>
          <div>ACTION</div>
        </div>
      </div>
      
      <div className="visitor-list">
        {currentVisitors.length > 0 ? (
          currentVisitors.map((visitor, index) => (
            <div key={visitor.id} className="visitor-row">
              <div className="visitor-cell">{indexOfFirstVisitor + index + 1}</div>
              <div className="visitor-cell">{visitor.name}</div>
              <div className="visitor-cell">{visitor.mobile}</div>
              <div className="visitor-cell">{visitor.host || 'N/A'}</div>
              <div className="visitor-cell">{visitor.purpose}</div>
              <div className="visitor-cell">{visitor.passNumber || 'N/A'}</div>
              <div className="visitor-cell">{visitor.time || new Date().toLocaleTimeString()}</div>
              <div className="visitor-cell">
                {Math.floor((new Date() - new Date(visitor.date)) / (1000 * 60))} mins
              </div>
              <div className="visitor-cell">
                <span className={`status-badge ${visitor.status === 'In' ? 'status-in' : 'status-pending'}`}>
                  {visitor.status}
                </span>
              </div>
              <div className="visitor-cell action-cell">
                <button 
                  className="checkout-btn"
                  onClick={() => handleCheckOut(visitor.id)}
                >
                  Check Out
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-visitors">
            No visitors currently on site
          </div>
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
          {`${indexOfFirstVisitor + 1}-${Math.min(indexOfLastVisitor, filteredVisitors.length)} of ${filteredVisitors.length}`}
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
            disabled={currentPage * rowsPerPage >= filteredVisitors.length}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisitorIn;