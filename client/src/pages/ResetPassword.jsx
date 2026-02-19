import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import './AuthModern.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords don't match!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
      toast.success('Password reset successfully!');
    }, 2000);
  };

  return (
    <div className="auth-immersive-container">
      <div className="auth-glass-panel">
        {!isSuccess ? (
          <>
            <div className="auth-header">
              <div className="auth-logo-icon">
                <Lock size={32} color="#22c55e" />
              </div>
              <h1>Reset Password</h1>
              <p>Create a new strong password for your account.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-input-group">
                <label>New Password</label>
                <div className="auth-input-wrapper">
                  <Lock className="auth-input-icon" size={20} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label>Confirm New Password</label>
                <div className="auth-input-wrapper">
                  <Lock className="auth-input-icon" size={20} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        ) : (
          <div className="auth-success-state">
            <div className="success-icon-badge">
              <CheckCircle2 size={40} color="#22c55e" />
            </div>
            <h2>Password Reset!</h2>
            <p>Your password has been successfully updated. You can now log in with your new credentials.</p>
            <button className="auth-submit-btn" onClick={() => navigate('/login')}>
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
