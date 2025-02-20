import React, { useState, useEffect } from "react";
import ModalComponent from "../Reuseable/Model";
import Loader from "../Reuseable/Loader";
import axios from "axios";

const MainFeedDesc = () => {
  const [feedData, setFeedData] = useState(null);
  const [btcPriceData, setBtcPriceData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBtcOpen, setModalBtcOpen] = useState(false);
  const [customData, setCustomData] = useState({
    metatitle: "",
    metadescription: "",
    tags: "",
  });
  const [customBtcData, setCustomBtcData] = useState({
    metatitle: "",
    metadescription: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [btcLoading, setBtcLoading] = useState(false);
  const currentDate = new Date().toISOString().split("T")[0];

  // Fetch Feed data for the current date
  const fetchFeedData = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(
        `https://api.edge21.co/api/data/fetchFeedByDate/${currentDate}`
      );
      setFeedData(response.data[0] || null);
    } catch (error) {
      console.error("Error fetching feed data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch BTC price data for the current date
  const fetchBtcPriceData = async () => {
    setBtcLoading(true); // Start loading
    try {
      const response = await axios.get(
        `https://api.edge21.co/api/data/fetchBtcPriceByDate/${currentDate}`
      );
      setBtcPriceData(response.data[0] || null);
    } catch (error) {
      console.error("Error fetching BTC price data:", error);
    } finally {
      setBtcLoading(false); // Stop loading
    }
  };

  // Automatically update Feed data
  const handleFeedAutoUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(
        `https://api.edge21.co/api/data/updateFeedByDate/${currentDate}`
      );
      fetchFeedData(); // Refresh data
      alert("Feed data updated automatically.");
    } catch (error) {
      console.error("Error updating feed data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Automatically update BTC price data
  const handleBtcPriceAutoUpdate = async () => {
    setBtcLoading(true); // Start loading
    try {
      await axios.put(
        `https://api.edge21.co/api/data/updateBtcPriceByDate/${currentDate}`
      );
      fetchBtcPriceData(); // Refresh data
      alert("BTC price data updated automatically.");
    } catch (error) {
      console.error("Error updating BTC price data:", error);
    } finally {
      setBtcLoading(false); // Stop loading
    }
  };

  // Open modal and prefill custom data with Feed data
  const handleOpenCustomUpdateModal = () => {
    if (feedData) {
      setCustomData({
        metatitle: feedData.metatitle,
        metadescription: feedData.metadescription,
        tags: feedData.tags,
      });
    }
    setModalOpen(true);
  };
  const handleOpenCustomBtcUpdateModal = () => {
    if (btcPriceData) {
      setCustomBtcData({
        metatitle: btcPriceData.metatitle,
        metadescription: btcPriceData.metadescription,
        tags: btcPriceData.tags,
      });
    }
    setModalBtcOpen(true);
  };

  const handleCustomBtcUpdate = async () => {
    setBtcLoading(true); // Start loading
    try {
      await axios.put(
        `https://api.edge21.co/api/data/updateBtcPriceByDate/${currentDate}`,
        customBtcData
      );
      fetchBtcPriceData();
      setModalBtcOpen(false);
      alert("BTC price data updated with custom input.");
    } catch (error) {
      console.error("Error updating custom BTC price data:", error);
    } finally {
      setBtcLoading(false); // Stop loading
    }
  };


  // Handle custom update for Feed data
  const handleCustomUpdate = async () => {
    setLoading(true); // Start loading
    try {
      await axios.put(
        `https://api.edge21.co/api/data/updateFeedByDate/${currentDate}`,
        customData
      );
      fetchFeedData();
      setModalOpen(false);
      alert("Feed data updated with custom input.");
    } catch (error) {
      console.error("Error updating custom feed data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchFeedData();
    fetchBtcPriceData();
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      {loading && <Loader />} {/* Show Loader when loading */}
      <h1 className="text-3xl font-bold mb-6">Bitcoin Feed Management</h1>

      {/* Feed Data Display */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-2">Feed Data for {currentDate}:</h2>
        {feedData ? (
          <div>
            <p className="mb-2"><strong>Title:</strong> {feedData.metatitle}</p>
            <p className="mb-2">
              <strong>Description:</strong> {feedData.metadescription}
            </p>
            <p className="mb-2"><strong>Tags:</strong> {feedData.tags}</p>
          </div>
        ) : (
          <p>No feed data available for today.</p>
        )}
      </div>

      {/* BTC Price Data Display */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2">BTC Price Data for {currentDate}:</h2>
        {btcPriceData ? (
          <div>
            <p className="mb-2"><strong>Title:</strong> {btcPriceData.metatitle}</p>
            <p className="mb-2">
              <strong>Description:</strong> {btcPriceData.metadescription}
            </p>
            <p className="mb-2"><strong>Tags:</strong> {btcPriceData.tags}</p>
          </div>
        ) : (
          <p>No BTC price data available for today.</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleFeedAutoUpdate}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded shadow"
        >
          Auto Update Feed
        </button>
        <button
          onClick={handleBtcPriceAutoUpdate}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded shadow"
        >
          Auto Update BTC Price
        </button>
        <button
          onClick={handleOpenCustomBtcUpdateModal}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded shadow"
        >
          Custom Update BTC Price
        </button>
        <button
          onClick={handleOpenCustomUpdateModal}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded shadow"
        >
          Custom Update Feed
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
            Update Feed
          </button>
        </form>
      </ModalComponent>

      {/* Modal for Custom BTC Price Update */}
      <ModalComponent
        isOpen={modalBtcOpen}
        onClose={() => setModalBtcOpen(false)}
        title="Custom Update BTC Price"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCustomBtcUpdate();
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Title:</label>
            <input
              type="text"
              value={customBtcData.metatitle}
              onChange={(e) =>
                setCustomBtcData({ ...customBtcData, metatitle: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="Enter custom BTC title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Description:</label>
            <textarea
              value={customBtcData.metadescription}
              onChange={(e) =>
                setCustomBtcData({ ...customBtcData, metadescription: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="Enter custom BTC description"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Tags:</label>
            <input
              type="text"
              value={customBtcData.tags}
              onChange={(e) =>
                setCustomBtcData({ ...customBtcData, tags: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="Enter custom BTC tags"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded shadow"
          >
            Update BTC Price
          </button>
        </form>
      </ModalComponent>
    </div>
  );
};

export default MainFeedDesc;
