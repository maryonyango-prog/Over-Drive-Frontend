import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useToast } from "../Context/ToastContext";
import { ErrorMessage, FieldError } from "../components/errors/ErrorMessage";

// ─── Field-level validation ───────────────────────────────────────────────────

function validate({ name, email, password, confirmPassword }) {
  const errors = {};

  if (!name || name.trim().length < 2)
    errors.name = "Full name must be at least 2 characters.";

  if (!email)
    errors.email = "Email is required.";
  else if (!/\S+@\S+\.\S+/.test(email))
    errors.email = "Enter a valid email address.";

  if (!password)
    errors.password = "Password is required.";
  else if (password.length < 6)
    errors.password = "Password must be at least 6 characters.";

  if (!confirmPassword)
    errors.confirmPassword = "Please confirm your password.";
  else if (password && confirmPassword !== password)
    errors.confirmPassword = "Passwords do not match.";

  return errors;
}

// ─── Component ────────────────────────────────────────────────────────────────

function Register() {
  const { register, loading, error, isAuthenticated, clearAuthError } = useAuth();
  const { showToast } = useToast();
  const navigate      = useNavigate();

  const [formData, setFormData]       = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched]         = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    clearAuthError();
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const errs = validate({ ...formData, [name]: value });
      setFieldErrors((prev) => ({ ...prev, [name]: errs[name] || "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validate(formData);
    setFieldErrors((prev) => ({ ...prev, [name]: errs[name] || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    const errs = validate(formData);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const result = await register(formData.name, formData.email, formData.password);

    if (result.success) {
      showToast("Account created! Welcome to Over Drive.", "success");
      navigate("/dashboard", { replace: true });
    } else {
      showToast(result.error || "Registration failed.", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEF2F5] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 mt-2">Join Over Drive today</p>
        </div>

        {/* API / server error banner */}
        <ErrorMessage
          message={error}
          onDismiss={clearAuthError}
          className="mb-6"
        />

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your full name"
              aria-invalid={!!fieldErrors.name}
              className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-black transition ${
                fieldErrors.name ? "border-red-400 focus:ring-red-300" : "border-gray-300"
              }`}
            />
            <FieldError message={fieldErrors.name} />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              aria-invalid={!!fieldErrors.email}
              className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-black transition ${
                fieldErrors.email ? "border-red-400 focus:ring-red-300" : "border-gray-300"
              }`}
            />
            <FieldError message={fieldErrors.email} />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Create a password (min. 6 characters)"
              aria-invalid={!!fieldErrors.password}
              className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-black transition ${
                fieldErrors.password ? "border-red-400 focus:ring-red-300" : "border-gray-300"
              }`}
            />
            <FieldError message={fieldErrors.password} />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm your password"
              aria-invalid={!!fieldErrors.confirmPassword}
              className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-black transition ${
                fieldErrors.confirmPassword ? "border-red-400 focus:ring-red-300" : "border-gray-300"
              }`}
            />
            <FieldError message={fieldErrors.confirmPassword} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
