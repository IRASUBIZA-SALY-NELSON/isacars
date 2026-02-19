import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, HelpCircle, MessageSquare,
  Phone, Mail, ChevronRight, ChevronDown,
  Car, CreditCard, Shield, User,
  FileText, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import './HelpSupport.css';

const HelpSupport = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    { id: 'rides', name: 'Rides & Pricing', icon: <Car size={24} /> },
    { id: 'payment', name: 'Payment', icon: <CreditCard size={24} /> },
    { id: 'safety', name: 'Safety', icon: <Shield size={24} /> },
    { id: 'account', name: 'Account', icon: <User size={24} /> },
  ];

  const faqs = [
    {
      id: 1,
      question: "How do I request a ride?",
      answer: "Open the app, enter your destination in the 'Where to?' box, select your preferred vehicle type, and tap 'Request Ride'. You'll be connected with the nearest available driver."
    },
    {
      id: 2,
      question: "What should I do if I forgot an item in a ride?",
      answer: "Go to your Ride History, select the specific trip, and use the 'Report an Issue' button. We'll help you coordinate with the driver to retrieve your item."
    },
    {
      id: 3,
      question: "How are fares calculated?",
      answer: "Fares are based on a base rate plus the estimated distance and duration of the trip. High demand periods may apply dynamic pricing, which will always be shown upfront."
    },
    {
      id: 4,
      question: "Can I schedule a ride in advance?",
      answer: "Currently, all rides are on-demand. We are working on a scheduling feature that will be available in future updates."
    }
  ];

  const handleCategoryClick = (cat) => {
    toast.success(`${cat} topics coming soon!`);
  };

  const handleContact = (type) => {
    toast(`Opening ${type} support...`, { icon: '🎧' });
  };

  return (
    <div className="help-page">
      <header className="help-header">
        <button className="back-btn" onClick={() => navigate('/passenger/dashboard')}>
          <ArrowLeft size={20} />
        </button>
        <h1>Help & Support</h1>
      </header>

      <div className="help-container">
        {/* Search Header */}
        <section className="hero-help-section">
          <h2>How can we help?</h2>
          <div className="search-bar-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="help-search-input"
              placeholder="Search for articles, topics..."
            />
          </div>
        </section>

        {/* Categories */}
        <div className="category-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card" onClick={() => handleCategoryClick(cat.name)}>
              <div className="cat-icon-wrapper">
                {cat.icon}
              </div>
              <h3>{cat.name}</h3>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <h2 className="section-title"><HelpCircle size={20} color="#22c55e" /> Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq) => (
            <div key={faq.id} className="faq-item">
              <button
                className="faq-question"
                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
              >
                <span>{faq.question}</span>
                {openFaq === faq.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </button>
              {openFaq === faq.id && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Support Options */}
        <div className="support-footer">
          <h3>Still need help?</h3>
          <p>Our dedicated support team is available 24/7 to assist you with any inquiries.</p>
          <div className="contact-options">
            <button className="btn-contact" onClick={() => handleContact('Chat')}>
              <MessageSquare size={24} />
              <span>Live Chat</span>
            </button>
            <button className="btn-contact" onClick={() => handleContact('Call')}>
              <Phone size={24} />
              <span>Call Us</span>
            </button>
            <button className="btn-contact" onClick={() => handleContact('Email')}>
              <Mail size={24} />
              <span>Email Support</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HelpSupport;
