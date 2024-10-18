"use client";

import { useState, useEffect } from "react";
import { db } from "@/app/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { FaEllipsisV } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import Image from "next/image";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching user data from Firebase Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  console.log(users, "users");

  return (
    <div className="min-h-screen bg-gray-900 p-5">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-2xl font-bold">All Users</h1>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded-lg flex items-center">
          <FiPlus size={20} className="mr-2" />
          Add New
        </button>
      </div>

      {/* Table Header */}
      <div className="border border-gray-700 rounded-lg max-h-[82vh] overflow-y-auto">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full text-left text-gray-400">
            <thead className="bg-[#222831] text-[#e0e3e7]">
              <tr className="border-b border-gray-700">
                <th className="py-3 px-5">UID</th>
                <th className="py-3 px-5">User Details</th>
                <th className="py-3 px-5">Last Active</th>
                <th className="py-3 px-5">Role</th>
                <th className="py-3 px-5">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-800">
                  {/* User UID */}
                  <td className="py-3 px-5">{user.uid}</td>

                  {/* User Details */}
                  <td className="py-3 px-5 flex items-center">
                    {user.photo_url ? (
                      <Image
                        src={user.photo_url || ""}
                        alt={user.display_name}
                        width={30}
                        height={30}
                        className="rounded-full mr-3"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-600 mr-3 flex items-center justify-center">
                        {user.display_name?.[0] || "A"}
                      </div>
                    )}
                    <div>
                      <p className="text-white font-semibold">
                        {user.display_name || ""}
                      </p>
                      <p className="text-gray-500 text-sm">{user.email}</p>
                    </div>
                  </td>

                  {/* Last Active */}
                  <td className="py-3 px-5">
                    {user.created_time
                      ? new Date(user.created_time.seconds * 1000).toLocaleDateString()
                      : "Unknown"}
                  </td>

                  {/* Role */}
                  <td className="py-3 px-5">
                    <div className="w-8 h-8 rounded-full bg-green-600"></div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-5 text-center">
                    <FaEllipsisV />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
