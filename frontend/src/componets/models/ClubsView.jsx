import React, { useState, useEffect, useMemo } from 'react';
import { useClubAPI } from '../../services/api';
import { searchData, getSearchableFields } from '../../utils/searchUtils';

const ClubsView = ({ searchTerm, searchResults }) => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    patron: '',
    membersCount: 0,
    activities: ['']
  });

  const clubAPI = useClubAPI();

  // Filter clubs based on search term
  const filteredClubs = useMemo(() => {
    if (!searchTerm) return clubs;
    
    const searchableFields = getSearchableFields('clubs');
    return searchData(clubs, searchTerm, searchableFields);
  }, [clubs, searchTerm]);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      console.log('🔍 ClubsView - Fetching clubs...');
      const response = await clubAPI.getAll();
      console.log('✅ ClubsView - Clubs data received:', response.data);
      setClubs(response.data);
      setError('');
    } catch (err) {
      console.error('❌ ClubsView - Error fetching clubs:', err);
      setError('Failed to fetch clubs. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClubs(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'membersCount' ? Number(value) : value 
    }));
  };

  // Handle activities array changes
  const handleActivityChange = (index, value) => {
    const newActivities = [...formData.activities];
    newActivities[index] = value;
    setFormData(prev => ({
      ...prev,
      activities: newActivities
    }));
  };

  // Add new activity field
  const addActivityField = () => {
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, '']
    }));
  };

  // Remove activity field
  const removeActivityField = (index) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('💾 ClubsView - Saving club:', editingClub ? 'update' : 'create');
      
      const dataToSend = {
        ...formData,
        activities: formData.activities.filter(activity => activity.trim() !== '')
      };

      if (editingClub) {
        await clubAPI.update(editingClub._id, dataToSend);
        console.log('✅ ClubsView - Club updated successfully');
      } else {
        await clubAPI.create(dataToSend);
        console.log('✅ ClubsView - Club created successfully');
      }
      
      await fetchClubs();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      console.error('❌ ClubsView - Error saving club:', err);
      setError('Failed to save club. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (club) => {
    console.log('✏️ ClubsView - Editing club:', club._id);
    setEditingClub(club);
    setFormData({
      name: club.name,
      patron: club.patron || '',
      membersCount: club.membersCount || 0,
      activities: club.activities && club.activities.length > 0 ? club.activities : ['']
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this club?')) {
      try {
        console.log('🗑️ ClubsView - Deleting club:', id);
        await clubAPI.delete(id);
        console.log('✅ ClubsView - Club deleted successfully');
        await fetchClubs();
      } catch (err) {
        console.error('❌ ClubsView - Error deleting club:', err);
        setError('Failed to delete club. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      patron: '', 
      membersCount: 0, 
      activities: [''] 
    });
    setEditingClub(null);
  };

  const openCreateModal = () => {
    console.log('➕ ClubsView - Opening create modal');
    resetForm();
    setIsModalOpen(true);
  };

  // Use filtered clubs for display
  const displayClubs = searchTerm ? filteredClubs : clubs;

  return (
    <div className="p-4 lg:p-6">
      {/* Header Section - Stack on mobile */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0 mb-6">
        <div className="text-center lg:text-left">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Clubs Management</h2>
          <p className="text-gray-600 text-sm lg:text-base">
            {searchTerm ? (
              <span>
                Showing {filteredClubs.length} of {clubs.length} clubs
                {searchTerm && ` for "${searchTerm}"`}
              </span>
            ) : (
              'Manage student clubs and activities'
            )}
          </p>
        </div>
        <button 
          onClick={openCreateModal} 
          className="touch-button bg-blue-600 text-white px-4 py-3 lg:py-2 rounded-lg hover:bg-blue-700 transition-colors w-full lg:w-auto text-base"
        >
          + Add New Club
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
                Searching for: <strong>"{searchTerm}"</strong> - Found {filteredClubs.length} results
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
          <p className="mt-2 text-gray-600">Loading clubs...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {displayClubs.map((club) => (
            <div key={club._id} className="bg-white rounded-lg shadow-sm border p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{club.name}</h3>
                <div className="flex space-x-2 flex-shrink-0">
                  <button 
                    onClick={() => handleEdit(club)} 
                    className="touch-button text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(club._id)} 
                    className="touch-button text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                {club.patron && (
                  <div className="flex items-center space-x-2">
                    <span>👨‍🏫</span>
                    <span className="truncate">Patron: {club.patron}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span>👥</span>
                  <span>Members: {club.membersCount || 0}</span>
                </div>
                {club.activities && club.activities.length > 0 && (
                  <div className="flex items-start space-x-2">
                    <span>⚽</span>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium">Activities: </span>
                      <ul className="list-disc list-inside mt-1">
                        {club.activities.map((activity, index) => (
                          <li key={index} className="text-xs truncate">{activity}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                Created: {new Date(club.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && displayClubs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">⚽</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No clubs found' : 'No clubs yet'}
          </h3>
          <p className="text-gray-500 mb-4 px-4">
            {searchTerm 
              ? `No clubs found for "${searchTerm}". Try a different search term.`
              : 'Get started by adding your first club'
            }
          </p>
          {!searchTerm && (
            <button 
              onClick={openCreateModal} 
              className="touch-button bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-base"
            >
              Add First Club
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
                {editingClub ? 'Edit Club' : 'Add New Club'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Club Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    placeholder="e.g., Science Club, Football Club"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patron
                  </label>
                  <input
                    type="text"
                    name="patron"
                    value={formData.patron}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    placeholder="Teacher/Staff in charge"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Members
                  </label>
                  <input
                    type="number"
                    name="membersCount"
                    value={formData.membersCount}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Activities
                    </label>
                    <button
                      type="button"
                      onClick={addActivityField}
                      className="touch-button text-sm text-blue-600 hover:text-blue-800 px-2 py-1"
                    >
                      + Add Activity
                    </button>
                  </div>
                  {formData.activities.map((activity, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={activity}
                        onChange={(e) => handleActivityChange(index, e.target.value)}
                        placeholder="Club activity or event"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      />
                      {formData.activities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeActivityField(index)}
                          className="touch-button text-red-600 hover:text-red-800 px-3 py-1"
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
                    className="touch-button px-4 py-3 lg:py-2 text-gray-600 hover:text-gray-800 text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="touch-button bg-blue-600 text-white px-4 py-3 lg:py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-base"
                  >
                    {loading ? 'Saving...' : (editingClub ? 'Update' : 'Create')}
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

export default ClubsView;