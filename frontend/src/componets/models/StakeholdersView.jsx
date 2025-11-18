import React, { useState, useEffect, useMemo } from 'react';
import { useStakeholderAPI } from '../../services/api';
import { searchData, getSearchableFields } from '../../utils/searchUtils';

const StakeholdersView = ({ searchTerm, searchResults }) => {
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

  const stakeholderAPI = useStakeholderAPI();

  // Filter stakeholders based on search term
  const filteredStakeholders = useMemo(() => {
    if (!searchTerm) return stakeholders;
    
    const searchableFields = getSearchableFields('stakeholders');
    return searchData(stakeholders, searchTerm, searchableFields);
  }, [stakeholders, searchTerm]);

  // Fetch all stakeholders
  const fetchStakeholders = async () => {
    setLoading(true);
    try {
      console.log('🔍 StakeholdersView - Fetching stakeholders...');
      const response = await stakeholderAPI.getAll();
      console.log('✅ StakeholdersView - Stakeholders data received:', response.data);
      setStakeholders(response.data);
      setError('');
    } catch (err) {
      console.error('❌ StakeholdersView - Error fetching stakeholders:', err);
      setError('Failed to fetch stakeholders. Please check your connection and try again.');
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
      console.log('💾 StakeholdersView - Saving stakeholder:', editingStakeholder ? 'update' : 'create');

      if (editingStakeholder) {
        await stakeholderAPI.update(editingStakeholder._id, formData);
        console.log('✅ StakeholdersView - Stakeholder updated successfully');
      } else {
        await stakeholderAPI.create(formData);
        console.log('✅ StakeholdersView - Stakeholder created successfully');
      }
      
      await fetchStakeholders();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      console.error('❌ StakeholdersView - Error saving stakeholder:', err);
      setError('Failed to save stakeholder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (stakeholder) => {
    console.log('✏️ StakeholdersView - Editing stakeholder:', stakeholder._id);
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
        console.log('🗑️ StakeholdersView - Deleting stakeholder:', id);
        await stakeholderAPI.delete(id);
        console.log('✅ StakeholdersView - Stakeholder deleted successfully');
        await fetchStakeholders();
      } catch (err) {
        console.error('❌ StakeholdersView - Error deleting stakeholder:', err);
        setError('Failed to delete stakeholder. Please try again.');
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
    console.log('➕ StakeholdersView - Opening create modal');
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

  // Use filtered stakeholders for display
  const displayStakeholders = searchTerm ? filteredStakeholders : stakeholders;

  return (
    <div className="p-4 lg:p-6">
      {/* Header Section - Stack on mobile */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0 mb-6">
        <div className="text-center lg:text-left">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Stakeholders Management</h2>
          <p className="text-gray-600 text-sm lg:text-base">
            {searchTerm ? (
              <span>
                Showing {filteredStakeholders.length} of {stakeholders.length} stakeholders
                {searchTerm && ` for "${searchTerm}"`}
              </span>
            ) : (
              'Manage school stakeholders and partners'
            )}
          </p>
        </div>
        <button 
          onClick={openCreateModal} 
          className="touch-button bg-blue-600 text-white px-4 py-3 lg:py-2 rounded-lg hover:bg-blue-700 transition-colors w-full lg:w-auto text-base"
        >
          + Add New Stakeholder
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
                Searching for: <strong>"{searchTerm}"</strong> - Found {filteredStakeholders.length} results
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
          <p className="mt-2 text-gray-600">Loading stakeholders...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {displayStakeholders.map((stakeholder) => (
            <div key={stakeholder._id} className="bg-white rounded-lg shadow-sm border p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{stakeholder.name}</h3>
                <div className="flex space-x-2 flex-shrink-0">
                  <button 
                    onClick={() => handleEdit(stakeholder)} 
                    className="touch-button text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(stakeholder._id)} 
                    className="touch-button text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getTypeIcon(stakeholder.type)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(stakeholder.type)} truncate max-w-[120px]`}>
                    {stakeholder.type}
                  </span>
                </div>
                {stakeholder.contact && (
                  <div className="flex items-center space-x-2">
                    <span>📞</span>
                    <span className="truncate">{stakeholder.contact}</span>
                  </div>
                )}
                {stakeholder.email && (
                  <div className="flex items-center space-x-2">
                    <span>📧</span>
                    <span className="truncate">{stakeholder.email}</span>
                  </div>
                )}
                {stakeholder.contribution && (
                  <div className="flex items-start space-x-2">
                    <span>🎁</span>
                    <span className="text-xs line-clamp-2">Contribution: {stakeholder.contribution}</span>
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

      {!loading && displayStakeholders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🤝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No stakeholders found' : 'No stakeholders yet'}
          </h3>
          <p className="text-gray-500 mb-4 px-4">
            {searchTerm 
              ? `No stakeholders found for "${searchTerm}". Try a different search term.`
              : 'Get started by adding your first stakeholder'
            }
          </p>
          {!searchTerm && (
            <button 
              onClick={openCreateModal} 
              className="touch-button bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-base"
            >
              Add First Stakeholder
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
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
                    className="touch-button px-4 py-3 lg:py-2 text-gray-600 hover:text-gray-800 text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="touch-button bg-blue-600 text-white px-4 py-3 lg:py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-base"
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