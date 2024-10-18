"use client";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import RightContainer from './../components/Reuseable/RightContainer';
import { auth } from "../firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Head from 'next/head';
import Link from 'next/link';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User:", userCredential.user);

      router.push("/all-posts");
    } catch (error) {
      console.error("Login error:", error.message);
      alert("Login failed! Please check your credentials.");
    }
  };

  return (
    <>
      <Head>
        <title>Login - The Bitcoin Edge</title>
        <meta name="description" content="Login to access your personalized feed of trending Bitcoin news and insights." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Login - The Bitcoin Edge" />
        <meta property="og:description" content="Login to access your personalized feed of trending Bitcoin news and insights." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/logo.png" />
      </Head>

      <div className="min-h-screen flex flex-col lg:flex-row justify-between">
        {/* Left Section: Form */}
        <div className="lg:w-1/2 sm:w-full flex flex-col justify-center p-12 my-auto mx-auto">
          <div className="text-white pb-6">
            <Image
              src="/images/logo.png"
              alt="Login Illustration"
              layout="responsive"
              width={100}
              height={200}
              objectFit="cover"
              className="logo-edge21"
            />
          </div>
          <h1 className="text-3xl text-white my-4 font-bold">Welcome Back</h1>
          <h6 className="text-md text-white mb-6">Let&#39;s get started by filling out form below</h6>

          <div className="w-full mb-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border-2 border-transparent focus:outline-none focus:border-[#f7b006] transition-all duration-300"
              />
            </div>
          </div>

          <div className="w-full mb-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border-2 border-transparent focus:outline-none focus:border-[#f7b006] transition-all duration-300"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogin}
            className="bg-[#f7b006] text-white font-semibold py-2 px-4 rounded-xl w-full"
          >
            Sign In
          </button>

          <p className="text-sm text-left text-white mt-4">
            Forgot your password?
            <Link href="/forgot-password" className="text-[#f7b006] ps-1">
              Reset Here
            </Link>
          </p>
        </div>

        <RightContainer
          src="/images/register.jpg"
          alt="Login Illustration"
        />
      </div>
    </>
  );
};

export default Login;
