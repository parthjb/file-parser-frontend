import { useRef, useState } from 'react';
import { uploadFile } from '../services/uploadService';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    try {
      const response = await uploadFile(file);
      setResponseData(response);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-xl font-semibold animate-pulse">
            Processing...
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6">File Upload</h1>

        <div
          onClick={handleUploadClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="w-full max-w-md h-40 border-4 border-dashed border-blue-400 bg-white rounded-lg flex items-center justify-center cursor-pointer text-blue-600 hover:bg-blue-50 transition mb-4"
        >
          {file ? (
            <span className="text-center">
              Selected File: <strong>{file.name}</strong>
            </span>
          ) : (
            <span className="text-center">
              Click or drag a file here to upload
            </span>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={handleUpload}
          disabled={!file}
          className={`px-6 py-3 text-xl rounded text-white transition ${
            file
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Upload
        </button>

        {responseData && (
          <div className="mt-10 w-full max-w-4xl bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Upload Result</h2>

            <p className="mb-2">
              <strong>Status:</strong> {responseData.status}
            </p>

            <div className="mb-4">
              <strong>Extracted Columns:</strong>
              <ul className="list-disc list-inside text-sm">
                {responseData.extracted_columns.map((col, i) => (
                  <li key={i}>{col}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <strong>Mappings:</strong>
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-2 py-1">Source</th>
                    <th className="border px-2 py-1">Target Table</th>
                    <th className="border px-2 py-1">Target Column</th>
                  </tr>
                </thead>
                <tbody>
                  {responseData.mappings.mappings.map((map, i) => (
                    <tr key={i}>
                      <td className="border px-2 py-1">{map.source_field}</td>
                      <td className="border px-2 py-1">{map.target_table}</td>
                      <td className="border px-2 py-1">{map.target_column}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <strong>Processing Stats:</strong>
              <ul className="list-inside text-sm">
                <li>Total Records: {responseData.processing_stats.total_records}</li>
                <li>Successful: {responseData.processing_stats.successful_records}</li>
                <li>Failed: {responseData.processing_stats.failed_records}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;




