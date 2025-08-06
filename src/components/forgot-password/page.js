
import { useState } from "react";
import axios from "axios";
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const handleSendResetEmail = async () => {
    try {
      if (!email) {
        setError("Please enter your email.");
        return;
      }
      const response = await axios.post("https://api.edge21.co/api/admin/forgot-password", { email });
      setMessage(response.data.message || "Password reset instructions sent to email.");
      setError(null);
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send reset instructions. Please try again.");
      setMessage(null);
    }
  };

  const handleResetPassword = async () => {
    try {
      if (!email || !resetToken || !newPassword) {
        setError("Please fill in all fields.");
        return;
      }
      const response = await axios.post("https://api.edge21.co/api/admin/reset-password", {
        email,
        resetToken,
        newPassword
      });
      setMessage(response.data.message || "Password reset successful.");
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reset password. Please try again.");
      setMessage(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password - The Bitcoin Edge</title>
        <meta name="description" content="Reset your password for The Bitcoin Edge." />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="Reset Password - The Bitcoin Edge" />
        <meta property="og:description" content="Reset your password for The Bitcoin Edge." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/logo.png" />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center">
        <div className="w-full max-w-md m-auto px-4 py-3">
          <h1 className="text-4xl font-bold text-white">
            Forget Password?
          </h1>
          {step === 1 ? (
            <>
              <p className="text-xs/[1rem] text-white my-5">
                Enter your email to receive a password reset code.<br/>
              </p>
              <div className="w-full relative mb-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-4 text-white bg-transparent rounded-lg border-2 border-white focus:outline-none focus:border-[#f7b006] transition-all duration-300"
                />
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleSendResetEmail}
                  className="bg-[#f7b006] text-white py-2 px-6 rounded-xl w-full"
                >
                  Send Reset Code
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs/[1rem] text-white my-5">
                Enter your email, reset code, and new password to reset your password.<br/>
                (Check your email for the reset code.)
              </p>
              <div className="w-full relative mb-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-4 text-white bg-transparent rounded-lg border-2 border-white focus:outline-none focus:border-[#f7b006] transition-all duration-300"
                />
              </div>
              <div className="w-full relative mb-3">
                <input
                  type="text"
                  placeholder="Reset Code"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  className="w-full text-xs p-4 text-white bg-transparent rounded-lg border-2 border-white focus:outline-none focus:border-[#f7b006] transition-all duration-300"
                />
              </div>
              <div className="w-full relative mb-3">
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-xs p-4 text-white bg-transparent rounded-lg border-2 border-white focus:outline-none focus:border-[#f7b006] transition-all duration-300"
                />
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleResetPassword}
                  className="bg-[#f7b006] text-white py-2 px-6 rounded-xl w-full"
                >
                  Reset Password
                </button>
              </div>
            </>
          )}
          <p className="text-xs/[1rem] text-white my-5">
            Back to <span className="text-[#f7b006] font-bold">
            <Link to="/login">
               Sign In </Link> </span>
          </p>
          {/* Success or Error Messages */}
          {message && <p className="text-green-500 text-center mt-4">{message}</p>}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
