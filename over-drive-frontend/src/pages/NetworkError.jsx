function NetworkError({ onRetry }) {
  return (
    <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">

        <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">No connection</h2>
        <p className="text-gray-500 text-sm mb-8">
          We couldn't reach the server. Check your internet connection and try again.
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-500 text-black font-medium rounded-xl text-sm transition"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export default NetworkError;
