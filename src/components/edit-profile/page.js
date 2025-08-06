import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { FaUserPlus } from 'react-icons/fa';
import axios from 'axios';

const EditProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [userData, setUserData] = useState({
    displayName: '',
    email: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get admin info from localStorage
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      const adminObj = JSON.parse(adminData);
      setAdmin(adminObj);
      setUserData({
        displayName: adminObj.userName || '',
        email: adminObj.email || '',
        bio: adminObj.bio || '',
      });
      setLoading(false);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleSaveChanges = async () => {
    try {
      if (!admin?._id) {
        alert("Admin ID not found.");
        return;
      }
      const updatedAdmin = {
        userName: userData.displayName,
        bio: userData.bio,
      };
      const response = await axios.put(`https://api.edge21.co/api/admin/${admin._id}`, updatedAdmin);
      const newAdmin = { ...admin, ...updatedAdmin };
      localStorage.setItem('admin', JSON.stringify(newAdmin));
      setAdmin(newAdmin);
      alert(response.data.message || "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert(error.response?.data?.message || "Failed to update profile.");
    }
  };

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  return admin ? (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-white flex items-center mb-6"
        >
          <FiArrowLeft className="mr-2" />
          <span>Back</span>
        </button>

        <h1 className="text-white text-2xl font-bold mb-2">Edit Profile</h1>
        <p className="text-gray-400 mb-6">
          Fill out your profile to complete the setup of your account.
        </p>

        {/* User Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gray-600 rounded-full w-24 h-24 flex items-center justify-center text-gray-300">
            <FaUserPlus className="text-3xl" />
          </div>
        </div>

        {/* Form Fields */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-2">Your Name</label>
          <input
            type="text"
            name="displayName"
            value={userData.displayName}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-yellow-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            disabled
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-yellow-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 text-sm mb-2">Your Bio</label>
          <textarea
            name="bio"
            value={userData.bio}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-yellow-500"
            rows="4"
          ></textarea>
        </div>

        <button
          onClick={handleSaveChanges}
          className="w-full py-3 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-600 transition-all duration-200"
        >
          Save Changes
        </button>
      </div>
    </div>
  ) : null;
};

export default EditProfile;
