import React, { useState, useEffect, useMemo } from 'react';
import { useDepartmentAPI } from '../../services/api';
import { searchData, getSearchableFields } from '../../utils/searchUtils';

const DepartmentsView = ({ searchTerm, searchResults }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    head: '',
    description: '',
    numberOfStaff: 0
  });

  const departmentAPI = useDepartmentAPI();

  // Filter departments based on search term
  const filteredDepartments = useMemo(() => {
    if (!searchTerm) return departments;
    
    const searchableFields = getSearchableFields('departments');
    return searchData(departments, searchTerm, searchableFields);
  }, [departments, searchTerm]);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      console.log('🔍 DepartmentsView - Fetching departments...');
      const response = await departmentAPI.getAll();
      console.log('✅ DepartmentsView - Departments data received:', response.data);
      setDepartments(response.data);
      setError('');
    } catch (err) {
      console.error('❌ DepartmentsView - Error fetching departments:', err);
      setError('Failed to fetch departments. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'numberOfStaff' ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('💾 DepartmentsView - Saving department:', editingDepartment ? 'update' : 'create');

      if (editingDepartment) {
        await departmentAPI.update(editingDepartment._id, formData);
        console.log('✅ DepartmentsView - Department updated successfully');
      } else {
        await departmentAPI.create(formData);
        console.log('✅ DepartmentsView - Department created successfully');
      }
      
      await fetchDepartments();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      console.error('❌ DepartmentsView - Error saving department:', err);
      setError('Failed to save department. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (department) => {
    console.log('✏️ DepartmentsView - Editing department:', department._id);
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      head: department.head || '',
      description: department.description || '',
      numberOfStaff: department.numberOfStaff || 0
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        console.log('🗑️ DepartmentsView - Deleting department:', id);
        await departmentAPI.delete(id);
        console.log('✅ DepartmentsView - Department deleted successfully');
        await fetchDepartments();
      } catch (err) {
        console.error('❌ DepartmentsView - Error deleting department:', err);
        setError('Failed to delete department. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      head: '', 
      description: '', 
      numberOfStaff: 0 
    });
    setEditingDepartment(null);
  };

  const openCreateModal = () => {
    console.log('➕ DepartmentsView - Opening create modal');
    resetForm();
    setIsModalOpen(true);
  };

  // Use filtered departments for display
  const displayDepartments = searchTerm ? filteredDepartments : departments;

  return (
    <div className="p-4 lg:p-6">
      {/* Header Section - Stack on mobile */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0 mb-6">
        <div className="text-center lg:text-left">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Departments Management</h2>
          <p className="text-gray-600 text-sm lg:text-base">
            {searchTerm ? (
              <span>
                Showing {filteredDepartments.length} of {departments.length} departments
                {searchTerm && ` for "${searchTerm}"`}
              </span>
            ) : (
              'Manage academic and administrative departments'
            )}
          </p>
        </div>
        <button 
          onClick={openCreateModal} 
          className="touch-button bg-blue-600 text-white px-4 py-3 lg:py-2 rounded-lg hover:bg-blue-700 transition-colors w-full lg:w-auto text-base"
        >
          + Add New Department
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
              <span className="text-blue-700 text-sm lg:text-base">
                Searching for: <strong>"{searchTerm}"</strong> - Found {filteredDepartments.length} results
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm lg:text-base">
          {error}
          <button 
            onClick={() => setError('')}
            className="float-right text-red-800 font-bold touch-button px-2"
          >
            ×
          </button>
        </div>
      )}

      {loading && !isModalOpen && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading departments...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {displayDepartments.map((department) => (
            <div key={department._id} className="bg-white rounded-lg shadow-sm border p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{department.name}</h3>
                <div className="flex space-x-2 flex-shrink-0">
                  <button 
                    onClick={() => handleEdit(department)} 
                    className="touch-button text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(department._id)} 
                    className="touch-button text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                {department.head && (
                  <div className="flex items-center space-x-2">
                    <span>👨‍💼</span>
                    <span className="truncate">Head: {department.head}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span>👥</span>
                  <span>Staff: {department.numberOfStaff || 0}</span>
                </div>
                {department.description && (
                  <div className="flex items-start space-x-2">
                    <span>📄</span>
                    <span className="text-xs line-clamp-2">{department.description}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                Created: {new Date(department.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && displayDepartments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏢</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No departments found' : 'No departments yet'}
          </h3>
          <p className="text-gray-500 mb-4 px-4">
            {searchTerm 
              ? `No departments found for "${searchTerm}". Try a different search term.`
              : 'Get started by adding your first department'
            }
          </p>
          {!searchTerm && (
            <button 
              onClick={openCreateModal} 
              className="touch-button bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-base"
            >
              Add First Department
            </button>
          )}
        </div>
      )}

      {/* Modal - Full screen on mobile */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 lg:p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingDepartment ? 'Edit Department' : 'Add New Department'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    placeholder="e.g., Mathematics, Science, Administration"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department Head
                  </label>
                  <input
                    type="text"
                    name="head"
                    value={formData.head}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    placeholder="Head of department's name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Staff
                  </label>
                  <input
                    type="number"
                    name="numberOfStaff"
                    value={formData.numberOfStaff}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    placeholder="Department description and responsibilities..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="touch-button px-4 py-3 lg:py-2 text-gray-600 hover:text-gray-800 text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="touch-button bg-blue-600 text-white px-4 py-3 lg:py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-base"
                  >
                    {loading ? 'Saving...' : (editingDepartment ? 'Update' : 'Create')}
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

export default DepartmentsView;