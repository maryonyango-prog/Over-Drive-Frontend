import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { vehicleService } from '../services/vehicleService';
import { useToast } from '../Context/ToastContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [stats, setStats] = useState({
    totalVehicles: 0,
    avgScore: 0,
    pendingCount: 0,
    highRated: 0
  });
  const [recentVehicles, setRecentVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const res = await vehicleService.getHistory();
      const vehicles = res.data.history || [];

      const total = vehicles.length;
      const completed = vehicles.filter(v => v.analysis?.final_score > 0);
      const pending = total - completed.length;
      
      const scores = completed.map(v => v.analysis?.final_score || 0);
      const avgScore = scores.length > 0 
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
        : 0;

      const highRated = completed.filter(v => (v.analysis?.final_score || 0) >= 75).length;

      setStats({
        totalVehicles: total,
        avgScore,
        pendingCount: pending,
        highRated
      });

      setRecentVehicles(vehicles.slice(0, 5));
    } catch (err) {
      showToast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  const goToValuation = (vehicle) => {
    if (vehicle.analysis) {
      navigate('/valuation-result', { state: { valuation: vehicle.analysis, vehicle } });
    } else {
      showToast("This valuation is still pending", "error");
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', color: 'white' }}>Loading dashboard...</div>;
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.full_name?.split(' ')[0] || 'User'} 👋</h1>
      <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Here's an overview of your vehicle valuations</p>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: '#1e2937', padding: '24px', borderRadius: '16px' }}>
          <p style={{ color: '#94a3b8' }}>Total Valuations</p>
          <h2 style={{ fontSize: '42px', margin: '12px 0' }}>{stats.totalVehicles}</h2>
        </div>

        <div style={{ background: '#1e2937', padding: '24px', borderRadius: '16px' }}>
          <p style={{ color: '#94a3b8' }}>Average Score</p>
          <h2 style={{ fontSize: '42px', margin: '12px 0', color: '#22c55e' }}>
            {stats.avgScore}<span style={{ fontSize: '20px' }}>/100</span>
          </h2>
        </div>

        <div style={{ background: '#1e2937', padding: '24px', borderRadius: '16px' }}>
          <p style={{ color: '#94a3b8' }}>Pending Analysis</p>
          <h2 style={{ fontSize: '42px', margin: '12px 0', color: '#f59e0b' }}>{stats.pendingCount}</h2>
        </div>

        <div style={{ background: '#1e2937', padding: '24px', borderRadius: '16px' }}>
          <p style={{ color: '#94a3b8' }}>High Rated (≥75)</p>
          <h2 style={{ fontSize: '42px', margin: '12px 0', color: '#22c55e' }}>{stats.highRated}</h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '30px' }}>
        <button 
          onClick={() => navigate('/new-valuation')}
          style={{
            padding: '14px 32px',
            background: '#00b4d8',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            cursor: 'pointer',
            marginRight: '12px'
          }}
        >
          + New Valuation
        </button>
      </div>

      {/* Recent Valuations */}
      <h2 style={{ marginBottom: '20px' }}>Recent Valuations</h2>
      <div style={{ display: 'grid', gap: '16px' }}>
        {recentVehicles.length === 0 ? (
          <div style={{ background: '#1e2937', padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
            No valuations yet. Create your first one!
          </div>
        ) : (
          recentVehicles.map((vehicle) => {
            const score = vehicle.analysis?.final_score || 0;
            return (
              <div 
                key={vehicle.id}
                style={{
                  background: '#1e2937',
                  padding: '20px',
                  borderRadius: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => goToValuation(vehicle)}
              >
                <div>
                  <h3>{vehicle.make} {vehicle.model} ({vehicle.year})</h3>
                  <p style={{ color: '#94a3b8' }}>
                    {vehicle.mileage?.toLocaleString()} km • KSh {vehicle.asking_price?.toLocaleString()}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {score > 0 ? (
                    <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e' }}>
                      {score}
                    </span>
                  ) : (
                    <span style={{ color: '#f59e0b' }}>Pending</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}