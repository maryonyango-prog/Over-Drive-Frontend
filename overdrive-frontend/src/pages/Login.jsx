import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useToast } from '../Context/ToastContext';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(formData);
      showToast("Login successful!", "success");
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || "Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
        <h1 style={{ color: '#00b4d8', textAlign: 'center', marginBottom: '8px' }}>OverDrive</h1>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '40px' }}>AI Vehicle Valuation Platform</p>

        <form onSubmit={handleSubmit} style={{ background: '#1e2937', padding: '40px', borderRadius: '16px' }}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={inputStyle}
            required
          />

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            Don't have an account? <Link to="/register" style={{ color: '#00b4d8' }}>Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '14px',
  marginBottom: '16px',
  background: '#0f172a',
  border: '1px solid #475569',
  borderRadius: '8px',
  color: 'white'
};

const btnStyle = {
  width: '100%',
  padding: '14px',
  background: '#00b4d8',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: '10px'
};