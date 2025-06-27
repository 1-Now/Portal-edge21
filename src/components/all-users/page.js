import { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import ModalComponent from './../Reuseable/Model';
import axios from "axios";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for editing
  const [customData, setCustomData] = useState({
    email: "",
    phoneNumber: "",
    verified: false,
    subscriptions: [],
    istrial: false,
    firstBTCPaymentDone: false,
    btcSubscriptionStatus: ""
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://api.edge21.co/api/auth/users");
        console.log(response, "response");
        setUsers(response.data || []);
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <FaSortUp className="ml-1 text-blue-400" /> : 
      <FaSortDown className="ml-1 text-blue-400" />;
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortField) return 0;

    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle nested values like subscriptions
    if (sortField === 'subscriptionStatus') {
      aValue = a.subscriptions && a.subscriptions.length > 0 ? a.subscriptions[0].subscriptionStatus : '';
      bValue = b.subscriptions && b.subscriptions.length > 0 ? b.subscriptions[0].subscriptionStatus : '';
    }

    // Handle date fields
    if (sortField === 'lastLogin' || sortField === 'btcPaidUntil') {
      aValue = aValue ? new Date(aValue) : new Date(0);
      bValue = bValue ? new Date(bValue) : new Date(0);
    }

    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleUpdate = async () => {
    if (!selectedUser) return;

    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Matches numbers like +1234567890 or 1234567890
    if (
      customData.phoneNumber && !phoneRegex.test(customData.phoneNumber)
    ) {
      alert("Please enter a valid phone number in international format.");
      return;
    }

    try {
      const response = await axios.put(
        `https://api.edge21.co/api/auth/users/edit/${selectedUser._id}`,
        {
          email: customData.email,
          phoneNumber: customData.phoneNumber,
          verified: customData.verified,
          subscriptions: customData.subscriptions,
          istrial: customData.istrial,
          firstBTCPaymentDone: customData.firstBTCPaymentDone,
          btcSubscriptionStatus: customData.btcSubscriptionStatus
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
      verified: user.verified,
      subscriptions: user.subscriptions || [],
      istrial: user.istrial,
      firstBTCPaymentDone: user.firstBTCPaymentDone || false,
      btcSubscriptionStatus: user.btcSubscriptionStatus || "inactive"
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

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-white">Is Trial:</label>
            <select
              value={customData?.istrial}
              onChange={(e) => setCustomData({ ...customData, istrial: e.target.value === 'true' })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-white">Subscription Status:</label>
            {customData.subscriptions && customData.subscriptions.length > 0 ? (
              <select
                value={customData.subscriptions[0]?.subscriptionStatus || 'inactive'} // Default to inactive if no subscription
                onChange={(e) => {
                  const updatedSubscriptions = [...customData.subscriptions];
                  updatedSubscriptions[0].subscriptionStatus = e.target.value;
                  setCustomData({ ...customData, subscriptions: updatedSubscriptions });
                }}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            ) : (
              <p className="text-sm text-gray-500">No subscription available</p> // Text showing if no subscription exists
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-white">BTC Subscription Status:</label>
            <select
              value={customData.btcSubscriptionStatus}
              onChange={(e) => setCustomData({ ...customData, btcSubscriptionStatus: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-white">First BTC Payment Done:</label>
            <select
              value={customData.firstBTCPaymentDone}
              onChange={(e) => setCustomData({ ...customData, firstBTCPaymentDone: e.target.value === 'true' })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
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
                  <th className="py-3 px-5 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('email')}>
                    <div className="flex items-center">
                      User Email
                      {getSortIcon('email')}
                    </div>
                  </th>
                  <th className="py-3 px-5 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('verified')}>
                    <div className="flex items-center">
                      Verified
                      {getSortIcon('verified')}
                    </div>
                  </th>
                  <th className="py-3 px-5 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('tokenUsed')}>
                    <div className="flex items-center">
                      Token Used
                      {getSortIcon('tokenUsed')}
                    </div>
                  </th>
                  <th className="py-3 px-5 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('phoneNumber')}>
                    <div className="flex items-center">
                      PhoneNumber
                      {getSortIcon('phoneNumber')}
                    </div>
                  </th>
                  <th className="py-3 px-5 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('lastLogin')}>
                    <div className="flex items-center">
                      Last Login
                      {getSortIcon('lastLogin')}
                    </div>
                  </th>
                  <th className="py-3 px-5 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('istrial')}>
                    <div className="flex items-center">
                      Free Plan
                      {getSortIcon('istrial')}
                    </div>
                  </th>
                  <th className="py-3 px-5 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('subscriptionStatus')}>
                    <div className="flex items-center">
                      Subscription
                      {getSortIcon('subscriptionStatus')}
                    </div>
                  </th>
                  <th className="py-3 px-5 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('btcSubscriptionStatus')}>
                    <div className="flex items-center">
                      BTC Status
                      {getSortIcon('btcSubscriptionStatus')}
                    </div>
                  </th>
                  <th className="py-3 px-5 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('firstBTCPaymentDone')}>
                    <div className="flex items-center">
                      BTC Payment
                      {getSortIcon('firstBTCPaymentDone')}
                    </div>
                  </th>
                  <th className="py-3 px-5 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('btcPaidUntil')}>
                    <div className="flex items-center">
                      BTC Paid Until
                      {getSortIcon('btcPaidUntil')}
                    </div>
                  </th>
                  <th className="py-3 px-5">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedUsers.map((user) => (
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
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit"
                        })
                        : "Unknown"}
                    </td>
                    <td className="py-3 px-5">
                      <p className="text-gray-500 text-sm text-center">
                        {user?.istrial ? "Yes" : "No"}
                      </p>
                    </td>

                    {/* Subscription */}
                    <td className="py-3 px-5">
                      {user.subscriptions && user.subscriptions.length > 0 ? (
                        <p
                          className={"text-gray-400 text-sm"}
                        >
                          {user.subscriptions[0].subscriptionStatus}
                        </p>
                      ) : (
                        "No subscription"
                      )}
                    </td>

                    {/* BTC Subscription Status */}
                    <td className="py-3 px-5">
                      <p className={`text-sm ${user?.btcSubscriptionStatus === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                        {user?.btcSubscriptionStatus}
                      </p>
                    </td>

                    {/* First BTC Payment Done */}
                    <td className="py-3 px-5">
                      {user?.firstBTCPaymentDone ? (
                        <div className="text-sm font-medium text-green-500 flex items-center gap-1">
                          ✅ 1$ used
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-red-500 flex items-center gap-1">
                          ❌ Not Subscribed
                        </span>
                      )}
                    </td>

                    {/* BTC Paid Until */}
                    <td className="py-3 px-5">
                      <p className="text-gray-500 text-sm">
                        {user?.btcPaidUntil
                          ? new Date(user.btcPaidUntil).toLocaleString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit"
                          })
                          : "-"}
                      </p>
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
