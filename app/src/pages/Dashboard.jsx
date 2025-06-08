import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Eye,
  Info,
  X,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  Database,
  AlertCircle,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { dashboardData, getFileData } from "../services/dashboardService";

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("invoices");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedFileDetails, setSelectedFileDetails] = useState(null);

  const getDashboardData = async () => {
    try {
      setDashboardLoading(true);
      const response = await dashboardData();
      setApiData(response);
      setDashboardLoading(false);
    } catch (error) {
      console.error("Data uploading failed:", error);
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const filteredFiles = useMemo(() => {
    if (
      !apiData ||
      !apiData.recent_uploads ||
      !Array.isArray(apiData.recent_uploads)
    ) {
      return [];
    }

    if (!searchTerm.trim()) {
      return apiData.recent_uploads;
    }

    const searchLower = searchTerm.toLowerCase();
    return apiData.recent_uploads.filter(
      (file) =>
        file.filename.toLowerCase().includes(searchLower) ||
        file.status.toLowerCase().includes(searchLower) ||
        file.file_upload_id.toString().includes(searchLower) ||
        file.records_processed.toString().includes(searchLower)
    );
  }, [searchTerm, apiData]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (dashboardLoading || !apiData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const handleViewFile = async (fileId) => {
    setLoading(true);
    setSelectedFile(fileId);
    setActiveTab("invoices");
    const response = await getFileData(fileId);
    setFileData(response);
    setLoading(false);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDetails = async (fileId) => {
    const fileDetails = apiData.recent_uploads.find(
      (file) => file.file_upload_id === fileId
    );
    setSelectedFileDetails(fileDetails);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setSelectedFile(null);
    setFileData(null);
    setActiveTab("invoices");
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedFileDetails(null);
  };

  const getColumns = (data) => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  };

  const renderTable = (data, title) => {
    if (!data || data.length === 0) {
      return (
        <div className="text-gray-500 text-center py-8">
          No data available for {title}
        </div>
      );
    }

    const columns = getColumns(data);

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700"
                >
                  {column.replace(/_/g, " ").toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {columns.map((column, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border border-gray-300 px-4 py-2 text-sm text-gray-600"
                  >
                    {row[column] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const getTabs = () => {
    if (!fileData) return [];

    const tabs = [];
    if (fileData.invoices)
      tabs.push({
        key: "invoices",
        label: "Invoices",
        count: fileData.invoices.length,
      });
    if (fileData.vendors)
      tabs.push({
        key: "vendors",
        label: "Vendors",
        count: fileData.vendors.length,
      });
    if (fileData.customers)
      tabs.push({
        key: "customers",
        label: "Customers",
        count: fileData.customers.length,
      });
    if (fileData.payments)
      tabs.push({
        key: "payments",
        label: "Payments",
        count: fileData.payments.length,
      });
    if (fileData.invoice_items)
      tabs.push({
        key: "invoice_items",
        label: "Invoice Items",
        count: fileData.invoice_items.length,
      });

    return tabs;
  };

  const tabs = getTabs();

  const fileName = apiData.recent_uploads.find(
    (file) => file.file_upload_id === selectedFile
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <p className="text-3xl font-bold text-gray-900">
                  {apiData.total_files_uploaded}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {apiData.completed_processing}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-3xl font-bold text-red-600">
                  {apiData.failed_processing}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Partial Success
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {apiData.partial_files}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Uploaded Files
            </h2>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by filename, status, ID, or records..."
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredFiles.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-lg font-medium">No files found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xxs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Sr. No.
                    </th>
                    <th className="px-6 py-3 text-xxs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Filename
                    </th>
                    <th className="px-6 py-3 text-xxs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xxs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Storage Location
                    </th>
                    <th className="px-6 py-3 text-xxs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Records Processed
                    </th>
                    <th className="px-6 py-3 text-xxs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFiles.map((file, index) => (
                    <tr key={file.file_upload_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {file.filename}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            file.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : file.status === "Partial success"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {file.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {file.storage_location.charAt(0).toUpperCase() +
                          file.storage_location.slice(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {file.records_processed.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <button
                          onClick={() => handleViewFile(file.file_upload_id)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                          title="View File Data"
                        >
                          <Eye className="w-5 h-5 mr-2" />
                        </button>
                        <button
                          onClick={() => handleDetails(file.file_upload_id)}
                          className="text-gray-600 hover:text-gray-900"
                          title="File Details"
                        >
                          <FileText className="w-5 h-5 mr-2 text-blue-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* File Details Modal */}
        {showDetailsModal && selectedFileDetails && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-blue-600" />
                  File Details
                </h3>
                <button
                  onClick={closeDetailsModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Basic Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">File Name:</span>
                        <span className="font-medium">
                          {selectedFileDetails.filename}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">File Type:</span>
                        <span className="font-medium uppercase">
                          {selectedFileDetails.file_type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">File Size:</span>
                        <span className="font-medium">
                          {formatFileSize(selectedFileDetails.file_size)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Storage:</span>
                        <span className="font-medium flex items-center">
                          {selectedFileDetails.storage_location
                            .charAt(0)
                            .toUpperCase() +
                            selectedFileDetails.storage_location.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Upload Information
                    </h4>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Upload Time:</span>
                      <span className="font-medium">
                        {formatDateTime(selectedFileDetails.upload_timestamp)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <Database className="w-4 h-4 mr-2" />
                      Processing Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Records:</span>
                        <span className="font-medium">
                          {selectedFileDetails.total_records_found?.toLocaleString() ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Successful Records:
                        </span>
                        <span className="font-medium text-black">
                          {selectedFileDetails.records_processed?.toLocaleString() ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Failed Records:</span>
                        <span className="font-medium text-black">
                          {selectedFileDetails.failed_records?.toLocaleString() ||
                            0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-3">Status</h4>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Status:</span>
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          selectedFileDetails.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : selectedFileDetails.status === "Partial success"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedFileDetails.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Summary */}
              {selectedFileDetails.error_summary &&
                selectedFileDetails.error_summary.length > 0 && (
                  <div className="mt-6 bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Error Summary
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li className="text-red-600 text-sm">
                        {selectedFileDetails.error_summary}
                      </li>
                    </ul>
                  </div>
                )}

              {/* Unmapped Columns */}
              {selectedFileDetails.unmapped_columns &&
                selectedFileDetails.unmapped_columns.unmapped_fields &&
                selectedFileDetails.unmapped_columns.unmapped_fields.length >
                  0 && (
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Unmapped Columns
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFileDetails.unmapped_columns.unmapped_fields.map(
                        (field, index) => (
                          <span
                            key={index}
                            className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm"
                          >
                            {field}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeDetailsModal}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for file data */}
        {selectedFile && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {fileName?.filename}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-600">
                    Loading file data...
                  </span>
                </div>
              ) : fileData ? (
                <div className="space-y-4">
                  {/* Tab Navigation */}
                  {tabs.length > 0 && (
                    <div className="border-b border-gray-200">
                      <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                          <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                              activeTab === tab.key
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </nav>
                    </div>
                  )}

                  <div className="bg-white rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                    {fileData.invoices &&
                      activeTab === "invoices" &&
                      renderTable(fileData.invoices, "Invoices")}
                    {fileData.vendors &&
                      activeTab === "vendors" &&
                      renderTable(fileData.vendors, "Vendors")}
                    {fileData.customers &&
                      activeTab === "customers" &&
                      renderTable(fileData.customers, "Customers")}
                    {fileData.payments &&
                      activeTab === "payments" &&
                      renderTable(fileData.payments, "Payments")}
                    {fileData.invoice_items &&
                      activeTab === "invoice_items" &&
                      renderTable(fileData.invoice_items, "Invoice Items")}
                  </div>

                  {/* Summary Stats */}
                  {tabs.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                      {tabs.map((tab) => (
                        <div
                          key={tab.key}
                          className="bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="text-xl font-bold text-gray-900">
                            {tab.count}
                          </div>
                          <div className="text-xs text-gray-600">
                            {tab.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No data available for this file.
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
