"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { FaUserPlus } from 'react-icons/fa';
import { auth, db } from '@/app/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import Image from 'next/image';

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    displayName: '',
    email: '',
    bio: '',
    profileImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const imageInputRef = useRef(null);
  const router = useRouter();
  console.log(user,"user")
  console.log(userData,"userData")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        setUserData({
          displayName: currentUser.displayName || '',
          email: currentUser.email || '',
          bio: currentUser?.bio || '',
          profileImage: currentUser.photoURL || '',
        });

        // Optionally fetch additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          console.log(userDoc,"userDoc")
          if (userDoc.exists()) {
            setUserData(prevData => ({
              ...prevData,
              displayName: userDoc.data().displayName || '',
              bio: userDoc.data().bio || '',
            }));
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setUserData((prevData) => ({
        ...prevData,
        profileImage: URL.createObjectURL(e.target.files[0]), // Display the image preview
      }));
    }
  };

  const triggerImageUpload = () => {
    imageInputRef.current.click();
  };

  const handleSaveChanges = async () => {
    try {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          displayName: userData.displayName,
          bio: userData.bio,
          profileImage: userData.profileImage,
        });
        console.log(userRef,"UserRef")
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  return user ? (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-white flex items-center mb-6"
        >
          <FiArrowLeft className="mr-2" />
          <span>Back</span>
        </button>

        <h1 className="text-white text-2xl font-bold mb-2">Edit Profile</h1>
        <p className="text-gray-400 mb-6">
          Fill out your profile to complete the setup of your account.
        </p>

        {/* Profile Image Upload (User + Icon or Image Clickable) */}
        <div
          className="flex flex-col items-center mb-6 cursor-pointer"
          onClick={triggerImageUpload} // Trigger the file input when clicked
        >
          {userData.profileImage ? (
            <Image
              src={userData.profileImage} // Ensure that the profileImage is a valid URL
              alt="Profile Image"
              width={100}
              height={100}
              className="rounded-full"
            />
          ) : (
            <div className="bg-gray-600 rounded-full w-24 h-24 flex items-center justify-center text-gray-300">
              <FaUserPlus className="text-3xl" /> {/* User + Icon */}
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={imageInputRef}
          onChange={handleImageChange}
          style={{ display: 'none' }} // Hidden input field
        />

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
