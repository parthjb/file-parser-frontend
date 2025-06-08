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
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Processing Results
          </h1>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-full">
          <div className="w-1/3 bg-white border-r border-gray-200 p-6 space-y-8">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Processing Summary
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-800">Status</div>
                  <div
                    className={`text-sm font-medium ${
                      results.status === "Completed"
                        ? "text-green-600"
                        : results.status === "Partial success"
                        ? "text-yellow-600"
                        : results.status === "Failed"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {results.status.charAt(0).toUpperCase() +
                      results.status.slice(1)}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-800">Total Records</div>
                  <div className="text-sm text-gray-900">
                    {results.processing_stats.total_records}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-800">Success Rate</div>
                  <div className="text-sm text-gray-900">
                    {Math.round(
                      (results.processing_stats.successful_records /
                        results.processing_stats.total_records) *
                        100
                    )}
                    %
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Processing Stats
              </h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Successful:</span>
                  <span className="font-medium text-gray-900">
                    {results.processing_stats.successful_records}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Failed:</span>
                  <span className="font-medium text-gray-900">
                    {results.processing_stats.failed_records}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Columns:</span>
                  <span className="font-medium text-gray-900">
                    {results.extracted_columns.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Mapped:</span>
                  <span className="font-medium text-gray-900">
                    {results.mappings.mappings.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Unmapped:</span>
                  <span className="font-medium text-gray-900">
                    {results.unmapped.unmapped_fields.length}
                  </span>
                </div>
              </div>
            </div>

            {results.processing_stats.errors.length > 0 && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="text-sm text-red-800">
                  <strong>Errors Detected:</strong>{" "}
                  {results.processing_stats.errors.length} issues found
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 p-6">
            <div className="max-w-full mx-auto space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-6 text-gray-900">
                  Applied Field Mappings
                </h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-8 py-4 text-left text-sm font-medium text-gray-600 w-1/3">
                            Source Field
                          </th>
                          <th className="px-8 py-4 text-left text-sm font-medium text-gray-600 w-1/3">
                            Target Table
                          </th>
                          <th className="px-8 py-4 text-left text-sm font-medium text-gray-600 w-1/3">
                            Target Column
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {results.mappings.mappings.map((mapping, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-8 py-4">
                              <span className="text-sm text-gray-900 font-mono">
                                {mapping.source_field}
                              </span>
                            </td>
                            <td className="px-8 py-4">
                              <span className="text-sm text-gray-700">
                                {mapping.target_table}
                              </span>
                            </td>
                            <td className="px-8 py-4">
                              <span className="text-sm text-gray-700">
                                {mapping.target_column}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {results.unmapped.unmapped_fields.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-6 text-gray-900">
                    Unmapped Fields
                  </h2>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                              Field Name
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {results.unmapped.unmapped_fields.map(
                            (field, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                  <span className="text-sm text-gray-900 font-mono">
                                    {field}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-sm text-gray-700">
                                    Unmapped
                                  </span>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {results.processing_stats.errors.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-6 text-gray-900">
                    Processing Errors
                  </h2>
                  <div className="bg-white rounded-lg shadow-sm border border-red-200">
                    <div className="p-8">
                      <div className="space-y-3">
                        {results.processing_stats.errors.map((error, index) => (
                          <div
                            key={index}
                            className="border border-red-200 rounded-lg p-4 bg-red-50"
                          >
                            <span className="text-sm text-red-800">
                              {error}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Close Result
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MappingPreview = ({ responseData, onConfirm, onCancel }) => {
  const [userMappings, setUserMappings] = useState(responseData.mappings);

  const updateMapping = (index, field, value) => {
    const updatedMappings = [...userMappings];
    updatedMappings[index] = {
      ...updatedMappings[index],
      [field]: value,
      ...(field === "target_table" ? { target_column: "" } : {}),
    };
    setUserMappings(updatedMappings);
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

  const getAvailableColumns = (tableName) => {
    if (!tableName || !responseData.expected_schema[tableName]) {
      return [];
    }
    return Object.entries(responseData.expected_schema[tableName]);
  };

  const isMappingsComplete = userMappings.every(
    (mapping) => mapping.target_table && mapping.target_column
  );

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Data Mapping</h1>
      </div>

      <div className="flex h-full">
        <div className="w-1/3 bg-white border-r border-gray-200 p-6 space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Mapping Overview
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 font-bold">1.</span>
                <span>Review AI-generated field mappings</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 font-bold">2.</span>
                <span>Adjust source fields as needed</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 font-bold">3.</span>
                <span>Select target tables and columns</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 font-bold">4.</span>
                <span>Confirm to process your data</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Mapping Guidelines
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-800">Source Field</div>
                <div className="text-sm text-gray-500">
                  Original column from your file
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-800">Target Table</div>
                <div className="text-sm text-gray-500">
                  Destination table in database
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-800">Target Column</div>
                <div className="text-sm text-gray-500">
                  Specific column with data type
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800">
                <strong>Note:</strong> All mappings are required for processing
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Schema Info
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Available Tables:</span>
                <span className="font-medium text-gray-800">
                  {Object.keys(responseData.expected_schema).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Fields:</span>
                <span className="font-medium text-gray-800">
                  {Object.values(responseData.expected_schema).reduce(
                    (total, columns) => total + Object.keys(columns).length,
                    0
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Current Mappings:</span>
                <span className="font-medium text-gray-800">
                  {userMappings.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="max-w-full mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-6 text-gray-900">
                Configure Field Mappings
              </h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-8 py-4 text-left text-sm font-medium text-gray-600 w-1/3">
                          Source Field
                        </th>
                        <th className="px-8 py-4 text-left text-sm font-medium text-gray-600 w-1/3">
                          Target Table
                        </th>
                        <th className="px-8 py-4 text-left text-sm font-medium text-gray-600 w-1/3">
                          Target Column
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {userMappings.map((mapping, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-8 py-6">
                            <input
                              type="text"
                              value={mapping.source_field || ""}
                              onChange={(e) =>
                                updateMapping(
                                  index,
                                  "source_field",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                              disabled
                            />
                          </td>
                          <td className="px-8 py-6">
                            <select
                              value={mapping.target_table || ""}
                              onChange={(e) =>
                                updateMapping(
                                  index,
                                  "target_table",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                            >
                              <option value="">Select table</option>
                              {Object.keys(responseData.expected_schema).map(
                                (table) => (
                                  <option key={table} value={table}>
                                    {table}
                                  </option>
                                )
                              )}
                            </select>
                          </td>
                          <td className="px-8 py-6">
                            <select
                              value={mapping.target_column || ""}
                              onChange={(e) =>
                                updateMapping(
                                  index,
                                  "target_column",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                              disabled={!mapping.target_table}
                            >
                              <option value="">Select column</option>
                              {getAvailableColumns(mapping.target_table).map(
                                ([column, type]) => (
                                  <option
                                    key={column}
                                    value={`${column} (${type})`}
                                  >
                                    {column} ({type})
                                  </option>
                                )
                              )}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-6 text-gray-900">
                Available Database Schema
              </h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Object.entries(responseData.expected_schema).map(
                      ([table, columns]) => (
                        <div
                          key={table}
                          className="border border-gray-300 rounded-lg p-1 bg-gray-50"
                        >
                          <h3 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
                            {table}
                          </h3>
                          <div className="space-y-2">
                            {Object.entries(columns).map(([column, type]) => (
                              <div
                                key={column}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-gray-500 font-mono">
                                  {column}
                                </span>
                                <span className="text-gray-500 text-xs">
                                  {type}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleConfirm}
                disabled={!isMappingsComplete}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                  isMappingsComplete
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Confirm & Process Mappings
              </button>
              <button
                onClick={onCancel}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
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
  const [storageLocation, setStorageLocation] = useState("cloud");
  const fileInputRef = useRef();

  const supportedFiles = [
    { type: "Excel Files", extensions: ".xlsx, .xls" },
    { type: "CSV Files", extensions: ".csv" },
    { type: "PDF Files", extensions: ".pdf" },
    { type: "TSV Files", extensions: ".tsv" },
    { type: "Document Files", extensions: ".docx, .doc" },
  ];

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
      const response = await uploadFile(file, { storageLocation });
      setResponseData(response);
      setShowMappingPreview(true);
    } catch (error) {
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
    try {
      setIsLoading(true);
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
    handleCancel();
  };

  const getFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (showMappingPreview && responseData) {
    return (
      <div className="min-h-screen bg-gray-100">
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <div className="text-gray-700 text-lg font-medium">
                Processing mappings...
              </div>
            </div>
          </div>
        )}
        <MappingPreview
          responseData={responseData}
          onConfirm={handleMappingConfirm}
          onCancel={handleMappingCancel}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <div className="text-gray-700 text-lg font-medium">
              Processing...
            </div>
          </div>
        </div>
      )}

      {showResultsPopup && processingResults && (
        <ResultsPopup
          results={processingResults}
          onClose={handleResultsClose}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          File Upload & Processing
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex h-full">
        {/* Left Panel */}
        <div className="w-1/3 bg-white border-r border-gray-200 p-6 space-y-8">
          {/* Storage Location */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Storage Location
            </h2>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="storage"
                  value="cloud"
                  checked={storageLocation === "cloud"}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <div className="font-medium text-gray-800">Cloud Storage</div>
                  <div className="text-sm text-gray-500">
                    Store file in cloud storage
                  </div>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="storage"
                  value="local"
                  checked={storageLocation === "local"}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <div className="font-medium text-gray-800">Local Storage</div>
                  <div className="text-sm text-gray-500">
                    Store file in local storage
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Supported File Types */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Supported File Types
            </h2>
            <div className="space-y-3">
              {supportedFiles.map((fileType, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-800">
                    {fileType.type}
                  </div>
                  <div className="text-sm text-gray-500">
                    {fileType.extensions}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800">
                <strong>Maximum file size:</strong> 10MB
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - File Upload */}
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold mb-6 text-gray-900">
              Upload Your File
            </h2>

            {/* Upload Area */}
            <div
              onClick={handleUploadClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 bg-white rounded-lg p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200"
            >
              {file ? (
                <div className="space-y-4">
                  <div className="text-4xl text-gray-400">📄</div>
                  <div>
                    <div className="text-lg font-medium text-gray-800">
                      {file.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Size: {getFileSize(file.size)}
                    </div>
                    <div className="text-sm text-blue-600 mt-2">
                      Click to select a different file
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-4xl text-gray-400">📁</div>
                  <div>
                    <div className="text-lg font-medium text-gray-700">
                      Drop your file here or click to browse
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      Select a file from your computer
                    </div>
                  </div>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv,.tsv,.pdf,.docx,.doc"
              className="hidden"
            />

            {file && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <div className="text-sm text-gray-600">
                  <strong>Storage:</strong>{" "}
                  {storageLocation === "cloud"
                    ? "Cloud Storage"
                    : "Local Storage"}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleUpload}
                disabled={!file}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                  file
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {file ? "Upload & Process" : "Select a file first"}
              </button>

              <button
                onClick={handleCancel}
                disabled={!file}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  file
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
