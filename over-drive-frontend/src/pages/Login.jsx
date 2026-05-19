import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useToast } from "../Context/ToastContext";
import { ErrorMessage, FieldError } from "../components/errors/ErrorMessage";

// ─── Field-level validation ───────────────────────────────────────────────────

function validate({ email, password }) {
  const errors = {};
  if (!email)                          errors.email    = "Email is required.";
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email  = "Enter a valid email address.";
  if (!password)                       errors.password = "Password is required.";
  else if (password.length < 6)        errors.password = "Password must be at least 6 characters.";
  return errors;
}

// ─── Component ────────────────────────────────────────────────────────────────

function Login() {
  const { login, loading, error, isAuthenticated, clearAuthError } = useAuth();
  const { showToast } = useToast();
  const navigate      = useNavigate();
  const location      = useLocation();

  const [formData, setFormData]       = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched]         = useState({});

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    clearAuthError();
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Re-validate the changed field if it's already been touched
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

    // Mark all fields touched and run full validation
    setTouched({ email: true, password: true });
    const errs = validate(formData);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const result = await login(formData.email, formData.password);

    if (result.success) {
      showToast("Welcome back!", "success");
      navigate(from, { replace: true });
    } else {
      // API error is shown in the banner; also toast it
      showToast(result.error || "Login failed.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF2F5] flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold">
          <span className="text-cyan-400">Over </span>
          <span className="text-cyan-400">Drive</span>
        </h1>
        <p className="mt-2 text-gray-700">AI Vehicle Valuation Platform</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white/40 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-white/30">

        <h2 className="text-3xl font-bold text-black mb-2">Welcome Back</h2>
        <p className="text-gray-800 mb-6">Sign in to access your dashboard</p>

        {/* API / server error banner */}
        <ErrorMessage
          message={error}
          onDismiss={clearAuthError}
          className="mb-6"
        />

        <form onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div className="mb-5">
            <label className="block mb-2 font-medium text-sm">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="you@example.com"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              className={`w-full p-4 rounded-2xl border bg-white/50 outline-none focus:ring-2 focus:ring-cyan-400 transition ${
                fieldErrors.email ? "border-red-400 focus:ring-red-300" : "border-gray-300"
              }`}
            />
            <FieldError message={fieldErrors.email} />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block mb-2 font-medium text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="********"
              aria-invalid={!!fieldErrors.password}
              className={`w-full p-4 rounded-2xl border bg-white/50 outline-none focus:ring-2 focus:ring-cyan-400 transition ${
                fieldErrors.password ? "border-red-400 focus:ring-red-300" : "border-gray-300"
              }`}
            />
            <FieldError message={fieldErrors.password} />
          </div>

          {/* Options */}
          <div className="flex items-center justify-between mb-6 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#" className="text-cyan-400 hover:text-cyan-500">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-400 hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 text-black font-semibold py-4 rounded-2xl text-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In →"
            )}
          </button>
        </form>

        <div className="border-t border-gray-300 my-8" />

        <p className="text-center text-gray-800">
          Don't have an account?{" "}
          <Link to="/register" className="text-cyan-400 font-semibold hover:text-cyan-500">
            Sign up for Free
          </Link>
        </p>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-gray-600">Or continue with</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="border border-gray-300 rounded-2xl py-3 bg-white/50 hover:bg-white transition text-sm">
            Google
          </button>
          <button className="border border-gray-300 rounded-2xl py-3 bg-white/50 hover:bg-white transition text-sm">
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
