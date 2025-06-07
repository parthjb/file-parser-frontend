import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL;
export const uploadFile = async (file, options = {}) => {
  const { storageLocation } = options;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("storageLocation", storageLocation);
  try {
    const response = await axios.post(
      `${API_BASE_URL}/file-parser/api/upload/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while uploading file:", error);
    throw error;
  }
};


export const confirmedMappings = async (file_upload_id, data) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/file-parser/api/upload/${file_upload_id}/confirm-mappings`,
      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while confirming mappings:", error);
    throw error;
  }
};



