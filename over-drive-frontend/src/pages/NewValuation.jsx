import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { vehicleService } from "../api/vehicleService";

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();

const CONDITIONS = ["Excellent", "Good", "Fair", "Poor"];

const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric", "LPG"];

const TRANSMISSIONS = ["Automatic", "Manual"];

const BODY_TYPES = [
  "Sedan", "SUV", "Hatchback", "Pickup", "Van",
  "Coupe", "Convertible", "Wagon", "Bus", "Truck",
];

const MAX_FILES   = 6;
const MAX_SIZE_MB = 5;
const ACCEPTED    = ["image/jpeg", "image/png", "image/webp", "image/heic"];

// ─── Image Upload Components ──────────────────────────────────────────────────

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ImageCard({ file, preview, onRemove }) {
  return (
    <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square">
      <img
        src={preview}
        alt={file.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
        <button
          type="button"
          onClick={onRemove}
          className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
          aria-label="Remove image"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
        {formatBytes(file.size)}
      </div>
    </div>
  );
}

function DropZone({ onFiles, disabled }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files);
    onFiles(files);
  }, [onFiles, disabled]);

  const handleDragOver = (e) => { e.preventDefault(); if (!disabled) setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const handleInput = (e) => {
    const files = Array.from(e.target.files);
    onFiles(files);
    e.target.value = "";
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-10 text-center transition cursor-pointer ${
        disabled
          ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
          : dragging
          ? "border-cyan-400 bg-cyan-50"
          : "border-gray-300 hover:border-cyan-400 hover:bg-cyan-50/30"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        multiple
        className="hidden"
        onChange={handleInput}
        disabled={disabled}
      />
      <div className="w-14 h-14 rounded-full bg-cyan-50 flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-700 mb-1">
        {dragging ? "Drop your photos here" : "Drag & drop photos here"}
      </p>
      <p className="text-xs text-gray-400">
        or <span className="text-cyan-500 font-medium">browse files</span>
      </p>
      <p className="text-xs text-gray-400 mt-2">
        JPG, PNG, WEBP · Max {MAX_SIZE_MB}MB each · Up to {MAX_FILES} photos
      </p>
    </div>
  );
}

const IMAGE_TIPS = [
  "Front view — full vehicle visible",
  "Rear view",
  "Driver side profile",
  "Interior — dashboard & seats",
  "Engine bay",
  "Any damage or notable features",
];

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < current
                ? "bg-cyan-400 text-black"
                : i === current
                ? "bg-cyan-400 text-black ring-4 ring-cyan-100"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {i < current ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          {i < total - 1 && (
            <div className={`h-0.5 w-8 rounded ${i < current ? "bg-cyan-400" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError) =>
  `w-full px-4 py-3 border rounded-xl outline-none text-sm text-gray-900 placeholder-gray-400 transition focus:ring-2 focus:ring-cyan-400 ${
    hasError ? "border-red-400 focus:ring-red-300" : "border-gray-300"
  }`;

const selectClass = (hasError) =>
  `w-full px-4 py-3 border rounded-xl outline-none text-sm text-gray-900 bg-white transition focus:ring-2 focus:ring-cyan-400 ${
    hasError ? "border-red-400 focus:ring-red-300" : "border-gray-300"
  }`;

// ─── Main page ────────────────────────────────────────────────────────────────

const STEPS = ["Vehicle Details", "Image Upload", "Condition & Specs", "Review & Submit"];

function NewValuation() {
  const { token } = useAuth();
  const navigate  = useNavigate();

  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    condition: "",
    fuelType: "",
    transmission: "",
    bodyType: "",
    engineSize: "",
    color: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]); // { file, preview }
  const [imageErrors, setImageErrors] = useState([]);

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  const addFiles = useCallback((files) => {
    const newErrors = [];
    const valid = [];

    files.forEach((file) => {
      if (!ACCEPTED.includes(file.type)) {
        newErrors.push(`${file.name}: unsupported format.`);
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        newErrors.push(`${file.name}: exceeds ${MAX_SIZE_MB}MB limit.`);
        return;
      }
      if (images.length + valid.length >= MAX_FILES) {
        newErrors.push(`Maximum ${MAX_FILES} photos allowed.`);
        return;
      }
      valid.push({ file, preview: URL.createObjectURL(file) });
    });

    setImageErrors(newErrors);
    setImages((prev) => [...prev, ...valid].slice(0, MAX_FILES));
  }, [images]);

  const removeImage = (index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // ── Validation per step ──────────────────────────────────────────────────

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.make.trim())  e.make  = "Make is required.";
      if (!form.model.trim()) e.model = "Model is required.";
      if (!form.year)         e.year  = "Year is required.";
      else if (Number(form.year) < 1900 || Number(form.year) > CURRENT_YEAR + 1)
        e.year = `Enter a year between 1900 and ${CURRENT_YEAR + 1}.`;
    }
    // Step 1 (Image Upload) is optional - no validation required
    if (s === 2) {
      if (!form.condition)    e.condition = "Select a condition.";
      if (!form.mileage)      e.mileage   = "Mileage is required.";
      else if (isNaN(Number(form.mileage)) || Number(form.mileage) < 0)
        e.mileage = "Enter a valid mileage.";
      if (!form.fuelType)     e.fuelType  = "Select a fuel type.";
      if (!form.transmission) e.transmission = "Select a transmission.";
    }
    return e;
  };

  const handleNext = () => {
    const e = validateStep(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setApiError("");
    try {
      const payload = {
        ...form,
        year:     Number(form.year),
        mileage:  Number(form.mileage),
        engineSize: form.engineSize ? Number(form.engineSize) : undefined,
      };
      const result = await vehicleService.getValuation(payload, token);
      
      // Upload images if any were added
      if (images.length > 0) {
        try {
          const formData = new FormData();
          images.forEach(({ file }) => formData.append("images", file));
          formData.append("valuationId", result.id);

          const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

          if (USE_MOCK) {
            await new Promise((r) => setTimeout(r, 1500));
          } else {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
            const res = await fetch(`${API_URL}/api/vehicles/images`, {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            });

            if (!res.ok) {
              const data = await res.json();
              throw new Error(data.message || "Image upload failed.");
            }
          }
        } catch (uploadErr) {
          // Log error but don't fail the whole process
          console.error("Image upload error:", uploadErr);
        }
      }
      
      navigate(`/valuation/${result.id}`);
    } catch (err) {
      setApiError(
        err.message === "Failed to fetch"
          ? "Cannot reach the server. Make sure the backend is running."
          : err.message || "Valuation failed. Please try again."
      );
      setLoading(false);
    }
  };

  // ── Step 0: Vehicle Details ───────────────────────────────────────────────

  const renderStep0 = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Make *" error={errors.make}>
          <input
            type="text"
            value={form.make}
            onChange={set("make")}
            placeholder="e.g. Toyota"
            className={inputClass(errors.make)}
          />
        </Field>
        <Field label="Model *" error={errors.model}>
          <input
            type="text"
            value={form.model}
            onChange={set("model")}
            placeholder="e.g. Corolla"
            className={inputClass(errors.model)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Year *" error={errors.year}>
          <input
            type="number"
            value={form.year}
            onChange={set("year")}
            placeholder={String(CURRENT_YEAR)}
            min="1900"
            max={CURRENT_YEAR + 1}
            className={inputClass(errors.year)}
          />
        </Field>
        <Field label="Body Type" error={errors.bodyType}>
          <select value={form.bodyType} onChange={set("bodyType")} className={selectClass(errors.bodyType)}>
            <option value="">Select body type</option>
            {BODY_TYPES.map((b) => <option key={b}>{b}</option>)}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Color" error={errors.color}>
          <input
            type="text"
            value={form.color}
            onChange={set("color")}
            placeholder="e.g. Silver"
            className={inputClass(errors.color)}
          />
        </Field>
        <Field label="Engine Size (cc)" error={errors.engineSize}>
          <input
            type="number"
            value={form.engineSize}
            onChange={set("engineSize")}
            placeholder="e.g. 1800"
            className={inputClass(errors.engineSize)}
          />
        </Field>
      </div>
    </div>
  );

  // ── Step 1: Image Upload ──────────────────────────────────────────────────

  const renderStep1 = () => (
    <div className="space-y-5">
      <DropZone onFiles={addFiles} disabled={images.length >= MAX_FILES} />

      {/* Error list */}
      {imageErrors.length > 0 && (
        <div className="space-y-1">
          {imageErrors.map((e, i) => (
            <p key={i} className="text-xs text-red-500 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {e}
            </p>
          ))}
        </div>
      )}

      {/* Image grid */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">
              {images.length} / {MAX_FILES} photos added (optional)
            </p>
            <button
              type="button"
              onClick={() => { images.forEach(({ preview }) => URL.revokeObjectURL(preview)); setImages([]); }}
              className="text-xs text-red-400 hover:text-red-600 transition"
            >
              Remove all
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {images.map(({ file, preview }, i) => (
              <ImageCard
                key={i}
                file={file}
                preview={preview}
                onRemove={() => removeImage(i)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gray-50 rounded-2xl px-5 py-4">
        <h3 className="font-semibold text-gray-900 mb-2 text-sm">Photo tips</h3>
        <p className="text-xs text-gray-500 mb-3">
          Better photos = more accurate valuation. Try to include:
        </p>
        <ul className="space-y-1.5">
          {IMAGE_TIPS.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <div className="w-5 h-5 rounded-full bg-cyan-50 text-cyan-500 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                {i + 1}
              </div>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-gray-400 text-center">
        You can skip this step and proceed without images.
      </p>
    </div>
  );

  // ── Step 2: Condition & Specs ─────────────────────────────────────────────

  const renderStep2 = () => (
    <div className="space-y-5">
      <Field label="Mileage (km) *" error={errors.mileage}>
        <input
          type="number"
          value={form.mileage}
          onChange={set("mileage")}
          placeholder="e.g. 45000"
          min="0"
          className={inputClass(errors.mileage)}
        />
      </Field>

      <Field label="Condition *" error={errors.condition}>
        <div className="grid grid-cols-4 gap-2">
          {CONDITIONS.map((c) => {
            const colors = {
              Excellent: "border-green-400 bg-green-50 text-green-700",
              Good:      "border-blue-400 bg-blue-50 text-blue-700",
              Fair:      "border-yellow-400 bg-yellow-50 text-yellow-700",
              Poor:      "border-red-400 bg-red-50 text-red-700",
            };
            const isSelected = form.condition === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => { setForm((p) => ({ ...p, condition: c })); setErrors((p) => ({ ...p, condition: "" })); }}
                className={`py-2.5 rounded-xl border-2 text-sm font-medium transition ${
                  isSelected ? colors[c] : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
        {errors.condition && (
          <p className="mt-1 text-xs text-red-500">{errors.condition}</p>
        )}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Fuel Type *" error={errors.fuelType}>
          <select value={form.fuelType} onChange={set("fuelType")} className={selectClass(errors.fuelType)}>
            <option value="">Select fuel type</option>
            {FUEL_TYPES.map((f) => <option key={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="Transmission *" error={errors.transmission}>
          <select value={form.transmission} onChange={set("transmission")} className={selectClass(errors.transmission)}>
            <option value="">Select transmission</option>
            {TRANSMISSIONS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Additional Notes" error={errors.description}>
        <textarea
          value={form.description}
          onChange={set("description")}
          placeholder="Any extra details about the vehicle (optional)..."
          rows={3}
          className={`${inputClass(errors.description)} resize-none`}
        />
      </Field>

      {/* Register Vehicle CTA */}
      <div className="mt-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
        <p className="text-sm text-gray-700 mb-3">
          Ready to get your vehicle valuation? Register your vehicle details now.
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Register Vehicle
            </>
          )}
        </button>
      </div>
    </div>
  );

  // ── Step 3: Review ────────────────────────────────────────────────────────

  const renderStep3 = () => {
    const rows = [
      ["Make",         form.make],
      ["Model",        form.model],
      ["Year",         form.year],
      ["Body Type",    form.bodyType || "—"],
      ["Color",        form.color || "—"],
      ["Engine Size",  form.engineSize ? `${form.engineSize} cc` : "—"],
      ["Mileage",      form.mileage ? `${Number(form.mileage).toLocaleString()} km` : "—"],
      ["Condition",    form.condition],
      ["Fuel Type",    form.fuelType],
      ["Transmission", form.transmission],
    ];

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Review your vehicle details before submitting for AI valuation.
        </p>
        <div className="bg-gray-50 rounded-2xl divide-y divide-gray-100">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between px-5 py-3 text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-gray-900">{value || "—"}</span>
            </div>
          ))}
        </div>
        {form.description && (
          <div className="bg-gray-50 rounded-2xl px-5 py-3 text-sm">
            <p className="text-gray-500 mb-1">Notes</p>
            <p className="text-gray-900">{form.description}</p>
          </div>
        )}
        {apiError && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {apiError}
          </div>
        )}
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Valuation</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Enter your vehicle details to get an AI-powered market estimate.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        <StepIndicator current={step} total={STEPS.length} />

        <h2 className="text-lg font-semibold text-gray-900 mb-6">{STEPS[step]}</h2>

        {step === 0 && renderStep0()}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            ← Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black font-semibold text-sm transition"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold text-sm transition flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Getting valuation...
                </>
              ) : (
                "Get AI Valuation →"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewValuation;
