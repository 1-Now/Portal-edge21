
import { useEffect, useState } from 'react';
import { auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);


  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged out successfully");
    navigate('/login');
  };

  if (!user) {
    return <p className="text-center text-white">Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center text-white">
      <div className="bg-[#0f1216] w-full sm:w-full md:w-1/2 lg:w-1/3.5">
        <div className="py-4 ps-4 flex items-center">
          <Link to="/all-posts">
            <FaArrowLeft className='cursor-pointer'/>
          </Link>
          <div className="pl-5">
            <h1>
              Settings
            </h1>
            <p className="text-xs">Edit your settings below</p>
          </div>
        </div>
      </div>
      <div className="bg-[#0f1216] w-full sm:w-full md:w-1/2 lg:w-1/3.5">
        <div className="py-4 ps-4">
          <h1 className="text-sm font-bold mb-2">{user.displayName || "No Name Provided"}</h1>
          <p className="text-yellow-500 text-xs">{user.email}</p>
        </div>

      </div>
      <div className="mt-4 w-full sm:w-full md:w-1/2 lg:w-1/3.5">
        <h6 className="text-white ps-4 pb-4 text-xs">Account Settings</h6>
        <div className="bg-[#0f1216] mb-4">
        <Link to="/edit-profile">
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-800">
            <span className="text-white text-xs">Edit Profile</span>
            <span className="text-gray-400 text-2xl">›</span>
          </div>
          </Link>
          <Link to="/forgot-password">
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-800">
            <span className="text-white text-xs">Change Password</span>
            <span className="text-gray-400 text-2xl">›</span>
          </div>
          </Link>
          <Link to="/">
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-800">
            <span className="text-white text-xs">Home</span>
            <span className="text-gray-400 text-2xl">›</span>
          </div>
          </Link>
          <Link to="https://edge21.co/about/">
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-800">
            <span className="text-white text-xs">About</span>
            <span className="text-gray-400 text-2xl">›</span>
          </div>
          </Link>
        </div>
        <div className="mt-4 w-full flex justify-center">
          <button
            onClick={handleLogout}
            className="bg-[#0f1216] border border-[#363535] rounded-md px-[30px] py-3 cursor-pointer text-xs"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
