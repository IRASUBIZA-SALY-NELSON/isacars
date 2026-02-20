import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  ArrowLeft, ShieldAlert, Share2, Users,
  PhoneCall, ShieldCheck, ChevronRight,
  MapPin, Plus, HeartPulse, Info, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import './SafetyCenter.css';

const SafetyCenter = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const [loading, setLoading] = useState(false);

  const handleSOS = async () => {
    toast.loading('Activating emergency protocol...', { duration: 2000 });
    try {
      // In a real app, this would notify emergency services and contacts
      // await api.post('/safety/sos');
      setTimeout(() => {
        toast.error('EMERGENCY SOS ACTIVATED. Help is on the way.', {
          duration: 8000,
          icon: '🚨',
          style: {
            background: '#ef4444',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '16px'
          }
        });
      }, 2000);
    } catch (error) {
      toast.error('Failed to trigger SOS. Please call emergency services directly.');
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/trusted-contacts', newContact);
      updateUser(response.data.user);
      setShowAddContact(false);
      setNewContact({ name: '', phone: '', relationship: '' });
      toast.success('Trusted contact added successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add contact');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveContact = async (contactId) => {
    try {
      const response = await api.delete(`/auth/trusted-contacts/${contactId}`);
      updateUser(response.data.user);
      toast.success('Contact removed');
    } catch (error) {
      toast.error('Failed to remove contact');
    }
  };

  const handleToolClick = (toolName, icon = '🛡️') => {
    if (toolName === 'Share Trip') {
      toast.success('Live tracking link shared with trusted contacts!', { icon: '🔗' });
    } else if (toolName === 'Emergency Numbers') {
      toast('Opening local emergency directory...', { icon: '📞' });
    } else if (toolName === 'Add Contact') {
      setShowAddContact(true);
    } else {
      toast.success(`${toolName} feature activated!`, { icon });
    }
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
          <div className="tool-card" onClick={() => handleToolClick('Share Trip', '📤')}>
            <div className="tool-icon">
              <Share2 size={24} />
            </div>
            <div className="tool-info">
              <h3>Share Trip Status</h3>
              <p>Let friends or family track your ride in real-time.</p>
            </div>
            <ChevronRight className="chevron" size={20} />
          </div>

          <div className="tool-card" onClick={() => handleToolClick('Emergency Numbers', '🚑')}>
            <div className="tool-icon">
              <PhoneCall size={24} />
            </div>
            <div className="tool-info">
              <h3>Local Emergency Numbers</h3>
              <p>Quick access to police, ambulance, and fire services.</p>
            </div>
            <ChevronRight className="chevron" size={20} />
          </div>

          <div className="tool-card" onClick={() => handleToolClick('Privacy Settings', '🔒')}>
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
          {user?.trustedContacts?.map((contact) => (
            <div key={contact._id} className="contact-item">
              <div className="contact-avatar">{contact.name.substring(0, 2).toUpperCase()}</div>
              <div className="contact-info">
                <h4>{contact.name}</h4>
                <p>{contact.relationship} • {contact.phone}</p>
              </div>
              <ShieldAlert
                size={18}
                color="#ef4444"
                style={{ cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); handleRemoveContact(contact._id); }}
              />
            </div>
          ))}

          {(!user?.trustedContacts || user.trustedContacts.length === 0) && (
            <p className="no-data-msg">No trusted contacts added yet.</p>
          )}

          <button className="btn-add-contact" onClick={() => setShowAddContact(true)}>
            <Plus size={18} />
            Add Trusted Contact
          </button>
        </div>

        {/* Add Contact Modal */}
        {showAddContact && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <h3>Add Trusted Contact</h3>
                <button onClick={() => setShowAddContact(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleAddContact}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    required
                    value={newContact.name}
                    onChange={e => setNewContact({...newContact, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newContact.phone}
                    onChange={e => setNewContact({...newContact, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Relationship</label>
                  <input
                    type="text"
                    placeholder="e.g. Sister"
                    value={newContact.relationship}
                    onChange={e => setNewContact({...newContact, relationship: e.target.value})}
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Contact'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Safety Tips */}
        <h2 className="section-title"><Info size={20} color="#22c55e" /> Safety Guidelines</h2>
        <div className="tool-card" onClick={() => handleToolClick('Safety Tips', '📚')}>
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
