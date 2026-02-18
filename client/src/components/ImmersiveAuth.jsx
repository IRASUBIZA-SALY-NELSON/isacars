import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Car, Check, Shield, User, Zap, Sparkles, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ImmersiveAuth.css';

const ImmersiveAuth = () => {
  const { login, loginWithGoogle, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const inputRef = useRef(null);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Auto-rotate features
    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearInterval(featureInterval);
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register({ ...formData, role: 'passenger' });
      }

      if (result.success) {
        toast.success(isLogin ? 'Welcome back to Nova Transport!' : 'Welcome to Nova Transport!');
        // Redirect based on role
        navigate(`/${result.user.role}/dashboard`);
      } else {
        toast.error(result.message || 'Authentication failed');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    try {
      const { gapi } = await loadGoogleScript();

      await gapi.auth2.init({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'email profile'
      });

      const GoogleAuth = gapi.auth2.getAuthInstance();
      const googleUser = await GoogleAuth.signIn({
        prompt: 'select_account'
      });

      const profile = googleUser.getBasicProfile();
      const authResponse = googleUser.getAuthResponse();

      const result = await loginWithGoogle({
        token: authResponse.id_token,
        email: profile.getEmail(),
        name: profile.getName(),
        picture: profile.getImageUrl()
      });

      if (result.success) {
        toast.success('Welcome to Nova Transport!');
        navigate(`/${result.user.role}/dashboard`);
      } else {
        toast.error(result.message || 'Google authentication failed');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error('Google authentication failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const loadGoogleScript = () => {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve(window);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('auth2', () => {
          resolve(window);
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({ email: '', password: '' });
  };

  const features = [  ];

  return (
    <div className="immersive-auth-container">
      {/* Dynamic Background */}
      <div className="auth-background">
        <div className="gradient-overlay"></div>
      </div>

      {/* Main Content */}
      <div className="auth-content">
        {/* Header */}
        <div className="auth-header">
          <div className="logo-section">
            <div className="logo-icon">
              <img src="/logo.png" alt="Nova Transport Logo" className="logo-img" />
            </div>
            <h1 className="logo-text">Nova Transport</h1>
          </div>
          <p className="auth-subtitle">
            {isLogin ? '' : 'Start your journey with luxury'}
          </p>
        </div>

        {/* Feature Showcase */}
        <div className="feature-showcase">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-item ${activeFeature === index ? 'active' : ''}`}
            >
              <feature.icon size={20} />
              <div className="feature-text">
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Auth Form */}
        <div className="auth-form-section">
          {/* Google OAuth */}
          <button
            className="google-auth-btn"
            onClick={handleGoogleAuth}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>{isLogin ? 'Continue with Google' : 'Sign up with Google'}</span>
              </>
            )}
          </button>

          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">OR</span>
            <div className="divider-line"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" />
                <input
                  ref={inputRef}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`auth-input ${errors.email ? 'error' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`auth-input ${errors.password ? 'error' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  {isLogin ? 'Start Your Journey' : 'Begin Your Adventure'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="auth-toggle">
            <span className="toggle-text">
              {isLogin ? "New to Nova Transport?" : "Already have an account?"}
            </span>
            <button
              onClick={toggleMode}
              className="toggle-btn"
              disabled={isLoading}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="trust-badges">
          <div className="badge">
            <Shield size={16} />
            <span>Secure</span>
          </div>
          <div className="badge">
            <User size={16} />
            <span>24/7 Support</span>
          </div>
          <div className="badge">
            <Sparkles size={16} />
            <span>Premium</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveAuth;
