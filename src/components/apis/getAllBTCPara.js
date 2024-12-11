import axios from "axios";
export async function fetchAllBTCPara() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/data/fetch-Para-Details?filter=all`
    );
    return response.data || [];
  } catch (error) {
    console.error("Error fetching all BTC para details:", error);
    return [];
  }
}
