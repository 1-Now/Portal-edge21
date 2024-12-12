import React, { useEffect, useState } from "react";
import { fetchAllBTCPara } from "../apis/getAllBTCPara";
import { updateBTCPara, deleteBTCPara } from "../apis/updateDeleteBTCPara";
const BitcoinHistory = () => {
  const [btcData, setBtcData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null); // To store the item being edited

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllBTCPara();
        setBtcData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Handle edit button click
  const handleEdit = (item) => {
    setEditData(item); // Open the edit form for the selected item
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteBTCPara(id);
        setBtcData(btcData.filter((item) => item._id !== id)); // Update state after deletion
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  // Save changes made in the edit form
  const handleSave = async () => {
    try {
      const updatedItem = await updateBTCPara(editData._id, editData);
      setBtcData(
        btcData.map((item) => (item._id === updatedItem._id ? updatedItem : item))
      );
      const updatedData = await fetchAllBTCPara();
      setBtcData(updatedData);
      setEditData(null); // Close the edit form
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  // Show loader while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-[70px] m-auto w-full sm:w-full gap-4 md:max-w-[700px] lg:max-w-[700px] text-white mob-px-10">
      {/* Edit Form */}
      {editData && (
        <div className="mb-[45px]">
          <h1 className="mb-3 font-bold text-xl">Edit Item</h1>
          <input
            type="text"
            name="heading1"
            value={editData.heading1 || ""}
            onChange={handleChange}
            placeholder="Heading 1"
            className="p-2 mb-2 rounded bg-gray-700 text-white border border-gray-500 w-full"
          />
          <textarea
            name="para1"
            value={editData.para1 || ""}
            onChange={handleChange}
            placeholder="Paragraph 1"
            className="p-2 mb-2 rounded bg-gray-700 text-white border border-gray-500 w-full"
          />
          <input
            type="text"
            name="heading2"
            value={editData.heading2 || ""}
            onChange={handleChange}
            placeholder="Heading 2"
            className="p-2 mb-2 rounded bg-gray-700 text-white border border-gray-500 w-full"
          />
          <textarea
            name="para2"
            value={editData.para2 || ""}
            onChange={handleChange}
            placeholder="Paragraph 2"
            className="p-2 mb-2 rounded bg-gray-700 text-white border border-gray-500 w-full"
          />
          <input
            type="text"
            name="heading3"
            value={editData.heading3 || ""}
            onChange={handleChange}
            placeholder="Heading 3"
            className="p-2 mb-2 rounded bg-gray-700 text-white border border-gray-500 w-full"
          />
          <textarea
            name="para3"
            value={editData.para3 || ""}
            onChange={handleChange}
            placeholder="Paragraph 3"
            className="p-2 mb-2 rounded bg-gray-700 text-white border border-gray-500 w-full"
          />
          <button
            onClick={handleSave}
            className="bg-green-500 px-4 py-2 text-white rounded"
          >
            Save
          </button>
          <button
            onClick={() => setEditData(null)}
            className="bg-red-500 px-4 py-2 text-white rounded ml-2"
          >
            Cancel
          </button>
        </div>
      )}

      {btcData.length > 0 ? (
        btcData.map((item) => (
          <div key={item._id} className="mb-[45px]">
            <h1 className="mb-3 font-bold text-xl">
              {new Date(item.timestamp).toDateString()}
            </h1>
            {item.heading1 && (
              <div>
                <h1 className="mb-3 font-bold text-xl">{item.heading1}</h1>
                <p className="text-md text-[#cccfd4]">{item.para1}</p>
              </div>
            )}
            {item.heading2 && (
              <div>
                <h1 className="mb-3 font-bold text-xl">{item.heading2}</h1>
                <p className="text-md text-[#cccfd4]">{item.para2}</p>
              </div>
            )}
            {item.heading3 && (
              <div>
                <h1 className="mb-3 font-bold text-xl">{item.heading3}</h1>
                <p className="text-md text-[#cccfd4]">{item.para3}</p>
              </div>
            )}
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => handleEdit(item)}
                className="bg-blue-500 px-4 py-2 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-500 px-4 py-2 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <div>No data available.</div>
      )}
    </div>
  );
};

export default BitcoinHistory;
