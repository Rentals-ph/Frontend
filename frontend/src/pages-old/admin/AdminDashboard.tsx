import AppSidebar from '../../components/common/AppSidebar'
import DashboardHeader from '../../components/common/DashboardHeader'
import { 
  FiUsers, 
  FiHome, 
  FiDollarSign,
  FiLayers,
  FiCheckCircle
} from 'react-icons/fi'
import './AdminDashboard.css'

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <AppSidebar/>
      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <DashboardHeader
          title="Dashboard Overview"
          subtitle="Welcome back, Admin"
          userName={localStorage.getItem('admin_name') || 'John Admin'}
          userRole="Administrator"
          showNotifications={true}
          avatarFallback="JD"
        />

        {/* Metrics Cards */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon blue">
              <FiLayers />
            </div>
            <div className="metric-content">
              <h3>Total Properties</h3>
              <p className="metric-value">1,247</p>
              <p className="metric-change positive">↑ 12% from last month</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon orange">
              <FiUsers />
            </div>
            <div className="metric-content">
              <h3>Active Agents</h3>
              <p className="metric-value">89</p>
              <p className="metric-change positive">↑ 8% from last month</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon green">
              <FiCheckCircle />
            </div>
            <div className="metric-content">
              <h3>Monthly Bookings</h3>
              <p className="metric-value">342</p>
              <p className="metric-change positive">↑ 15% from last month</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon green">
              <FiDollarSign />
            </div>
            <div className="metric-content">
              <h3>Revenue</h3>
              <p className="metric-value">$24,890</p>
              <p className="metric-change positive">↑ 22% from last month</p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="charts-row">
          <div className="chart-card">
            <h2>Revenue Overview</h2>
            <div className="chart-container">
              <svg className="line-chart" viewBox="0 0 400 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 20 160 L 80 120 L 140 80 L 200 100 L 260 60 L 320 40 L 380 30"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  className="chart-line"
                />
                <path
                  d="M 20 160 L 80 120 L 140 80 L 200 100 L 260 60 L 320 40 L 380 30 L 380 200 L 20 200 Z"
                  fill="url(#areaGradient)"
                />
                <g className="chart-labels">
                  <text x="20" y="195" fontSize="12" fill="#6B7280">Jan</text>
                  <text x="80" y="195" fontSize="12" fill="#6B7280">Feb</text>
                  <text x="140" y="195" fontSize="12" fill="#6B7280">Mar</text>
                  <text x="200" y="195" fontSize="12" fill="#6B7280">Apr</text>
                  <text x="260" y="195" fontSize="12" fill="#6B7280">May</text>
                  <text x="320" y="195" fontSize="12" fill="#6B7280">Jun</text>
                </g>
                <g className="chart-y-labels">
                  <text x="5" y="200" fontSize="12" fill="#6B7280">0</text>
                  <text x="5" y="160" fontSize="12" fill="#6B7280">5k</text>
                  <text x="5" y="120" fontSize="12" fill="#6B7280">10k</text>
                  <text x="5" y="80" fontSize="12" fill="#6B7280">15k</text>
                  <text x="5" y="40" fontSize="12" fill="#6B7280">20k</text>
                  <text x="5" y="10" fontSize="12" fill="#6B7280">25k</text>
                </g>
              </svg>
            </div>
          </div>

          <div className="chart-card">
            <h2>Property Types</h2>
            <div className="pie-chart-container">
              <svg className="pie-chart" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="40"
                  strokeDasharray={`${0.45 * 502.4} 502.4`}
                  transform="rotate(-90 100 100)"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="40"
                  strokeDasharray={`${0.25 * 502.4} 502.4`}
                  strokeDashoffset={`-${0.45 * 502.4}`}
                  transform="rotate(-90 100 100)"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="40"
                  strokeDasharray={`${0.20 * 502.4} 502.4`}
                  strokeDashoffset={`-${(0.45 + 0.25) * 502.4}`}
                  transform="rotate(-90 100 100)"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#EAB308"
                  strokeWidth="40"
                  strokeDasharray={`${0.10 * 502.4} 502.4`}
                  strokeDashoffset={`-${(0.45 + 0.25 + 0.20) * 502.4}`}
                  transform="rotate(-90 100 100)"
                />
              </svg>
              <div className="pie-legend">
                <div className="legend-item">
                  <div className="legend-color blue"></div>
                  <span>Apartments</span>
                  <span className="legend-percent">45%</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color orange"></div>
                  <span>Houses</span>
                  <span className="legend-percent">25%</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color green"></div>
                  <span>Condos</span>
                  <span className="legend-percent">20%</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color yellow"></div>
                  <span>Studios</span>
                  <span className="legend-percent">10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lists Row */}
        <div className="lists-row">
          <div className="list-card">
            <div className="list-header">
              <h2>Recent Agents</h2>
              <a href="#" className="view-all-link">View All</a>
            </div>
            <div className="list-content">
              <div className="list-item">
                <div className="item-avatar">
                  <div className="avatar-fallback">SJ</div>
                </div>
                <div className="item-info">
                  <h4>Sarah Johnson</h4>
                  <p>23 properties listed</p>
                </div>
                <span className="status-badge active">Active</span>
              </div>
              <div className="list-item">
                <div className="item-avatar">
                  <div className="avatar-fallback">MC</div>
                </div>
                <div className="item-info">
                  <h4>Mike Chen</h4>
                  <p>18 properties listed</p>
                </div>
                <span className="status-badge active">Active</span>
              </div>
              <div className="list-item">
                <div className="item-avatar">
                  <div className="avatar-fallback">ED</div>
                </div>
                <div className="item-info">
                  <h4>Emma Davis</h4>
                  <p>31 properties listed</p>
                </div>
                <span className="status-badge active">Active</span>
              </div>
              <div className="list-item">
                <div className="item-avatar">
                  <div className="avatar-fallback">AR</div>
                </div>
                <div className="item-info">
                  <h4>Alex Rodriguez</h4>
                  <p>15 properties listed</p>
                </div>
                <span className="status-badge pending">Pending</span>
              </div>
            </div>
          </div>

          <div className="list-card">
            <div className="list-header">
              <h2>Recent Properties</h2>
              <a href="#" className="view-all-link">View All</a>
            </div>
            <div className="list-content">
              <div className="list-item">
                <div className="property-icon">
                  <FiLayers />
                </div>
                <div className="item-info">
                  <h4>Modern Apartment</h4>
                  <p>Downtown • $2,500/month</p>
                </div>
                <span className="status-badge listed">Listed</span>
              </div>
              <div className="list-item">
                <div className="property-icon">
                  <FiLayers />
                </div>
                <div className="item-info">
                  <h4>Luxury Condo</h4>
                  <p>Uptown • $3,200/month</p>
                </div>
                <span className="status-badge rented">Rented</span>
              </div>
              <div className="list-item">
                <div className="property-icon">
                  <FiHome />
                </div>
                <div className="item-info">
                  <h4>Family House</h4>
                  <p>Suburbs • $2,800/month</p>
                </div>
                <span className="status-badge pending">Pending</span>
              </div>
              <div className="list-item">
                <div className="property-icon">
                  <FiLayers />
                </div>
                <div className="item-info">
                  <h4>Studio Apartment</h4>
                  <p>City Center • $1,800/month</p>
                </div>
                <span className="status-badge listed">Listed</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard

