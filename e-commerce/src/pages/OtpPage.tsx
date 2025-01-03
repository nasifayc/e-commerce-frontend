import { useOtpValidation } from "../hooks/useOtpValidation";

const OtpPage: React.FC = () => {
  const { otp, handleInputChange, handleKeyDown, handleSubmit, isLoading } =
    useOtpValidation(4);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 font-sans">
      <h1 className="text-2xl font-semibold mb-2">Email Verification</h1>
      <p className="text-gray-600 mb-6 text-center">
        Enter the 4-digit code we sent to your email.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="flex gap-4 mb-6">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ))}
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            Verify OTP
          </button>
        )}
      </form>
    </div>
  );
};

export default OtpPage;
