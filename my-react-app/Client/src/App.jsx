import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Visitor from './visitor';
import NewVisitor from './NewVisitor';
import Staff from './staff';
import NewStaff from './Newstaff';
import VisitorIn from './Pages/VisitorIn';
import VisitorOut from './Pages/VisitorOut';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Visitor />} />
        <Route path="/new-visitor" element={<NewVisitor />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/new-staff" element={<NewStaff />} />
        <Route path="/visitor-in" element={<VisitorIn />} />
        <Route path="/visitor-out" element={<VisitorOut />} />
      </Routes>
    </Router>
  );
}

export default App;