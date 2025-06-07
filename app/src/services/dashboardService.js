import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL;

export const dashboardData = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/file-parser/api/dashboard/overview`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while fetching the dashboard data:", error);
    throw error;
  }
};

export const getFileData = async (fileId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/file-parser/api/dashboard/processing-summary/${fileId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while fetching the file mappings:", error);
    throw error;
  }
};