"use client";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import Head from 'next/head';
import Link from 'next/link'

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleResetPassword = async () => {
    try {
      if (!email) {
        setError("Please enter your email.");
        return;
      }

      await sendPasswordResetEmail(auth, email);
      setMessage("A password reset link has been sent to your email.");
      setError(null);
    } catch (error) {
      setError("Failed to send reset link. Please check your email and try again.");
      setMessage(null);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password - The Bitcoin Edge</title>
        <meta name="description" content="Reset your password for The Bitcoin Edge." />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="Reset Password - The Bitcoin Edge" />
        <meta property="og:description" content="Reset your password for The Bitcoin Edge." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/logo.png" />
      </Head>

      <div className="min-h-screen flex flex-col items-center">
        <div className="w-full max-w-md m-auto px-4 py-3">
          <h1 className="text-4xl font-bold text-white">
            Forget Password?
          </h1>
          <p className="text-xs/[1rem] text-white my-5">
            Enter your email,we will send you a password reset Email.
          </p>
          <div className="w-full relative">
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
              onClick={handleResetPassword}
              className="bg-[#f7b006] text-white py-2 px-6 rounded-xl w-full"
            >
              Reset Password
            </button>
          </div>
          <p className="text-xs/[1rem] text-white my-5">
            Back to <span className="text-[#f7b006] font-bold">
            <Link href="/login">
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
