import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewVisitor.css';

const NewVisitor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'Guest',
    name: '',
    passNumber: '',
    parkingSlot: '',
    purpose: '',
    additionalVisitorName: '',
    mobile: '',
    origin: '',
    date: new Date().toISOString().split('T')[0],
    frequency: 'Once',
    skipApproval: false,
    photo: null
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [userEnteredOtp, setUserEnteredOtp] = useState('');
  const [mobileVerified, setMobileVerified] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateOtp = () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);
    setOtpSent(true);
    setMobileVerified(false);
    console.log(`OTP for ${formData.mobile}: ${generatedOtp}`);
    alert(`OTP sent to ${formData.mobile}: ${generatedOtp}`);
  };

  const verifyOtp = () => {
    if (userEnteredOtp === otp) {
      setMobileVerified(true);
      alert('Mobile number verified successfully!');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      
      const photoDataUrl = canvasRef.current.toDataURL('image/png');
      setCapturedPhoto(photoDataUrl);
      setFormData(prev => ({ ...prev, photo: photoDataUrl }));
      
      stopCamera();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
  
    
    if (!formData.photo) {
      alert('Please capture a photo of the visitor');
      return;
    }

    const newVisitor = {
      id: Date.now(),
      ...formData,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Pending',
      mobileVerified: true,
      verificationTimestamp: new Date().toISOString()
    };

    try {
      const existingVisitors = JSON.parse(localStorage.getItem('visitors')) || [];
      const updatedVisitors = [newVisitor, ...existingVisitors];
      localStorage.setItem('visitors', JSON.stringify(updatedVisitors));
      
      alert('Visitor added successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error saving visitor:', error);
      alert('Failed to save visitor. Please try again.');
    }
  };

  return (
    <div className="new-visitor-container">
      <h1>NEW VISITOR</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Visitor Type:</h2>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="type"
                value="Guest"
                checked={formData.type === 'Guest'}
                onChange={handleChange}
              />
              Guest
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="Support Staff"
                checked={formData.type === 'Support Staff'}
                onChange={handleChange}
              />
              Support Staff
            </label>
          </div>
          
          <div className="sub-section">
            <h3>Writing Frequency:</h3>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="frequency"
                  value="Once"
                  checked={formData.frequency === 'Once'}
                  onChange={handleChange}
                />
                Once
              </label>
              <label>
                <input
                  type="radio"
                  name="frequency"
                  value="Frequently"
                  checked={formData.frequency === 'Frequently'}
                  onChange={handleChange}
                />
                Frequently
              </label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Visitor Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Visitor Name"
            required
          />
        </div>

        <div className="form-group">
          <label>Visitor Photo:</label>
          <div className="photo-capture-container">
            {capturedPhoto ? (
              <div className="photo-preview">
                <img src={capturedPhoto} alt="Captured visitor" />
                <button 
                  type="button" 
                  className="retake-btn"
                  onClick={() => {
                    setCapturedPhoto(null);
                    setFormData(prev => ({ ...prev, photo: null }));
                  }}
                >
                  Retake Photo
                </button>
              </div>
            ) : cameraActive ? (
              <div className="camera-active">
                <video ref={videoRef} autoPlay playsInline className="camera-feed"></video>
                <button 
                  type="button" 
                  className="capture-btn"
                  onClick={capturePhoto}
                >
                  Capture Photo
                </button>
                <button 
                  type="button" 
                  className="cancel-camera-btn"
                  onClick={stopCamera}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                type="button" 
                className="start-camera-btn"
                onClick={startCamera}
              >
                Take Photo
              </button>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
          </div>
        </div>

        <div className="form-group">
          <label>Pass Number:</label>
          <input
            type="text"
            name="passNumber"
            value={formData.passNumber}
            onChange={handleChange}
            placeholder="Enter Pass number"
          />
        </div>

        <div className="form-group">
          <label>Select parking Slot:</label>
          <select
            name="parkingSlot"
            value={formData.parkingSlot}
            onChange={handleChange}
          >
            <option value="">Select Slot</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
          </select>
        </div>

        <div className="form-group">
          <label>Visit Purpose:</label>
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
          >
            <option value="">Select Purpose</option>
            <option value="Meeting">Meeting</option>
            <option value="Delivery">Delivery</option>
            <option value="Personal">Personal</option>
            <option value="Service">Service</option>
          </select>
        </div>

        <div className="form-section">
          <h2>Additional Visitor</h2>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="additionalVisitorName"
              value={formData.additionalVisitorName}
              onChange={handleChange}
              placeholder="Name"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Mobile Number:</label>
          <div className="mobile-verification-container">
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter Mobile Number"
              required
              disabled={otpSent}
              pattern="[0-9]{10}"
              title="Please enter a 10-digit mobile number"
            />
            {!otpSent && formData.mobile.length === 10 && (
              <button 
                type="button" 
                className="send-otp-btn"
                onClick={generateOtp}
              >
                Send OTP
              </button>
            )}
          </div>
          
          {otpSent && !mobileVerified && (
            <div className="otp-verification-container">
              <input
                type="text"
                value={userEnteredOtp}
                onChange={(e) => setUserEnteredOtp(e.target.value)}
                placeholder="Enter OTP"
                maxLength="6"
                pattern="[0-9]{6}"
                title="Please enter 6-digit OTP"
              />
              <button 
                type="button" 
                className="verify-otp-btn"
                onClick={verifyOtp}
              >
                Verify OTP
              </button>
            </div>
          )}
          
          {mobileVerified && (
            <div className="verification-success">
              <span className="verified-badge">✓ Verified</span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Coming from:</label>
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            placeholder="Enter Origin"
          />
        </div>

        <div className="form-group">
          <label>Expected Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="skipApproval"
              checked={formData.skipApproval}
              onChange={handleChange}
            />
            Skip Host Approval (Goods Inwards)
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/visitor')}>
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            onClick={() => navigate('/')}
          >
            Add Visitor
          </button>
        </div>
      </form>

      <footer className="footer">
        Copyright © 2024 DigitalVisa Tech Wizards' Private Limited. All rights reserved.
      </footer>
    </div>
  );
};

export default NewVisitor;