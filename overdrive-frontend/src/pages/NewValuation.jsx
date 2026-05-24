import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../Context/ToastContext';
import { vehicleService } from '../services/vehicleService';
import { mediaService } from '../services/mediaService';

export default function NewValuation() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [vehicleId, setVehicleId] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    asking_price: "",
    fuel_type: "",
    transmission: "",
    condition: "",
    body_type: "",
    engine_size: "",
    color: "",
    description: "No description"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFiles = (files) => {
    const selected = Array.from(files);
    const remaining = 6 - images.length;
    const toAdd = selected.slice(0, remaining).map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...toAdd]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = async () => {
    if (step === 1) {
      if (!formData.make || !formData.model || !formData.year) {
        showToast("Make, Model and Year are required", "error");
        return;
      }

      setLoading(true);
      try {
        // Clean numeric fields
        const payload = {
          ...formData,
          year: parseInt(formData.year) || 2022,
          mileage: parseInt(formData.mileage) || 0,
          asking_price: parseFloat(formData.asking_price) || 0,
          engine_size: parseInt(formData.engine_size) || 0,
        };

        const response = await vehicleService.createValuation(payload);
        const vid = response.data?.vehicle?.id || response.data?.id;

        if (vid) {
          setVehicleId(vid);
          setStep(2);
          showToast("Vehicle saved successfully!", "success");
        }
      } catch (err) {
        console.error("Backend Error:", err.response?.data);
        showToast(err.response?.data?.error || err.response?.data?.message || "Failed to save vehicle", "error");
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      if (images.length === 0) {
        showToast("Please upload at least 1 photo", "error");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    if (!vehicleId) return;
    setLoading(true);

    try {
      for (const img of images) {
        await mediaService.uploadImage(vehicleId, img.file);
      }
      await vehicleService.analyzeVehicle(vehicleId);
      showToast("AI Valuation completed!", "success");
      navigate('/history');
    } catch (err) {
      showToast("Vehicle saved. AI analysis may have failed.", "error");
      navigate('/history');
    } finally {
      setLoading(false);
    }
  };

  const prevStep = () => setStep(s => s - 1);

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', color: 'white' }}>
      <h1>New Vehicle Valuation</h1>
      <p style={{ color: '#94a3b8' }}>Enter details and upload images for AI valuation</p>

      <div style={{ display: 'flex', gap: '12px', margin: '30px 0' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: '6px', borderRadius: '999px', backgroundColor: s <= step ? '#00b4d8' : '#334155' }} />
        ))}
      </div>

      <div style={{ background: '#0f172a', padding: '32px', borderRadius: '16px' }}>

        {step === 1 && (
          <>
            <h2>Vehicle Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px' }}>
              <div><label>Make *</label><input name="make" value={formData.make} onChange={handleChange} placeholder="Toyota" style={inputStyle} /></div>
              <div><label>Model *</label><input name="model" value={formData.model} onChange={handleChange} placeholder="Corolla" style={inputStyle} /></div>
              <div><label>Year *</label><input name="year" value={formData.year} onChange={handleChange} placeholder="2022" style={inputStyle} /></div>
              <div><label>Color</label><input name="color" value={formData.color} onChange={handleChange} placeholder="Silver" style={inputStyle} /></div>

              <div>
                <label>Body Type</label>
                <select name="body_type" value={formData.body_type} onChange={handleChange} style={selectStyle}>
                  <option value="">Select Body Type</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Pickup">Pickup</option>
                </select>
              </div>

              <div>
                <label>Fuel Type</label>
                <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} style={selectStyle}>
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              <div>
                <label>Transmission</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange} style={selectStyle}>
                  <option value="">Select Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div>
                <label>Condition</label>
                <select name="condition" value={formData.condition} onChange={handleChange} style={selectStyle}>
                  <option value="">Select Condition</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div><label>Engine Size (cc)</label><input name="engine_size" value={formData.engine_size} onChange={handleChange} placeholder="1800" style={inputStyle} /></div>
              <div><label>Mileage (km) *</label><input name="mileage" value={formData.mileage} onChange={handleChange} placeholder="45000" style={inputStyle} /></div>
              <div><label>Asking Price (KES)</label><input name="asking_price" value={formData.asking_price} onChange={handleChange} placeholder="2500000" style={inputStyle} /></div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Upload Vehicle Photos (Up to 6)</h2>
            <div onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }} 
                 onDragOver={e => e.preventDefault()}
                 style={{ border: '2px dashed #475569', padding: '60px', textAlign: 'center', borderRadius: '12px' }}>
              <p>Drag & drop photos here</p>
              <button onClick={() => fileInputRef.current.click()} style={{ padding: '12px 32px', background: '#00b4d8', border: 'none', borderRadius: '8px', color: 'white' }}>
                Browse Files
              </button>
              <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={e => handleFiles(e.target.files)} style={{display:'none'}} />
            </div>

            {images.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4>Selected Images ({images.length}/6)</h4>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {images.map((img, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={img.url} style={{ width: '160px', height: '160px', objectFit: 'cover', borderRadius: '10px' }} />
                      <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: -10, right: -10, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28 }}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {step === 3 && <h2>Review & Submit for AI Analysis</h2>}

        <div style={{ marginTop: '40px', display: 'flex', gap: '16px' }}>
          {step > 1 && <button onClick={prevStep} style={btnSecondary}>Back</button>}
          <button onClick={nextStep} disabled={loading} style={btnPrimary}>
            {loading ? 'Saving...' : step === 3 ? 'Run AI Valuation' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '14px', background: '#1e2937', border: '1px solid #475569', borderRadius: '8px', color: 'white', marginTop: '6px' };
const selectStyle = { ...inputStyle };
const btnPrimary = { flex: 1, padding: '14px', background: '#00b4d8', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600' };
const btnSecondary = { padding: '14px 32px', background: '#334155', color: 'white', border: 'none', borderRadius: '12px' };