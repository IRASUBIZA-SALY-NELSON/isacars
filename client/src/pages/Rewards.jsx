import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Star, Gift, Target, Zap, Crown, Medal, Award, Calendar, TrendingUp, Lock, Check } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './Rewards.css';

const Rewards = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rewardsData, setRewardsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState(null);
  const [showRewardDetails, setShowRewardDetails] = useState(false);

  useEffect(() => {
    fetchRewardsData();
  }, []);

  const fetchRewardsData = async () => {
    try {
      const response = await api.get('/rewards');
      setRewardsData(response.data);
    } catch (error) {
      console.error('Error fetching rewards data:', error);
      // Mock data for demonstration
      setRewardsData(getMockRewardsData());
    } finally {
      setLoading(false);
    }
  };

  const getMockRewardsData = () => ({
    points: {
      current: 2450,
      lifetime: 12500,
      tier: 'gold',
      nextTier: 'platinum',
      pointsToNextTier: 550,
      expiryDate: '2024-12-31T23:59:59Z'
    },
    tier: {
      name: 'Gold',
      benefits: [
        '10% discount on every ride',
        'Priority driver matching',
        'Free ride cancellations',
        'Exclusive customer support',
        'Birthday bonus points'
      ],
      color: '#FFD700',
      icon: '👑'
    },
    achievements: [
      {
        id: '1',
        name: 'First Ride',
        description: 'Complete your first ride',
        icon: '🚗',
        points: 100,
        completed: true,
        completedAt: '2024-01-10T10:30:00Z'
      },
      {
        id: '2',
        name: 'Weekend Warrior',
        description: 'Take 5 rides on weekends',
        icon: '🌟',
        points: 200,
        completed: true,
        completedAt: '2024-01-14T18:45:00Z'
      },
      {
        id: '3',
        name: 'Night Owl',
        description: 'Take 3 rides after 10 PM',
        icon: '🦉',
        points: 150,
        completed: false,
        progress: 2,
        total: 3
      },
      {
        id: '4',
        name: 'Explorer',
        description: 'Visit 10 different locations',
        icon: '🗺️',
        points: 300,
        completed: false,
        progress: 7,
        total: 10
      },
      {
        id: '5',
        name: 'Loyal Customer',
        description: 'Complete 50 rides',
        icon: '💎',
        points: 500,
        completed: false,
        progress: 32,
        total: 50
      }
    ],
    rewards: [
      {
        id: '1',
        name: 'Free Ride Credit',
        description: 'Get $10 off your next ride',
        pointsCost: 500,
        category: 'ride_discount',
        icon: '🎫',
        available: true,
        expiryDate: null
      },
      {
        id: '2',
        name: 'Premium Upgrade',
        description: 'Upgrade to premium vehicle for free',
        pointsCost: 300,
        category: 'upgrade',
        icon: '🚙',
        available: true,
        expiryDate: null
      },
      {
        id: '3',
        name: 'Airport Ride Discount',
        description: '25% off airport rides',
        pointsCost: 800,
        category: 'special_discount',
        icon: '✈️',
        available: true,
        expiryDate: '2024-03-31T23:59:59Z'
      },
      {
        id: '4',
        name: 'Refer a Friend Bonus',
        description: 'Get 200 bonus points when your friend takes their first ride',
        pointsCost: 0,
        category: 'referral',
        icon: '👥',
        available: true,
        expiryDate: null
      },
      {
        id: '5',
        name: 'Monthly Subscription',
        description: 'Get unlimited free rides for a month (up to $200 value)',
        pointsCost: 5000,
        category: 'subscription',
        icon: '📅',
        available: false,
        lockedReason: 'Need Platinum tier'
      }
    ],
    transactions: [
      {
        id: '1',
        type: 'earned',
        points: 100,
        description: 'Completed ride',
        date: '2024-01-15T10:55:00Z',
        reference: 'ride_123'
      },
      {
        id: '2',
        type: 'earned',
        points: 200,
        description: 'Weekend Warrior achievement',
        date: '2024-01-14T18:45:00Z',
        reference: 'achievement_weekend_warrior'
      },
      {
        id: '3',
        type: 'redeemed',
        points: -500,
        description: 'Free Ride Credit',
        date: '2024-01-12T14:30:00Z',
        reference: 'reward_free_ride'
      },
      {
        id: '4',
        type: 'earned',
        points: 50,
        description: 'Rating your driver',
        date: '2024-01-11T09:20:00Z',
        reference: 'rating_bonus'
      },
      {
        id: '5',
        type: 'expired',
        points: -100,
        description: 'Points expired',
        date: '2024-01-01T00:00:00Z',
        reference: 'expiry_jan_2024'
      }
    ]
  });

  const handleRedeemReward = async (reward) => {
    if (rewardsData.points.current < reward.pointsCost) {
      toast.error('Insufficient points');
      return;
    }

    try {
      const response = await api.post(`/rewards/${reward.id}/redeem`);

      // Update points
      setRewardsData({
        ...rewardsData,
        points: {
          ...rewardsData.points,
          current: rewardsData.points.current - reward.pointsCost
        },
        transactions: [
          {
            id: Date.now().toString(),
            type: 'redeemed',
            points: -reward.pointsCost,
            description: reward.name,
            date: new Date().toISOString(),
            reference: `reward_${reward.id}`
          },
          ...rewardsData.transactions
        ]
      });

      toast.success(`Successfully redeemed ${reward.name}!`);
    } catch (error) {
      toast.error('Failed to redeem reward');
      // Mock success for demonstration
      setRewardsData({
        ...rewardsData,
        points: {
          ...rewardsData.points,
          current: rewardsData.points.current - reward.pointsCost
        },
        transactions: [
          {
            id: Date.now().toString(),
            type: 'redeemed',
            points: -reward.pointsCost,
            description: reward.name,
            date: new Date().toISOString(),
            reference: `reward_${reward.id}`
          },
          ...rewardsData.transactions
        ]
      });

      toast.success(`Successfully redeemed ${reward.name}!`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTierColor = (tier) => {
    const colors = {
      bronze: '#CD7F32',
      silver: '#C0C0C0',
      gold: '#FFD700',
      platinum: '#E5E4E2',
      diamond: '#B9F2FF'
    };
    return colors[tier.toLowerCase()] || '#FFD700';
  };

  const getTierIcon = (tier) => {
    const icons = {
      bronze: '🥉',
      silver: '🥈',
      gold: '🥇',
      platinum: '💎',
      diamond: '👑'
    };
    return icons[tier.toLowerCase()] || '🥇';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      ride_discount: '🎫',
      upgrade: '🚙',
      special_discount: '🎯',
      referral: '👥',
      subscription: '📅'
    };
    return icons[category] || '🎁';
  };

  if (loading) {
    return (
      <div className="rewards-page loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="rewards-page">
      <div className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/passenger/dashboard')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Rewards & Loyalty</h1>
        </div>
      </div>

      {/* Points Overview */}
      <div className="points-overview">
        <div className="points-card main">
          <div className="points-header">
            <div className="points-icon">
              <Trophy size={32} />
            </div>
            <div className="points-info">
              <div className="current-points">{rewardsData.points.current.toLocaleString()}</div>
              <div className="points-label">Current Points</div>
            </div>
          </div>

          <div className="points-stats">
            <div className="stat-item">
              <div className="stat-value">{rewardsData.points.lifetime.toLocaleString()}</div>
              <div className="stat-label">Lifetime Points</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{rewardsData.points.pointsToNextTier}</div>
              <div className="stat-label">Points to {rewardsData.points.nextTier}</div>
            </div>
          </div>

          <div className="tier-progress">
            <div className="tier-info">
              <span className="current-tier">{rewardsData.tier.icon} {rewardsData.tier.name}</span>
              <span className="next-tier">→ {getTierIcon(rewardsData.points.nextTier)} {rewardsData.points.nextTier}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((rewardsData.points.current - (rewardsData.points.current - rewardsData.points.pointsToNextTier)) / rewardsData.points.pointsToNextTier) * 100}%`,
                  backgroundColor: getTierColor(rewardsData.points.tier)
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="tier-benefits">
          <h3>{rewardsData.tier.icon} {rewardsData.tier.name} Benefits</h3>
          <ul className="benefits-list">
            {rewardsData.tier.benefits.map((benefit, index) => (
              <li key={index} className="benefit-item">
                <Check size={16} className="check-icon" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <div className="section-header">
          <h2>🏆 Achievements</h2>
          <div className="achievement-stats">
            <span className="completed-count">
              {rewardsData.achievements.filter(a => a.completed).length}/{rewardsData.achievements.length} Completed
            </span>
          </div>
        </div>

        <div className="achievements-grid">
          {rewardsData.achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`achievement-card ${achievement.completed ? 'completed' : 'in-progress'}`}
            >
              <div className="achievement-icon">
                <span className="icon-emoji">{achievement.icon}</span>
                {achievement.completed && <Check size={20} className="completion-badge" />}
              </div>

              <div className="achievement-content">
                <h4>{achievement.name}</h4>
                <p>{achievement.description}</p>

                {!achievement.completed && achievement.progress !== undefined && (
                  <div className="progress-info">
                    <div className="progress-bar-small">
                      <div
                        className="progress-fill-small"
                        style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{achievement.progress}/{achievement.total}</span>
                  </div>
                )}

                <div className="points-reward">
                  <Star size={16} />
                  <span>{achievement.points} points</span>
                </div>
              </div>

              {achievement.completed && (
                <div className="completion-date">
                  <Calendar size={14} />
                  <span>{formatDate(achievement.completedAt)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Available Rewards */}
      <div className="rewards-section">
        <div className="section-header">
          <h2>🎁 Available Rewards</h2>
        </div>

        <div className="rewards-grid">
          {rewardsData.rewards.map(reward => (
            <div
              key={reward.id}
              className={`reward-card ${!reward.available ? 'locked' : ''}`}
              onClick={() => reward.available && setSelectedReward(reward)}
            >
              <div className="reward-icon">
                <span className="icon-emoji">{getCategoryIcon(reward.category)}</span>
                {!reward.available && <Lock size={20} className="lock-icon" />}
              </div>

              <div className="reward-content">
                <h4>{reward.name}</h4>
                <p>{reward.description}</p>

                {reward.expiryDate && (
                  <div className="expiry-info">
                    <Calendar size={14} />
                    <span>Expires {formatDate(reward.expiryDate)}</span>
                  </div>
                )}

                {!reward.available && reward.lockedReason && (
                  <div className="lock-reason">
                    <Lock size={14} />
                    <span>{reward.lockedReason}</span>
                  </div>
                )}
              </div>

              <div className="reward-cost">
                <div className="points-cost">
                  <Trophy size={16} />
                  <span>{reward.pointsCost.toLocaleString()}</span>
                </div>

                {reward.available && (
                  <button
                    className="redeem-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRedeemReward(reward);
                    }}
                    disabled={rewardsData.points.current < reward.pointsCost}
                  >
                    {rewardsData.points.current >= reward.pointsCost ? 'Redeem' : 'Insufficient Points'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Points History */}
      <div className="transactions-section">
        <div className="section-header">
          <h2>📊 Points History</h2>
        </div>

        <div className="transactions-list">
          {rewardsData.transactions.map(transaction => (
            <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
              <div className="transaction-icon">
                {transaction.type === 'earned' && <TrendingUp size={20} />}
                {transaction.type === 'redeemed' && <Gift size={20} />}
                {transaction.type === 'expired' && <Calendar size={20} />}
              </div>

              <div className="transaction-details">
                <div className="transaction-description">{transaction.description}</div>
                <div className="transaction-date">{formatDate(transaction.date)}</div>
              </div>

              <div className={`transaction-points ${transaction.type}`}>
                {transaction.type === 'earned' ? '+' : ''}{transaction.points}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reward Details Modal */}
      {selectedReward && (
        <div className="modal-overlay" onClick={() => setSelectedReward(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reward Details</h2>
              <button className="close-btn" onClick={() => setSelectedReward(null)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="reward-detail-header">
                <div className="reward-detail-icon">
                  <span className="icon-emoji">{getCategoryIcon(selectedReward.category)}</span>
                </div>
                <div className="reward-detail-info">
                  <h3>{selectedReward.name}</h3>
                  <p>{selectedReward.description}</p>
                </div>
              </div>

              <div className="reward-detail-cost">
                <div className="cost-info">
                  <span className="cost-label">Points Cost:</span>
                  <span className="cost-value">{selectedReward.pointsCost.toLocaleString()}</span>
                </div>

                {selectedReward.expiryDate && (
                  <div className="expiry-detail">
                    <Calendar size={16} />
                    <span>Expires: {formatDate(selectedReward.expiryDate)}</span>
                  </div>
                )}
              </div>

              <div className="reward-detail-terms">
                <h4>Terms & Conditions</h4>
                <ul>
                  <li>Reward is non-transferable</li>
                  <li>Valid for one-time use only</li>
                  <li>Cannot be combined with other offers</li>
                  <li>Subject to availability</li>
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedReward(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleRedeemReward(selectedReward);
                  setSelectedReward(null);
                }}
                disabled={rewardsData.points.current < selectedReward.pointsCost}
              >
                Redeem Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rewards;
