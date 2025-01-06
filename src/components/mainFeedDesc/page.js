import React, { useState, useEffect } from "react";
import ModalComponent from "../Reuseable/Model";
import Loader from "../Reuseable/Loader";
import axios from "axios";

const MainFeedDesc = () => {
  const [currentData, setCurrentData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [customData, setCustomData] = useState({
    metatitle: "",
    metadescription: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false); // State for managing loader
  const currentDate = new Date().toISOString().split("T")[0];

  // Fetch data for the current date
  const fetchCurrentData = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(
        `https://edge21-backend.vercel.app/api/data/fetchFeedByDate/${currentDate}`
      );
      setCurrentData(response.data[0] || null);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Automatically update or add data
  const handleAutoUpdate = async () => {
    setLoading(true); // Start loading
    try {
      await axios.put(
        `https://edge21-backend.vercel.app/api/data/updateFeedByDate/${currentDate}`
      );
      fetchCurrentData(); // Refresh data
      alert("Data updated automatically.");
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Open modal and prefill custom data with current data
  const handleOpenCustomUpdateModal = () => {
    if (currentData) {
      setCustomData({
        metatitle: currentData.metatitle,
        metadescription: currentData.metadescription,
        tags: currentData.tags,
      });
    }
    setModalOpen(true);
  };

  // Handle custom update
  const handleCustomUpdate = async () => {
    setLoading(true); // Start loading
    try {
      await axios.put(
        `https://edge21-backend.vercel.app/api/data/updateFeedByDate/${currentDate}`,
        customData
      );
      fetchCurrentData();
      setModalOpen(false);
      alert("Data updated with custom input.");
    } catch (error) {
      console.error("Error updating custom data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCurrentData();
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      {loading && <Loader />} {/* Show Loader when loading */}
      <h1 className="text-3xl font-bold mb-6">Bitcoin Feed Management</h1>

      {/* Current Data Display */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2">Current Data for {currentDate}:</h2>
        {currentData ? (
          <div>
            <p className="mb-2"><strong>Title:</strong> {currentData.metatitle}</p>
            <p className="mb-2">
              <strong>Description:</strong> {currentData.metadescription}
            </p>
            <p className="mb-2"><strong>Tags:</strong> {currentData.tags}</p>
          </div>
        ) : (
          <p>No data available for today.</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleAutoUpdate}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded shadow"
        >
          Auto Update
        </button>
        <button
          onClick={handleOpenCustomUpdateModal}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded shadow"
        >
          Custom Update
        </button>
      </div>

      {/* Modal for Custom Update */}
      <ModalComponent
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Custom Update"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCustomUpdate();
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Title:</label>
            <input
              type="text"
              value={customData.metatitle}
              onChange={(e) => setCustomData({ ...customData, metatitle: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="Enter custom title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Description:</label>
            <textarea
              value={customData.metadescription}
              onChange={(e) =>
                setCustomData({ ...customData, metadescription: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="Enter custom description"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Tags:</label>
            <input
              type="text"
              value={customData.tags}
              onChange={(e) => setCustomData({ ...customData, tags: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="Enter custom tags"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded shadow"
          >
            Update
          </button>
        </form>
      </ModalComponent>
    </div>
  );
};

export default MainFeedDesc;