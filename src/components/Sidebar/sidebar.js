
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FiMenu, FiX, FiTwitter, FiEdit } from 'react-icons/fi';
import { FaUsers,FaWifi } from "react-icons/fa";
import { MdArticle,MdVideoChat,MdOutlineEmail } from 'react-icons/md';
import { FaChartArea } from "react-icons/fa6";
import { auth } from "../../firebase/firebaseConfig";
import logo from "../../images/logo.png";
import { Link } from 'react-router-dom';
import { AiOutlineAudio } from "react-icons/ai";
import { BiCategory } from "react-icons/bi"
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="lg:hidden p-4">
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />} {/* Menu or Close icon */}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`flex flex-col bg-[#222831] h-screen lg:w-60 p-5 text-white fixed lg:relative transition-transform duration-300 transform z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="mb-8">
          <Link to="/all-posts">
            <img src={logo} alt="logo" className="pb-4"
            width={100} height={100}
            />
          </Link>
          <hr/>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-4 overflow-y-scroll h-[80vh]">
          <h4 className="text-xs">Platform Navigation</h4>
          <div className="ps-2">
          <Link to="/all-posts" className="hover:text-yellow-400 flex items-center space-x-2">
            <FaWifi size={20} className="wifi-icon" />
            <span>All Posts</span>
          </Link>
          <Link to="/edit-feed" className="hover:text-yellow-400 flex items-center space-x-2 py-4">
            <FiEdit size={20} />
            <span>Edit Feed</span>
          </Link>
          <Link to="/all-users" className="hover:text-yellow-400 flex items-center space-x-2">
            <FaUsers size={20} />
            <span>All Users</span>
          </Link>
          <Link to="/send-email" className="hover:text-yellow-400 flex items-center space-x-2 py-4">
            <MdOutlineEmail size={20} />
            <span>Send Email</span>
          </Link>
          </div>
          <h4 className="text-xs">Add Content</h4>
          <div className="ps-2">
          <Link to="/add-article" className="hover:text-yellow-400 flex items-center space-x-2">
            <MdArticle size={20} />
            <span>Add Article</span>
          </Link>
          <Link to="/add-video" className="hover:text-yellow-400 flex items-center space-x-2 py-4">
            <MdVideoChat size={20} />
            <span>Add Video</span>
          </Link>
          <Link to="/add-audio" className="hover:text-yellow-400 flex items-center space-x-2 pb-4">
            <AiOutlineAudio size={20} />
            <span>Add Audio</span>
          </Link>
          <Link to="/add-category" className="hover:text-yellow-400 flex items-center space-x-2 pb-4">
            <BiCategory size={20} />
            <span>Add Category</span>
          </Link>
          <Link to="/add-resourceLinks" className="hover:text-yellow-400 flex items-center space-x-2 pb-4">
            <BiCategory size={20} />
            <span>Add Resource Links</span>
          </Link>
          <Link to="/add-tweet" className="hover:text-yellow-400 flex items-center space-x-2">
            <FiTwitter size={20} />
            <span>Add Tweet</span>
          </Link>
          <Link to="/add-charts" className="hover:text-yellow-400 flex items-center space-x-2 py-4">
            <FaChartArea size={20} />
            <span>Add Charts</span>
          </Link>
          <Link to="/add-noster" className="hover:text-yellow-400 flex items-center space-x-2 pb-4">
            <MdArticle size={20} />
            <span>Add Noster</span>
          </Link>
          <Link to="/bitcoin-price" className="hover:text-yellow-400 flex items-center space-x-2">
            <MdArticle size={20} />
            <span>Bitcoin Price</span>
          </Link>
          <Link to="/bitcoin-history" className="hover:text-yellow-400 flex items-center space-x-2 py-4">
            <MdArticle size={20} />
            <span>Bitcoin History</span>
          </Link>
          <Link to="/main-feed-desc" className="hover:text-yellow-400 flex items-center space-x-2">
            <MdArticle size={20} />
            <span>Bitcoin Description</span>
          </Link>
          </div>
        </nav>

        {user ? (
          <div className="mt-auto text-sm cursor-pointer">
            <Link to="/profile">
              <hr />
              <p className="text-gray-400 pt-2">{user.displayName || 'User'}</p>
              <p className="text-gray-600">{user.email || 'No Email'}</p>
            </Link>
          </div>
        ) : (
          <div className="mt-auto text-sm text-gray-600">
            <p>Loading user info...</p>
          </div>
        )}
      </div>

      {/* Overlay for mobile view when the sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
