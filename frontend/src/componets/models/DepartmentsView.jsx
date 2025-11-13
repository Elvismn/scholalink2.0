import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { departmentAPI } from '../../services/api';

const DepartmentsView = () => {
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

  const { getToken } = useAuth();

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await departmentAPI.getAll(token);
      setDepartments(response.data);
    } catch (err) {
      setError('Failed to fetch departments');
      console.error('Error fetching departments:', err);
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
      const token = await getToken();
      if (editingDepartment) {
        await departmentAPI.update(editingDepartment._id, formData, token);
      } else {
        await departmentAPI.create(formData, token);
      }
      await fetchDepartments();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save department');
      console.error('Error saving department:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (department) => {
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
        const token = await getToken();
        await departmentAPI.delete(id, token);
        await fetchDepartments();
      } catch (err) {
        setError('Failed to delete department');
        console.error('Error deleting department:', err);
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
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Departments Management</h2>
          <p className="text-gray-600">Manage academic and administrative departments</p>
        </div>
        <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Add New Department
        </button>
      </div>

      {error && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>)}

      {loading && !isModalOpen && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading departments...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => (
            <div key={department._id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{department.name}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(department)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                  <button onClick={() => handleDelete(department._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                {department.head && (
                  <div className="flex items-center space-x-2">
                    <span>👨‍💼</span>
                    <span>Head: {department.head}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span>👥</span>
                  <span>Staff: {department.numberOfStaff || 0}</span>
                </div>
                {department.description && (
                  <div className="flex items-start space-x-2">
                    <span>📄</span>
                    <span className="text-xs">{department.description}</span>
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

      {!loading && departments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏢</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No departments yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first department</p>
          <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add First Department
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
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