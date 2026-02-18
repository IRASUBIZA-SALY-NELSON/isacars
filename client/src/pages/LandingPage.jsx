import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, MapPin, CreditCard, Star, Shield, Clock, Phone, Mail, X, MessageSquare, ArrowRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedCar, setSelectedCar] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isMessageView, setIsMessageView] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to a backend
    toast.success('You have successfully submitted your message!');
    setTimeout(() => {
      setIsContactModalOpen(false);
      setIsMessageView(false);
    }, 2000);
  };

  const heroImages = [
    '/8a.jpg',
    '/alone.jpeg',
    '/car.jpeg',
    // '/taxi.jpeg',
    '/taxio.jpeg',
    '/image.jpeg',
    '/bg.jpeg',
    '/IMG-20251228-WA0128.jpg',
    '/IMG-20251228-WA0141.jpg',
    '/IMG-20251228-WA0146.jpg',
    '/IMG-20251228-WA0163.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const fleet = [
    {
      id: 1,
      name: 'Standard',
      image: '/IMG-20251228-WA0128.jpg',
      description: 'Affordable, everyday rides',
      details: 'Our most popular option. Fits up to 4 passengers comfortably. Perfect for daily commutes and errands.',
      stats: { passengers: 4, bags: 2, type: 'Sedan' }
    },
    {
      id: 2,
      name: 'Luxury',
      image: '/IMG-20251228-WA0141.jpg',
      description: 'Premium rides with professional drivers',
      details: 'Luxury at its finest. Enjoy a high-end vehicle and professional driver for special occasions or business travel.',
      stats: { passengers: 4, bags: 3, type: 'Luxury' }
    },
    {
      id: 3,
      name: 'XL',
      image: '/IMG-20251228-WA0146.jpg',
      description: 'Larger rides for groups & luggage',
      details: 'Need more space? SUVs and Minivans for up to 6 people. Great for airport trips or family outings.',
      stats: { passengers: 6, bags: 5, type: 'SUV/Van' }
    },
    {
      id: 4,
      name: 'Eco',
      image: '/IMG-20251228-WA0163.jpg',
      description: 'Sustainable electric rides',
      details: 'Reduce your carbon footprint. Ride in a hybrid or fully electric vehicle without compromising on comfort.',
      stats: { passengers: 4, bags: 2, type: 'Electric' }
    },
    {
      id: 5,
      name: 'Elite',
      image: '/car.jpeg',
      description: 'Elite cars for ultimate comfort',
      details: 'Our top-tier luxury service. Exceptional vehicles for those who want the absolute best experience.',
      stats: { passengers: 4, bags: 3, type: 'Exclusive' }
    },
    {
      id: 6,
      name: 'Premium',
      image: '/image.jpeg',
      description: 'Top-tier cars with extra legroom',
      details: 'Travel in style and comfort with our premium fleet. Extra space and superior features for a more relaxed journey.',
      stats: { passengers: 4, bags: 2, type: 'Premium' }
    },
    {
      id: 7,
      name: 'Private',
      image: '/alone.jpeg',
      description: 'Discrete rides for total privacy',
      details: 'A specialized service for those who prioritize privacy and discretion. Unmarked high-quality vehicles.',
      stats: { passengers: 3, bags: 2, type: 'Discrete' }
    },
    {
      id: 8,
      name: 'Select',
      image: '/8a.jpg',
      description: 'Highly rated drivers and newer cars',
      details: 'A step up from our Standard service. Enjoy rides in newer vehicles with our top-rated drivers for a consistently great experience.',
      stats: { passengers: 4, bags: 2, type: 'Select' }
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Your Ride, <span className="gradient-text">On Demand</span>
            </h1>
            <p className="hero-subtitle">
              Book a ride in seconds. Safe, reliable, and affordable transportation at your fingertips.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
                Get Started
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
                Sign In
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-card hero-car-card">
              {heroImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Premium Ride ${index + 1}`}
                  className={`hero-car-image ${index === currentImageIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Showcase Section */}
      <section className="fleet-section">
        <div className="container">
          <h2 className="section-title">Experience Our Premium Fleet</h2>
          <p className="section-subtitle">Choose the perfect ride for any occasion. Select a car to view details.</p>

          {/* First Row - Left to Right */}
          <div className="fleet-scroll-container">
            <div className={`fleet-scroll-track`} >
              {[...fleet.slice(0, 3), ...fleet.slice(0, 3), ...fleet.slice(0, 3)].map((car, index) => (
                <div
                  key={`row1-${index}`}
                  className="fleet-card-scroll"
                  onClick={() => {
                    setSelectedCar(car);
                    // setIsPaused(true); // Removed as automatic scrolling is removed
                  }}
                >
                  <div className="fleet-image-wrapper">
                    <img src={car.image} alt={car.name} className="fleet-image" />
                  </div>
                  <div className="fleet-info">
                    <h3>{car.name}</h3>
                    <p>{car.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Second Row - Right to Left */}
          <div className="fleet-scroll-container" style={{ marginTop: '24px' }}>
            <div className={`fleet-scroll-track`} >
              {[...fleet.slice(3, 6), ...fleet.slice(3, 6), ...fleet.slice(3, 6)].map((car, index) => (
                <div
                  key={`row2-${index}`}
                  className="fleet-card-scroll"
                  onClick={() => {
                    setSelectedCar(car);
                    // setIsPaused(true); // Removed as automatic scrolling is removed
                  }}
                >
                  <div className="fleet-image-wrapper">
                    <img src={car.image} alt={car.name} className="fleet-image" />
                  </div>
                  <div className="fleet-info">
                    <h3>{car.name}</h3>
                    <p>{car.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Third Row - Left to Right */}
          <div className="fleet-scroll-container" style={{ marginTop: '24px' }}>
            <div className={`fleet-scroll-track`} >
              {[...fleet.slice(6, 8), ...fleet.slice(6, 8), ...fleet.slice(6, 8)].map((car, index) => (
                <div
                  key={`row3-${index}`}
                  className="fleet-card-scroll"
                  onClick={() => {
                    setSelectedCar(car);
                    // setIsPaused(true); // Removed as automatic scrolling is removed
                  }}
                >
                  <div className="fleet-image-wrapper">
                    <img src={car.image} alt={car.name} className="fleet-image" />
                  </div>
                  <div className="fleet-info">
                    <h3>{car.name}</h3>
                    <p>{car.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CSS Animations */}
          <style>{`
            .fleet-scroll-container {
              overflow-x: auto;
              overflow-y: hidden;
              width: 100%;
              position: relative;
              padding: 10px 0;
              cursor: grab;
              scroll-behavior: smooth;
            }

            .fleet-scroll-container:active {
              cursor: grabbing;
            }

            .fleet-scroll-container::-webkit-scrollbar {
              height: 8px;
            }

            .fleet-scroll-container::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 10px;
            }

            .fleet-scroll-container::-webkit-scrollbar-thumb {
              background: #22c55e;
              border-radius: 10px;
            }

            .fleet-scroll-container::-webkit-scrollbar-thumb:hover {
              background: #16a34a;
            }

            .fleet-scroll-track {
              display: flex;
              gap: 24px;
              width: fit-content;
            }

            .fleet-card-scroll {
              min-width: 300px;
              max-width: 300px;
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              cursor: pointer;
              transition: transform 0.3s ease, box-shadow 0.3s ease;
              flex-shrink: 0;
            }

            .fleet-card-scroll:hover {
              transform: translateY(-8px);
              box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            }

            .fleet-card-scroll .fleet-image-wrapper {
              position: relative;
              width: 100%;
              height: 200px;
              overflow: hidden;
              background: #f8fafc;
            }

            .fleet-card-scroll .fleet-image {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .fleet-card-scroll .fleet-info {
              padding: 20px;
            }

            .fleet-card-scroll .fleet-info h3 {
              margin: 0 0 8px 0;
              font-size: 18px;
              font-weight: 700;
              color: #111827;
            }

            .fleet-card-scroll .fleet-info p {
              margin: 0;
              font-size: 14px;
              color: #6b7280;
              line-height: 1.5;
            }

            @keyframes scrollLeft {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-33.333%);
              }
            }

            @keyframes scrollRight {
              0% {
                transform: translateX(-33.333%);
              }
              100% {
                transform: translateX(0);
              }
            }
          `}</style>
        </div>
      </section>

      {/* Original Vehicle Types Section */}
      <section className="vehicles-section">
        <div className="container">
          <h2 className="section-title">Transparent Pricing</h2>
          <p className="section-subtitle">No hidden fees. Know what you pay.</p>

          <div className="vehicles-grid">
            {fleet.map((car) => (
              <div key={car.id} className="vehicle-card card">
                <div className="vehicle-image-small-container">
                    <img src={car.image} alt={car.name} className="vehicle-image-small" />
                </div>
                <h3>{car.name}</h3>
                <p className="vehicle-price">${(car.id * 0.5 + 1).toFixed(2)}/km</p>
                <p className="vehicle-capacity">
                  <Star size={14} fill="currentColor" style={{color: '#FFB800'}} />
                  <span>{car.stats.passengers} Seats available</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h1>Move Your World with <span>Nova Transport</span></h1>
            <p>Reliable, comfortable, and safe rides at your fingertips in Rwanda.</p>
            <button className="btn btn-accent btn-lg" onClick={() => navigate('/register')}>
              Sign Up Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <img src="/logo.png" alt="Nova Transport Logo" className="footer-logo-img" />
                <h3>Nova Transport</h3>
              </div>
              <p>Your trusted ride-hailing partner</p>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Safety</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Nova Transport. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Car Details Modal */}
      {selectedCar && (
        <div className="modal-overlay" onClick={() => {
          setSelectedCar(null);
          setIsPaused(false);
        }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => {
              setSelectedCar(null);
              setIsPaused(false);
            }}>&times;</button>
            <div className="modal-image-container">
               <img src={selectedCar.image} alt={selectedCar.name} className="modal-image" />
            </div>
            <div className="modal-body">
              <h2>{selectedCar.name}</h2>
              <p className="modal-desc">{selectedCar.details}</p>

              <div className="car-stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Passengers</span>
                  <span className="stat-value">👤 {selectedCar.stats.passengers}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Luggage</span>
                  <span className="stat-value">🧳 {selectedCar.stats.bags}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Class</span>
                  <span className="stat-value">✨ {selectedCar.stats.type}</span>
                </div>
              </div>

              <button className="btn btn-primary btn-block mt-4" onClick={() => {
                setSelectedCar(null);
                navigate('/register');
              }}>
                Book This Ride
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Contact Button */}
      <button
        className={`floating-contact-btn ${isContactModalOpen ? 'hidden' : ''}`}
        onClick={() => setIsContactModalOpen(true)}
      >
        <div className="btn-pulse"></div>
        <Phone size={24} />
      </button>

      {/* Contact Us Modal */}
      {isContactModalOpen && (
        <div className="contact-modal-overlay" onClick={() => {
          setIsContactModalOpen(false);
          setIsMessageView(false);
        }}>
          <div className="contact-modal-content" onClick={e => e.stopPropagation()}>
            <button className="contact-modal-close" onClick={() => {
              setIsContactModalOpen(false);
              setIsMessageView(false);
            }}>
              <X size={20} />
            </button>

            {!isMessageView ? (
              <>
                <div className="contact-modal-header">
                  <h2>Contact Us</h2>
                </div>
                <div className="contact-modal-body">
                  <a href="tel:+250781944664" className="contact-item-link">
                    <div className="contact-item">
                      <div className="contact-icon-wrapper call">
                        <Phone size={20} />
                      </div>
                      <div className="contact-text">
                        <span className="contact-label">Call us</span>
                        <span className="contact-value">+250 781 944 664</span>
                      </div>
                    </div>
                  </a>

                  <a href="mailto:info@novatransport.rw?subject=Inquiry about Nova Transport" className="contact-item-link">
                    <div className="contact-item">
                      <div className="contact-icon-wrapper email">
                        <Mail size={20} />
                      </div>
                      <div className="contact-text">
                        <span className="contact-label">Email Us</span>
                        <span className="contact-value">info@novatransport.rw</span>
                      </div>
                    </div>
                  </a>

                  <div className="contact-item">
                    <div className="contact-icon-wrapper location">
                      <MapPin size={20} />
                    </div>
                    <div className="contact-text">
                      <span className="contact-label">Visit us</span>
                      <span className="contact-value">Gisenyi, Rwanda</span>
                    </div>
                  </div>

                  <div className="contact-divider">
                    <span>or</span>
                  </div>

                  <button className="contact-submit-btn" onClick={() => setIsMessageView(true)}>
                    Send us a message <ArrowRight size={18} />
                  </button>
                </div>
                <div className="contact-modal-footer">
                  <span>Powered by SALES Team</span>
                </div>
              </>
            ) : (
              <>
                <div className="contact-modal-header">
                  <button className="back-btn" onClick={() => setIsMessageView(false)}>
                    ← Back
                  </button>
                  <h2>Send Message</h2>
                </div>
                <div className="contact-modal-body">
                  <form onSubmit={handleMessageSubmit} className="message-form">
                    <div className="form-group">
                      <label htmlFor="message">How can we help you?</label>
                      <textarea
                        id="message"
                        rows="4"
                        placeholder="Type your message here..."
                        required
                        className="message-textarea"
                      ></textarea>
                    </div>
                    <button type="submit" className="contact-submit-btn">
                      Send Message <ArrowRight size={18} />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default LandingPage;
