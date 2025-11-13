import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { parentAPI } from '../../services/api';

const ParentsView = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    address: '',
    children: ['']
  });

  const { getToken } = useAuth();

  // Fetch all parents
  const fetchParents = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await parentAPI.getAll(token);
      setParents(response.data);
    } catch (err) {
      setError('Failed to fetch parents');
      console.error('Error fetching parents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle children array changes
  const handleChildChange = (index, value) => {
    const newChildren = [...formData.children];
    newChildren[index] = value;
    setFormData(prev => ({
      ...prev,
      children: newChildren
    }));
  };

  // Add new child field
  const addChildField = () => {
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, '']
    }));
  };

  // Remove child field
  const removeChildField = (index) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index)
    }));
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = await getToken();
      const dataToSend = {
        ...formData,
        children: formData.children.filter(child => child.trim() !== '')
      };

      if (editingParent) {
        // Update existing parent
        await parentAPI.update(editingParent._id, dataToSend, token);
      } else {
        // Create new parent
        await parentAPI.create(dataToSend, token);
      }

      await fetchParents(); // Refresh the list
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save parent');
      console.error('Error saving parent:', err);
    } finally {
      setLoading(false);
    }
  };

  // Edit parent
  const handleEdit = (parent) => {
    setEditingParent(parent);
    setFormData({
      name: parent.name,
      contact: parent.contact,
      email: parent.email || '',
      address: parent.address || '',
      children: parent.children && parent.children.length > 0 ? parent.children : ['']
    });
    setIsModalOpen(true);
  };

  // Delete parent
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this parent?')) {
      try {
        const token = await getToken();
        await parentAPI.delete(id, token);
        await fetchParents(); // Refresh the list
      } catch (err) {
        setError('Failed to delete parent');
        console.error('Error deleting parent:', err);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      contact: '',
      email: '',
      address: '',
      children: ['']
    });
    setEditingParent(null);
  };

  // Open modal for new parent
  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Parents Management</h2>
          <p className="text-gray-600">Manage parent information and contacts</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>+ Add New Parent</span>
        </button>
      </div>

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
          <p className="mt-2 text-gray-600">Loading parents...</p>
        </div>
      )}

      {/* Parents Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parents.map((parent) => (
            <div key={parent._id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{parent.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(parent)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(parent._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>{parent.contact}</span>
                </div>
                {parent.email && (
                  <div className="flex items-center space-x-2">
                    <span>📧</span>
                    <span>{parent.email}</span>
                  </div>
                )}
                {parent.address && (
                  <div className="flex items-center space-x-2">
                    <span>🏠</span>
                    <span>{parent.address}</span>
                  </div>
                )}
                {parent.children && parent.children.length > 0 && (
                  <div className="flex items-start space-x-2">
                    <span>👨‍👧‍👦</span>
                    <div>
                      <span className="font-medium">Children: </span>
                      {parent.children.join(', ')}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                Created: {new Date(parent.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && parents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👨‍👩‍👧‍👦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No parents yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first parent</p>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add First Parent
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingParent ? 'Edit Parent' : 'Add New Parent'}
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
                    Contact *
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    required
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Children
                    </label>
                    <button
                      type="button"
                      onClick={addChildField}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      + Add Child
                    </button>
                  </div>
                  {formData.children.map((child, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={child}
                        onChange={(e) => handleChildChange(index, e.target.value)}
                        placeholder="Child's name"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formData.children.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeChildField(index)}
                          className="text-red-600 hover:text-red-800 px-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
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
                    {loading ? 'Saving...' : (editingParent ? 'Update' : 'Create')}
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

export default ParentsView;