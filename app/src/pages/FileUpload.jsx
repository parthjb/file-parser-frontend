import { useRef, useState } from "react";
import {
  CheckCircle,
  AlertTriangle,
  Edit3,
  Save,
  X,
  AlertCircle,
  FileText,
} from "lucide-react";
import { confirmedMappings, uploadFile } from "../services/uploadService";

const ResultsPopup = ({ results, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Mapping Result
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="mb-2">
            <strong>Status:</strong> {results.status}
          </p>

          <div className="mb-4">
            <strong>Extracted Columns:</strong>
            <ul className="list-disc list-inside text-sm">
              {results.extracted_columns.map((col, i) => (
                <li key={i}>{col}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <strong>Unmapped Columns:</strong>
            <ul className="list-disc list-inside text-sm">
              {results.unmapped.unmapped_fields.length > 0 ? (
                <ul className="list-disc list-inside text-sm">
                  {results.unmapped.unmapped_fields.map((col, i) => (
                    <li key={i}>{col}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No unmapped columns.
                </p>
              )}
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
                {results.mappings.mappings.map((map, i) => (
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
              <li>Total Records: {results.processing_stats.total_records}</li>
              <li>Successful: {results.processing_stats.successful_records}</li>
              <li>Failed: {results.processing_stats.failed_records}</li>
            </ul>
          </div>

          <div>
            <strong>Errors:</strong>
            <ul className="list-disc list-inside text-sm">
              {results.processing_stats.errors.length > 0 ? (
                <ul className="list-disc list-inside text-sm">
                  {results.processing_stats.errors.map((col, i) => (
                    <li key={i}>{col}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No errors.
                </p>
              )}
            </ul>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const MappingPreview = ({ responseData, onConfirm, onCancel }) => {
  const [userMappings, setMappings] = useState(responseData.mappings);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingMapping, setEditingMapping] = useState({});

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingMapping({ ...userMappings[index] });
  };

  const saveEdit = () => {
    const updatedMappings = [...userMappings];
    updatedMappings[editingIndex] = editingMapping;
    setMappings(updatedMappings);
    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingMapping({});
  };

  const handleConfirm = () => {
    const file_upload_id = responseData.file_upload_id;
    const mappings = userMappings.map((mapping) => ({
      source_field: mapping.source_field.replace(/\s*\(.*?\)/g, ""),
      target_table: mapping.target_table,
      target_column: mapping.target_column.replace(/\s*\(.*?\)/g, ""),
    }));
    onConfirm(file_upload_id, { mappings });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Mapping Preview
        </h2>
        <p className="text-gray-600">Review and confirm the data mappings</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Field mappings by LLM
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {userMappings.map((mapping, index) => {
            return (
              <div key={index} className="px-6 py-4">
                {editingIndex === index ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Source Field
                        </label>
                        <input
                          type="text"
                          value={editingMapping.source_field}
                          onChange={(e) =>
                            setEditingMapping({
                              ...editingMapping,
                              source_field: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Target Table
                        </label>
                        <select
                          value={editingMapping.target_table}
                          onChange={(e) =>
                            setEditingMapping({
                              ...editingMapping,
                              target_table: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {Object.keys(responseData.expected_schema).map(
                            (table) => (
                              <option key={table} value={table}>
                                {table}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Target Column
                        </label>
                        <select
                          value={editingMapping.target_column}
                          onChange={(e) =>
                            setEditingMapping({
                              ...editingMapping,
                              target_column: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {editingMapping.target_table &&
                            Object.entries(
                              responseData.expected_schema[
                                editingMapping.target_table
                              ] || {}
                            ).map(([column, type]) => (
                              <option
                                key={column}
                                value={`${column} (${type})`}
                              >
                                {column} ({type})
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex items-center gap-1"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 flex items-center gap-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {mapping.source_field}
                        </div>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {mapping.target_table}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-900">
                          {mapping.target_column}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => startEditing(index)}
                        className="px-3 py-1 bg-yellow-200 text-black rounded-md text-sm hover:bg-yellow-300 flex items-center gap-1"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Domain Schema</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(responseData.expected_schema).map(
              ([table, columns]) => (
                <div
                  key={table}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h4 className="font-medium text-gray-900 mb-2">{table}</h4>
                  <div className="space-y-1">
                    {Object.entries(columns).map(([column, type]) => (
                      <div
                        key={column}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-700">{column}</span>
                        <span className="text-gray-500">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleConfirm}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Confirm Mappings
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMappingPreview, setShowMappingPreview] = useState(false);
  const [processingResults, setProcessingResults] = useState(null);
  const [showResultsPopup, setShowResultsPopup] = useState(false);
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
      console.log("File upload id", response.file_upload_id);
      setShowMappingPreview(true);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setResponseData(null);
    setShowMappingPreview(false);
    setProcessingResults(null);
    setShowResultsPopup(false);
  };

  const handleMappingConfirm = async (file_upload_id, finalMappings) => {
    if (!finalMappings || !finalMappings.mappings) {
      alert("Mappings are missing or invalid.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await confirmedMappings(file_upload_id, finalMappings);
      setProcessingResults(response);
      setShowMappingPreview(false);
      setShowResultsPopup(true);
    } catch (error) {
      console.error("Data insertion failed", error);
      alert("Data insertion failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMappingCancel = () => {
    setShowMappingPreview(false);
  };

  const handleResultsClose = () => {
    setShowResultsPopup(false);
    // Reset everything to go back to file upload interface
    handleCancel();
  };

  if (showMappingPreview && responseData) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <MappingPreview
          responseData={responseData}
          onConfirm={handleMappingConfirm}
          onCancel={handleMappingCancel}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-xl font-semibold animate-pulse">
            Processing...
          </div>
        </div>
      )}

      {showResultsPopup && processingResults && (
        <ResultsPopup
          results={processingResults}
          onClose={handleResultsClose}
        />
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
        <div>
          <button
            onClick={handleUpload}
            disabled={!file}
            className={`px-6 py-2 rounded-lg text-white font-medium transition ${
              file
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Upload
          </button>

          <button
            onClick={handleCancel}
            disabled={!file}
            className={`px-6 py-2 ml-3 rounded-lg text-white font-medium transition ${
              file
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
