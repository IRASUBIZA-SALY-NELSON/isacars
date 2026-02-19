import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ShieldCheck, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import './AuthModern.css'; // Premium modern auth styles

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Reset link sent to your email!');
    }, 1500);
  };

  return (
    <div className="auth-immersive-container">
      <div className="auth-glass-panel">
        <button className="auth-back-btn" onClick={() => navigate('/login')}>
          <ArrowLeft size={20} />
        </button>

        <div className="auth-header">
          <div className="auth-logo-icon">
            <ShieldCheck size={32} color="#22c55e" />
          </div>
          <h1>Forgot Password?</h1>
          <p>Enter your email and we'll send you a link to reset your password.</p>
        </div>

        {!submitted ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label>Email Address</label>
              <div className="auth-input-wrapper">
                <Mail className="auth-input-icon" size={20} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="auth-success-state">
            <div className="success-icon-badge">
              <Mail size={40} color="#22c55e" />
            </div>
            <h2>Check your email</h2>
            <p>We've sent a password reset link to <strong>{email}</strong></p>
            <button className="auth-submit-btn" onClick={() => navigate('/login')}>
              Back to Login
            </button>
            <p className="auth-resend-text">
              Didn't receive the email? <span onClick={handleSubmit}>Click to resend</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
