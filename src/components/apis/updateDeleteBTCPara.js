import axios from "axios";

// Update data by ID
export const updateBTCPara = async (id, updatedData) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/api/data/update-Para-Details/${id}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating BTC para:", error);
    throw error;
  }
};

// Delete data by ID
export const deleteBTCPara = async (id) => {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/api/data/delete-Para-Details/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting BTC para:", error);
    throw error;
  }
};
