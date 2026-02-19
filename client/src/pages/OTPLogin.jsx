import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowLeft, ShieldCheck, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import './AuthModern.css';

const OTPLogin = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef([]);

  const handleSendOTP = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      toast.success('OTP sent to your mobile!');
    }, 1500);
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      toast.error('Please enter full OTP code');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Login Successful!');
      navigate('/passenger/dashboard');
    }, 2000);
  };

  return (
    <div className="auth-immersive-container">
      <div className="auth-glass-panel">
        <button className="auth-back-btn" onClick={() => step === 1 ? navigate('/login') : setStep(1)}>
          <ArrowLeft size={20} />
        </button>

        <div className="auth-header">
          <div className="auth-logo-icon">
            <KeyRound size={32} color="#22c55e" />
          </div>
          <h1>{step === 1 ? 'Login with OTP' : 'Verify OTP'}</h1>
          <p>{step === 1 ? 'Enter your phone number to receive a verification code.' : `Enter the 6-digit code sent to ${phone}`}</p>
        </div>

        {step === 1 ? (
          <form className="auth-form" onSubmit={handleSendOTP}>
            <div className="auth-input-group">
              <label>Phone Number</label>
              <div className="auth-input-wrapper">
                <Phone className="auth-input-icon" size={20} />
                <input
                  type="tel"
                  placeholder="+250 78x xxx xxx"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleVerifyOTP}>
            <div className="otp-input-container">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => otpRefs.current[idx] = el}
                  type="text"
                  maxLength="1"
                  className="otp-digit-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  autoFocus={idx === 0}
                />
              ))}
            </div>
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <p className="auth-resend-text">
              Didn't receive the code? <span onClick={handleSendOTP}>Resend it</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default OTPLogin;
