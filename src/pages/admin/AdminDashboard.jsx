import React, { useState, useEffect } from "react";
import { courtAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    status: "available",
    openingHour: "08:00",
    closingHour: "22:00",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await courtAPI.getAllCourts();
      setCourts(response.data);
    } catch (err) {
      setError("Failed to fetch courts");
      console.error("Error fetching courts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("status", formData.status);
      submitData.append("openingHour", formData.openingHour);
      submitData.append("closingHour", formData.closingHour);

      if (selectedFile) {
        submitData.append("image", selectedFile);
      }

      if (editingCourt) {
        const response = await courtAPI.updateCourt(
          editingCourt._id,
          submitData
        );
        console.log("Update response:", response.data);
      } else {
        const response = await courtAPI.createCourt(submitData);
        console.log("Create response:", response.data);
      }

      await fetchCourts();
      setShowForm(false);
      setEditingCourt(null);
      setSelectedFile(null);
      setPreviewImage("");
      setFormData({
        name: "",
        status: "available",
        openingHour: "08:00",
        closingHour: "22:00",
      });
    } catch (err) {
      console.error("Error saving court:", err);
      setError(
        editingCourt ? "Failed to update court" : "Failed to create court"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (court) => {
    setEditingCourt(court);
    setFormData({
      name: court.name,
      status: court.status,
      openingHour: court.openingHour,
      closingHour: court.closingHour,
    });
    setPreviewImage(court.image || "");
    setSelectedFile(null);
    setShowForm(true);
  };

  const handleDelete = async (courtId) => {
    if (window.confirm("Are you sure you want to delete this court?")) {
      try {
        await courtAPI.deleteCourt(courtId);
        await fetchCourts();
      } catch (err) {
        setError("Failed to delete court");
        console.error("Error deleting court:", err);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewImage("");
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCourt(null);
    setSelectedFile(null);
    setPreviewImage("");
    setFormData({
      name: "",
      status: "available",
      openingHour: "08:00",
      closingHour: "22:00",
    });
  };

  if (loading && courts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4M7 7h10M7 10h10M7 13h10"
                  ></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Courts
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {courts.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Available</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {
                    courts.filter((court) => court.status === "available")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z"
                  ></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Maintenance</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {
                    courts.filter((court) => court.status === "maintenance")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Closed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {courts.filter((court) => court.status === "closed").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Manage Courts</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Add New Court
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingCourt ? "Edit Court" : "Add New Court"}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Court Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter court name"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="available">Available</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Court Image
                    </label>

                    <div className="mb-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {(selectedFile || previewImage) && (
                          <button
                            type="button"
                            onClick={clearImage}
                            className="px-3 py-2 text-sm text-red-600 hover:text-red-800"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    {previewImage && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preview
                        </label>
                        <div className="relative w-full h-48 border-2 border-gray-300 border-dashed rounded-lg overflow-hidden">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div
                            className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500"
                            style={{ display: "none" }}
                          >
                            <div className="text-center">
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <p className="mt-1 text-sm">
                                Failed to load image
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opening Hour
                      </label>
                      <input
                        type="time"
                        name="openingHour"
                        value={formData.openingHour}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Closing Hour
                      </label>
                      <input
                        type="time"
                        name="closingHour"
                        value={formData.closingHour}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                    >
                      {loading
                        ? "Saving..."
                        : editingCourt
                        ? "Update"
                        : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {courts.map((court) => (
              <li key={court._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {court.image ? (
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={court.image}
                            alt={court.name}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            <svg
                              className="h-6 w-6 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4M7 7h10M7 10h10M7 13h10"
                              ></path>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {court.name}
                          </p>
                          <span
                            className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              court.status === "available"
                                ? "bg-green-100 text-green-800"
                                : court.status === "maintenance"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {court.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Hours: {court.openingHour} - {court.closingHour}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(court)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(court._id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {courts.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4M7 7h10M7 10h10M7 13h10"
              ></path>
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No courts found
            </h3>
            <p className="mt-2 text-gray-500">
              Get started by creating your first court.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Add New Court
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
