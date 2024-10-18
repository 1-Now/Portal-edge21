"use client";
import { useState, useEffect } from 'react';
import { auth } from '@/app/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import { FiMenu, FiX, FiTwitter, FiEdit } from 'react-icons/fi';
import { FaUsers,FaWifi } from "react-icons/fa";
import { MdArticle,MdVideoChat } from 'react-icons/md';
import { FaChartArea } from "react-icons/fa6";
import Image from "next/image";
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
      {/* Mobile Menu Button */}
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
          <Link href="/all-posts">
            <Image src="/images/logo.png" alt="logo" className="pb-4"
            width={100} height={100}
            />
          </Link>
          <hr/>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-4">
          <h4 className="text-xs">Platform Navigation</h4>
          <div className="ps-2">
          <Link href="/all-posts" className="hover:text-yellow-400 flex items-center space-x-2">
            <FaWifi size={20} className="wifi-icon" />
            <span>All Posts</span>
          </Link>
          <Link href="/edit-feed" className="hover:text-yellow-400 flex items-center space-x-2 py-4">
            <FiEdit size={20} />
            <span>Edit Feed</span>
          </Link>
          <Link href="/all-users" className="hover:text-yellow-400 flex items-center space-x-2">
            <FaUsers size={20} />
            <span>All Users</span>
          </Link>
          </div>
          <h4 className="text-xs">Add Content</h4>
          <div className="ps-2">
          <Link href="/addArticle" className="hover:text-yellow-400 flex items-center space-x-2">
            <MdArticle size={20} />
            <span>Add Article</span>
          </Link>
          <Link href="/add-video" className="hover:text-yellow-400 flex items-center space-x-2 py-4">
            <MdVideoChat size={20} />
            <span>Add Video</span>
          </Link>
          <Link href="/addTweet" className="hover:text-yellow-400 flex items-center space-x-2">
            <FiTwitter size={20} />
            <span>Add Tweet</span>
          </Link>
          <Link href="/add-charts" className="hover:text-yellow-400 flex items-center space-x-2 py-4">
            <FaChartArea size={20} />
            <span>Add Charts</span>
          </Link>
          </div>
        </nav>

        {user ? (
          <div className="mt-auto text-sm cursor-pointer">
            <Link href="/profile">
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
