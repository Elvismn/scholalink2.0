import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { stakeholderAPI } from '../../services/api';

const StakeholdersView = () => {
  const [stakeholders, setStakeholders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Distributor',
    contact: '',
    email: '',
    contribution: ''
  });

  const { getToken } = useAuth();

  const fetchStakeholders = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await stakeholderAPI.getAll(token);
      setStakeholders(response.data);
    } catch (err) {
      setError('Failed to fetch stakeholders');
      console.error('Error fetching stakeholders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStakeholders(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getToken();
      if (editingStakeholder) {
        await stakeholderAPI.update(editingStakeholder._id, formData, token);
      } else {
        await stakeholderAPI.create(formData, token);
      }
      await fetchStakeholders();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save stakeholder');
      console.error('Error saving stakeholder:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (stakeholder) => {
    setEditingStakeholder(stakeholder);
    setFormData({
      name: stakeholder.name,
      type: stakeholder.type || 'Distributor',
      contact: stakeholder.contact || '',
      email: stakeholder.email || '',
      contribution: stakeholder.contribution || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this stakeholder?')) {
      try {
        const token = await getToken();
        await stakeholderAPI.delete(id, token);
        await fetchStakeholders();
      } catch (err) {
        setError('Failed to delete stakeholder');
        console.error('Error deleting stakeholder:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      type: 'Distributor', 
      contact: '', 
      email: '', 
      contribution: '' 
    });
    setEditingStakeholder(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Distributor': return 'bg-blue-100 text-blue-800';
      case 'Collaborator': return 'bg-green-100 text-green-800';
      case 'Wellwisher': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Distributor': return '🚚';
      case 'Collaborator': return '🤝';
      case 'Wellwisher': return '💝';
      default: return '🤝';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Stakeholders Management</h2>
          <p className="text-gray-600">Manage school stakeholders and partners</p>
        </div>
        <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Add New Stakeholder
        </button>
      </div>

      {error && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>)}

      {loading && !isModalOpen && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading stakeholders...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stakeholders.map((stakeholder) => (
            <div key={stakeholder._id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{stakeholder.name}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(stakeholder)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                  <button onClick={() => handleDelete(stakeholder._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span>{getTypeIcon(stakeholder.type)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(stakeholder.type)}`}>
                    {stakeholder.type}
                  </span>
                </div>
                {stakeholder.contact && (
                  <div className="flex items-center space-x-2">
                    <span>📞</span>
                    <span>{stakeholder.contact}</span>
                  </div>
                )}
                {stakeholder.email && (
                  <div className="flex items-center space-x-2">
                    <span>📧</span>
                    <span>{stakeholder.email}</span>
                  </div>
                )}
                {stakeholder.contribution && (
                  <div className="flex items-start space-x-2">
                    <span>🎁</span>
                    <span>Contribution: {stakeholder.contribution}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                Created: {new Date(stakeholder.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && stakeholders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🤝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stakeholders yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first stakeholder</p>
          <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add First Stakeholder
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingStakeholder ? 'Edit Stakeholder' : 'Add New Stakeholder'}
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
                    placeholder="Stakeholder's name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Distributor">Distributor</option>
                    <option value="Collaborator">Collaborator</option>
                    <option value="Wellwisher">Wellwisher</option>
                  </select>
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
                    placeholder="Phone number or contact info"
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
                    placeholder="Email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contribution
                  </label>
                  <textarea
                    name="contribution"
                    value={formData.contribution}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe their contribution or support..."
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
                    {loading ? 'Saving...' : (editingStakeholder ? 'Update' : 'Create')}
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

export default StakeholdersView;