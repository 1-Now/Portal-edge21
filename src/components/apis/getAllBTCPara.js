import axios from "axios";
export async function fetchAllBTCPara() {
  try {
    const response = await axios.get(
      `https://api.edge21.co/api/data/fetch-Para-Details?filter=all`
    );
    return response.data || [];
  } catch (error) {
    console.error("Error fetching all BTC para details:", error);
    return [];
  }
}
