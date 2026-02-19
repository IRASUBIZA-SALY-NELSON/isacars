import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ShieldAlert, Share2, Users,
  PhoneCall, ShieldCheck, ChevronRight,
  MapPin, Plus, HeartPulse, Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import './SafetyCenter.css';

const SafetyCenter = () => {
  const navigate = useNavigate();

  const handleSOS = () => {
    toast.error('Emergency services and your trusted contacts are being notified!', {
      duration: 5000,
      icon: '🚨',
    });
  };

  const handleToolClick = (toolName) => {
    toast.success(`${toolName} feature is ready!`);
  };

  return (
    <div className="safety-page">
      <header className="safety-header">
        <button className="back-btn" onClick={() => navigate('/passenger/dashboard')}>
          <ArrowLeft size={20} />
        </button>
        <h1>Safety Center</h1>
      </header>

      <div className="safety-container">
        {/* SOS Banner */}
        <section className="sos-banner">
          <div className="sos-icon-wrapper">
            <HeartPulse size={40} />
          </div>
          <h2>Emergency SOS</h2>
          <p>Instantly notify emergency services and your trusted contacts if you feel unsafe.</p>
          <button className="btn-sos" onClick={handleSOS}>ACTIVATE SOS</button>
        </section>

        {/* Safety Tools */}
        <h2 className="section-title"><ShieldCheck size={20} color="#22c55e" /> Safety Toolkit</h2>
        <div className="safety-tools-grid">
          <div className="tool-card" onClick={() => handleToolClick('Share Trip')}>
            <div className="tool-icon">
              <Share2 size={24} />
            </div>
            <div className="tool-info">
              <h3>Share Trip Status</h3>
              <p>Let friends or family track your ride in real-time.</p>
            </div>
            <ChevronRight className="chevron" size={20} />
          </div>

          <div className="tool-card" onClick={() => handleToolClick('Emergency Numbers')}>
            <div className="tool-icon">
              <PhoneCall size={24} />
            </div>
            <div className="tool-info">
              <h3>Local Emergency Numbers</h3>
              <p>Quick access to police, ambulance, and fire services.</p>
            </div>
            <ChevronRight className="chevron" size={20} />
          </div>

          <div className="tool-card" onClick={() => handleToolClick('Privacy Settings')}>
            <div className="tool-icon">
               <MapPin size={24} />
            </div>
            <div className="tool-info">
              <h3>Location Privacy</h3>
              <p>Review how your location is shared during trips.</p>
            </div>
            <ChevronRight className="chevron" size={20} />
          </div>
        </div>

        {/* Trusted Contacts */}
        <h2 className="section-title"><Users size={20} color="#22c55e" /> Trusted Contacts</h2>
        <div className="contacts-list">
          <div className="contact-item">
            <div className="contact-avatar">MS</div>
            <div className="contact-info">
              <h4>Moses S.</h4>
              <p>Brother • +250 78x xxx xxx</p>
            </div>
            <ShieldAlert size={18} color="#ef4444" />
          </div>
          <div className="contact-item">
            <div className="contact-avatar">JK</div>
            <div className="contact-info">
              <h4>Julienne K.</h4>
              <p>Friend • +250 78x xxx xxx</p>
            </div>
            <ShieldAlert size={18} color="#ef4444" />
          </div>
          <button className="btn-add-contact" onClick={() => handleToolClick('Add Contact')}>
            <Plus size={18} />
            Add Trusted Contact
          </button>
        </div>

        {/* Safety Tips */}
        <h2 className="section-title"><Info size={20} color="#22c55e" /> Safety Guidelines</h2>
        <div className="tool-card" onClick={() => handleToolClick('Safety Tips')}>
          <div className="tool-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
            <ShieldCheck size={24} />
          </div>
          <div className="tool-info">
            <h3>How to stay safe</h3>
            <p>Our top guidelines for a safe and secure riding experience.</p>
          </div>
          <ChevronRight className="chevron" size={20} />
        </div>

      </div>
    </div>
  );
};

export default SafetyCenter;
