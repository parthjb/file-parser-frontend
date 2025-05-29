import axios from "axios";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await axios.post(
      "http://localhost:8000/file-parser/api/upload/",
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
