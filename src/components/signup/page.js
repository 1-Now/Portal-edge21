import { useState } from "react";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import RightContainer from './../Reuseable/RightContainer';
import logo from "../../images/logo.png";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://api.edge21.co/api/admin/signup", { email, password });
      if (response.status === 201) {
        alert("Signup successful!");
        navigate("/login");
      } else {
        alert(response.data.message || "Signup failed!");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Signup failed!");
      } else {
        alert("Signup failed! " + error.message);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Signup - The Bitcoin Edge</title>
        <meta name="description" content="Signup to access your personalized feed of trending Bitcoin news and insights." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Signup - The Bitcoin Edge" />
        <meta property="og:description" content="Signup to access your personalized feed of trending Bitcoin news and insights." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/logo.png" />
      </Helmet>

      <div className="min-h-screen flex flex-col lg:flex-row justify-between">
        {/* Left Section: Form */}
        <div className="lg:w-1/2 sm:w-full flex flex-col justify-center p-12 my-auto mx-auto">
          <div className="text-white pb-6">
            <img
              src={logo}
              alt="Signup Illustration"
              layout="responsive"
              width={100}
              height={200}
              objectFit="cover"
              className="logo-edge21"
            />
          </div>
          <h1 className="text-3xl text-white my-4 font-bold">Create Account</h1>
          <h6 className="text-md text-white mb-6">Sign up to get started</h6>

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
            onClick={handleSignup}
            className="bg-[#f7b006] text-white font-semibold py-2 px-4 rounded-xl w-full"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="text-sm text-left text-white mt-4">
            Already have an account?
            <Link to="/login" className="text-[#f7b006] ps-1">
              Login Here
            </Link>
          </p>
        </div>

        <RightContainer
          src="/images/register.jpg"
          alt="Signup Illustration"
        />
      </div>
    </>
  );
};

export default Signup;
