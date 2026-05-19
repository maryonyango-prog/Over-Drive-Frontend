import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center px-4">
      <div className="text-center max-w-md">

        {/* Big 404 */}
        <h1 className="text-8xl font-bold text-cyan-400 mb-4">404</h1>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Page not found</h2>
        <p className="text-gray-500 text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-sm transition"
          >
            ← Go back
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-500 text-black font-medium rounded-xl text-sm transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
