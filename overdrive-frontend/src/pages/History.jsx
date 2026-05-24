import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import { useToast } from '../Context/ToastContext';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revaluingId, setRevaluingId] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await vehicleService.getHistory();
      setHistory(res.data.history || []);
    } catch (err) {
      showToast("Failed to load history", "error");
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = (vehicle) => {
    if (vehicle.analysis) {
      navigate('/valuation-result', { 
        state: { 
          valuation: vehicle.analysis,
          vehicle: vehicle 
        } 
      });
    } else {
      showToast("AI analysis not completed yet", "error");
    }
  };

  const revalueVehicle = async (vehicleId) => {
    if (revaluingId) return;
    
    setRevaluingId(vehicleId);
    try {
      await vehicleService.analyzeVehicle(vehicleId);
      showToast("Revaluation completed! AI analysis updated.", "success");
      await loadHistory(); // Refresh
    } catch (err) {
      showToast("Revaluation failed", "error");
    } finally {
      setRevaluingId(null);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', color: 'white' }}>Loading valuations...</div>;
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Valuation History</h1>
        <button 
          onClick={() => navigate('/new-valuation')}
          style={{ padding: '12px 24px', background: '#00b4d8', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
        >
          + New Valuation
        </button>
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#1e2937', borderRadius: '16px' }}>
          <p>No valuations yet.</p>
          <button onClick={() => navigate('/new-valuation')} style={{ marginTop: '20px', padding: '12px 32px' }}>
            Start First Valuation
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {history.map((vehicle) => {
            const analysis = vehicle.analysis;
            const score = analysis?.final_score || 0;

            return (
              <div key={vehicle.id} style={{
                background: '#1e2937',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                gap: '24px',
                cursor: 'pointer'
              }} onClick={() => viewDetails(vehicle)}>
                <div style={{ flex: 1 }}>
                  <h3>{vehicle.make} {vehicle.model} ({vehicle.year})</h3>
                  <p style={{ color: '#94a3b8', marginTop: '8px' }}>
                    Mileage: {vehicle.mileage?.toLocaleString()} km • 
                    Asking: KSh {vehicle.asking_price?.toLocaleString()}
                  </p>
                  {analysis?.summary && (
                    <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px', lineHeight: '1.5' }}>
                      {analysis.summary.substring(0, 120)}...
                    </p>
                  )}
                </div>

                <div style={{ textAlign: 'right', minWidth: '220px' }}>
                  {score > 0 ? (
                    <div style={{
                      fontSize: '42px',
                      fontWeight: '700',
                      color: score >= 75 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444'
                    }}>
                      {score}<span style={{ fontSize: '18px' }}>/100</span>
                    </div>
                  ) : (
                    <div style={{ color: '#f59e0b' }}>Pending Analysis</div>
                  )}

                  <div style={{ marginTop: '12px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); revalueVehicle(vehicle.id); }}
                      disabled={revaluingId === vehicle.id}
                      style={{
                        padding: '8px 16px',
                        background: '#334155',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      {revaluingId === vehicle.id ? ' Analyzing...' : ' Revalue'}
                    </button>

                    <button 
                      onClick={(e) => { e.stopPropagation(); viewDetails(vehicle); }}
                      style={{
                        padding: '8px 20px',
                        background: '#00b4d8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      View Full Report →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}