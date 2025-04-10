import { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import ModalComponent from './../Reuseable/Model';
import axios from "axios";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for editing
  const [customData, setCustomData] = useState({
    email: "",
    phoneNumber: "",
    verified: false
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://api.edge21.co/api/auth/users");
        setUsers(response.data.users || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  const handleUpdate = async () => {
    if (!selectedUser) return;
  
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Matches numbers like +1234567890 or 1234567890
    if (!phoneRegex.test(customData.phoneNumber)) {
      alert("Please enter a valid phone number in international format.");
      return;
    }
  
    try {
      const response = await axios.put(
        `https://api.edge21.co/api/auth/users/edit/${selectedUser._id}`,
        {
          email: customData.email,
          phoneNumber: customData.phoneNumber,
          verified: customData.verified
        }
      );
  
      console.log(response, "response");
  
      // Check if the response status is 200 and success is true
      if (response.status === 200 && response.data.success) {
        const updatedUser = response.data.user; // Extract the updated user data
        console.log(updatedUser, "updatedUser");
  
        // Update the local user list after successful update
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === updatedUser._id ? updatedUser : user
          )
        );
        setModalOpen(false); // Close the modal after successful update
      } else {
        throw new Error("Failed to update user.");
      }
    } catch (error) {
      setError(error.message); // Set the error message if there's an issue
    }
  };
  
  // Open modal with selected user data
  const openModal = (user) => {
    setSelectedUser(user);
    setCustomData({
      email: user.email,
      phoneNumber: user.phoneNumber,
      verified: user.verified
    });
    setModalOpen(true);
  };

  return (
    <>
      <ModalComponent
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit User"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-white">Email:</label>
            <input
              type="email"
              value={customData.email}
              onChange={(e) => setCustomData({ ...customData, email: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="Enter user email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-white">Phone Number:</label>
            <input
              type="text"
              value={customData.phoneNumber}
              onChange={(e) => setCustomData({ ...customData, phoneNumber: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="Enter user phone number"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-white">Verified:</label>
            <select
              value={customData.verified}
              onChange={(e) => setCustomData({ ...customData, verified: e.target.value === 'true' })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
            >
              <option value={true}>Verified</option>
              <option value={false}>Not Verified</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded shadow"
          >
            Update User
          </button>
        </form>
      </ModalComponent>

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
                  <th className="py-3 px-5">User Email</th>
                  <th className="py-3 px-5">Verified</th>
                  <th className="py-3 px-5">Token Used</th>
                  <th className="py-3 px-5">PhoneNumber</th>
                  <th className="py-3 px-5">Created</th>
                  <th className="py-3 px-5">Subscription</th>
                  <th className="py-3 px-5">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800">
                    {/* User Details */}
                    <td className="py-3 px-5">
                      <p className="text-gray-500 text-sm">{user?.email}</p>
                    </td>
                    <td className="py-3 px-5">
                      <p className={`text-sm ${user?.verified ? 'text-green-400' : 'text-red-400'}`}>
                        {user?.verified ? 'Verified' : 'Not Verified'}
                      </p>
                    </td>
                    <td className="py-3 px-5">
                      <p className={`text-sm ${user?.tokenUsed ? 'text-green-400' : 'text-red-400'}`}>
                        {user?.tokenUsed ? 'token Used' : 'Not Used'}
                      </p>
                    </td>
                    <td className="py-3 px-5">
                      <p className="text-gray-500 text-sm text-center">{user?.phoneNumber || "-"}</p>
                    </td>

                    {/* Last Active */}
                    <td className="py-3 px-5">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit"
                        })
                        : "Unknown"}
                    </td>

                    {/* Subscription */}
                    <td className="py-3 px-5">
                      {user.subscriptions && user.subscriptions.length > 0 ? (
                        <div>
                          <p
                            className={`text-md ${user.subscriptions[0].subscriptionStatus === 'active' ? 'text-green-500' : 'text-red-500'}`}
                          >
                            {user.subscriptions[0].subscriptionStatus}
                          </p>
                        </div>
                      ) : (
                        "No subscription"
                      )}
                    </td>
                    {/* Actions */}
                    <td className="py-3 px-5 flex justify-center items-center">
                      <CiEdit onClick={() => openModal(user)} className="cursor-pointer text-blue-500" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </>
  );
};

export default AllUsers;
