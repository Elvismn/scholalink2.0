// Updated StaffView.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { staffAPI } from '../../services/api';
import { searchData, getSearchableFields } from '../../utils/searchUtils';

const StaffView = ({ searchTerm, searchResults }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Teaching',
    position: '',
    department: '',
    contact: '',
    email: ''
  });

  // Filter staff based on search term
  const filteredStaff = useMemo(() => {
    if (!searchTerm) return staff;
    
    const searchableFields = getSearchableFields('staff');
    return searchData(staff, searchTerm, searchableFields);
  }, [staff, searchTerm]);

  // Fetch all staff
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await staffAPI.getAll();
      setStaff(response.data);
    } catch (err) {
      setError('Failed to fetch staff');
      console.error('Error fetching staff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingStaff) {
        // Update existing staff
        await staffAPI.update(editingStaff._id, formData);
      } else {
        // Create new staff
        await staffAPI.create(formData);
      }

      await fetchStaff(); // Refresh the list
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save staff member');
      console.error('Error saving staff:', err);
    } finally {
      setLoading(false);
    }
  };

  // Edit staff
  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      role: staffMember.role,
      position: staffMember.position || '',
      department: staffMember.department || '',
      contact: staffMember.contact || '',
      email: staffMember.email || ''
    });
    setIsModalOpen(true);
  };

  // Delete staff
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await staffAPI.delete(id);
        await fetchStaff(); // Refresh the list
      } catch (err) {
        setError('Failed to delete staff member');
        console.error('Error deleting staff:', err);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      role: 'Teaching',
      position: '',
      department: '',
      contact: '',
      email: ''
    });
    setEditingStaff(null);
  };

  // Open modal for new staff
  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Use filtered staff for display
  const displayStaff = searchTerm ? filteredStaff : staff;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
          <p className="text-gray-600">
            {searchTerm ? (
              <span>
                Showing {filteredStaff.length} of {staff.length} staff members
                {searchTerm && ` for "${searchTerm}"`}
              </span>
            ) : (
              `Manage staff information and roles`
            )}
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>+ Add New Staff</span>
        </button>
      </div>

      {/* Search Status */}
      {searchTerm && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-blue-700">
                Searching for: <strong>"{searchTerm}"</strong> - Found {filteredStaff.length} results
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && !isModalOpen && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading staff...</p>
        </div>
      )}

      {/* Staff Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayStaff.map((staffMember) => (
            <div key={staffMember._id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{staffMember.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(staffMember)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(staffMember._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span>🎯</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    staffMember.role === 'Teaching' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {staffMember.role}
                  </span>
                </div>
                {staffMember.position && (
                  <div className="flex items-center space-x-2">
                    <span>💼</span>
                    <span>{staffMember.position}</span>
                  </div>
                )}
                {staffMember.department && (
                  <div className="flex items-center space-x-2">
                    <span>🏢</span>
                    <span>{staffMember.department}</span>
                  </div>
                )}
                {staffMember.contact && (
                  <div className="flex items-center space-x-2">
                    <span>📞</span>
                    <span>{staffMember.contact}</span>
                  </div>
                )}
                {staffMember.email && (
                  <div className="flex items-center space-x-2">
                    <span>📧</span>
                    <span>{staffMember.email}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                Created: {new Date(staffMember.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && displayStaff.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👨‍🏫</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No staff members found' : 'No staff members yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? `No staff members found for "${searchTerm}". Try a different search term.`
              : 'Get started by adding your first staff member'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add First Staff
            </button>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingStaff ? 'Edit Staff' : 'Add New Staff'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Teaching">Teaching</option>
                    <option value="Non-Teaching">Non-Teaching</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingStaff ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffView;