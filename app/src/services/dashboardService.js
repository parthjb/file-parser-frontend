import axios from "axios";

export const dashboardData = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8000/file-parser/api/dashboard/overview`,
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
      `http://localhost:8000/file-parser/api/dashboard/processing-summary/${fileId}`,
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