import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../Context/ToastContext';
import { authService } from '../services/authService';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      showToast("Registration successful! Please login.", "success");
      navigate('/login');
    } catch (err) {
      showToast(err.response?.data?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
        <h1 style={{ color: '#00b4d8', textAlign: 'center' }}>OverDrive</h1>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '40px' }}>Create your account</p>

        <form onSubmit={handleSubmit} style={{ background: '#1e2937', padding: '40px', borderRadius: '16px' }}>
          <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} required />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={inputStyle} required />
          <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={inputStyle} required />
          <input type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} style={inputStyle} required />

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            Already have an account? <Link to="/login" style={{ color: '#00b4d8' }}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '14px', marginBottom: '16px', background: '#0f172a', border: '1px solid #475569', borderRadius: '8px', color: 'white' };
const btnStyle = { width: '100%', padding: '14px', background: '#00b4d8', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' };