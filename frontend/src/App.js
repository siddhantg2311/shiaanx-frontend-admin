import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Enquiries from './pages/Enquiries';
import Orders from './pages/Orders';
import TrackOrder from './pages/TrackOrder';
import ViewDetails from './pages/ViewDetails';
import Users from './pages/Users';
import Vendors from './pages/Vendors';
import Analytics from './pages/Analytics';
import MakeEnquiry from './pages/MakeEnquiry';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/enquiries" element={<Enquiries />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/view-details" element={<ViewDetails />} />
        <Route path="/users" element={<Users />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/make-enquiry" element={<MakeEnquiry />} />
      </Routes>
    </Router>
  );
}

export default App;
