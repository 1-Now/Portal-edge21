
import { useState } from "react";
import axios from "axios";
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChangePassword = async () => {
    try {
      if (!email || !currentPassword || !newPassword) {
        setError("Please fill in all fields.");
        return;
      }
      const response = await axios.post("https://api.edge21.co/api/admin/change-password", {
        email,
        currentPassword,
        newPassword
      });
      setMessage(response.data.message || "Password changed successfully.");
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to change password. Please try again.");
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
            Change Password?
          </h1>
          <p className="text-xs/[1rem] text-white my-5">
            Enter your email, current password, and new password to change your password.
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
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
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
              onClick={handleChangePassword}
              className="bg-[#f7b006] text-white py-2 px-6 rounded-xl w-full"
            >
              Change Password
            </button>
          </div>
          <p className="text-xs/[1rem] text-white my-5">
            Back to <span className="text-[#f7b006] font-bold">
            <Link to="/profile">
               Profile </Link> </span>
          </p>
          {/* Success or Error Messages */}
          {message && <p className="text-green-500 text-center mt-4">{message}</p>}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
