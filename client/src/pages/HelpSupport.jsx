import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, HelpCircle, MessageSquare,
  Phone, Mail, ChevronRight, ChevronDown,
  Car, CreditCard, Shield, User,
  FileText, Clock, X, Send
} from 'lucide-react';
import toast from 'react-hot-toast';
import './HelpSupport.css';

const HelpSupport = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! 👋 How can I help you today?", sender: 'agent' }
  ]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showChat]);

  const categories = [
    {
      id: 'rides',
      name: 'Rides & Pricing',
      icon: <Car size={24} />,
      articles: [
        "How to request a ride",
        "Understanding base fares",
        "Reporting a long route",
        "Lost item in a vehicle",
        "Ride cancellation policy"
      ]
    },
    {
      id: 'payment',
      name: 'Payment',
      icon: <CreditCard size={24} />,
      articles: [
        "Add a new payment method",
        "Refund request status",
        "Understanding RWF conversion",
        "Changing default payment",
        "Receipt not received"
      ]
    },
    {
      id: 'safety',
      name: 'Safety',
      icon: <Shield size={24} />,
      articles: [
        "In-app emergency SOS",
        "Trusted contacts setup",
        "Driver verification process",
        "COVID-12 health safety",
        "Reporting safety incidents"
      ]
    },
    {
      id: 'account',
      name: 'Account',
      icon: <User size={24} />,
      articles: [
        "Update profile photo",
        "Change phone number",
        "Privacy and data settings",
        "Delete my account",
        "Two-factor authentication"
      ]
    },
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

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = { id: Date.now(), text: chatMessage, sender: 'user' };
    setMessages([...messages, userMsg]);
    setChatMessage('');

    // Simulated Agent Response
    setTimeout(() => {
      const agentMsg = {
        id: Date.now() + 1,
        text: "Thanks for your message! An agent will be with you in about 2 minutes. ⌛",
        sender: 'agent'
      };
      setMessages(prev => [...prev, agentMsg]);
    }, 1000);
  };

  const handleContact = (type) => {
    if (type === 'Chat') {
      setShowChat(true);
    } else if (type === 'Call') {
      window.location.href = 'tel:+250788000000';
      toast.success('Opening dialer...');
    } else {
      window.location.href = 'mailto:support@novatransport.rw';
      toast.success('Opening email client...');
    }
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        {/* Categories */}
        <div className="category-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card" onClick={() => setSelectedCategory(cat)}>
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
          {filteredFaqs.length > 0 ? filteredFaqs.map((faq) => (
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
          )) : (
            <div style={{padding: '30px', textAlign: 'center', color: '#64748b'}}>
              No results found for "{searchTerm}"
            </div>
          )}
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

      {/* Category Detail View */}
      {selectedCategory && (
        <div className="category-detail-overlay">
          <div className="cat-detail-header">
            <button className="back-btn" onClick={() => setSelectedCategory(null)}>
              <ArrowLeft size={20} />
            </button>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              {selectedCategory.icon}
              <h2 style={{margin:0, fontSize:'1.1rem'}}>{selectedCategory.name}</h2>
            </div>
          </div>
          <div className="cat-detail-body">
            <div className="article-list">
              {selectedCategory.articles.map((article, i) => (
                <div key={i} className="article-item" onClick={() => toast.success(`Article: ${article}`)}>
                  <h4>{article}</h4>
                  <ChevronRight size={18} color="#cbd5e1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Chat Modal */}
      {showChat && (
        <div className="chat-modal-overlay" onClick={() => setShowChat(false)}>
          <div className="chat-modal-card" onClick={e => e.stopPropagation()}>
            <div className="chat-header">
              <div className="chat-header-info">
                <img src="https://i.pravatar.cc/100?u=support" alt="Agent" className="agent-avatar" />
                <div>
                  <h4 style={{margin:0, fontSize:'0.95rem'}}>Nova Support</h4>
                  <span style={{fontSize:'0.75rem', opacity:0.8}}>Active Now</span>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}>
                <X size={20} />
              </button>
            </div>

            <div className="chat-body">
              {messages.map(msg => (
                <div key={msg.id} className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="chat-input"
                placeholder="Type your message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <button type="submit" className="btn-send">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpSupport;
