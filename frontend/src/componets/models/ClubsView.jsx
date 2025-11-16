import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { clubAPI } from '../../services/api';
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

  const { getToken } = useAuth();

  // Filter clubs based on search term
  const filteredClubs = useMemo(() => {
    if (!searchTerm) return clubs;
    
    const searchableFields = getSearchableFields('clubs');
    return searchData(clubs, searchTerm, searchableFields);
  }, [clubs, searchTerm]);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await clubAPI.getAll(token);
      setClubs(response.data);
    } catch (err) {
      setError('Failed to fetch clubs');
      console.error('Error fetching clubs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClubs(); }, []);

  // Debug search
  useEffect(() => {
    console.log('🔍 Clubs Search Debug:', {
      searchTerm,
      clubsCount: clubs.length,
      filteredCount: filteredClubs.length,
      searchableFields: getSearchableFields('clubs')
    });
  }, [searchTerm, clubs, filteredClubs]);

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
      const token = await getToken();
      const dataToSend = {
        ...formData,
        activities: formData.activities.filter(activity => activity.trim() !== '')
      };

      if (editingClub) {
        await clubAPI.update(editingClub._id, dataToSend, token);
      } else {
        await clubAPI.create(dataToSend, token);
      }
      await fetchClubs();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save club');
      console.error('Error saving club:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (club) => {
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
        const token = await getToken();
        await clubAPI.delete(id, token);
        await fetchClubs();
      } catch (err) {
        setError('Failed to delete club');
        console.error('Error deleting club:', err);
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
    resetForm();
    setIsModalOpen(true);
  };

  // Use filtered clubs for display
  const displayClubs = searchTerm ? filteredClubs : clubs;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Clubs Management</h2>
          <p className="text-gray-600">
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
        <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
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
              <span className="text-blue-700">
                Searching for: <strong>"{searchTerm}"</strong> - Found {filteredClubs.length} results
              </span>
            </div>
          </div>
        </div>
      )}

      {error && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>)}

      {loading && !isModalOpen && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading clubs...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayClubs.map((club) => (
            <div key={club._id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{club.name}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(club)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                  <button onClick={() => handleDelete(club._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                {club.patron && (
                  <div className="flex items-center space-x-2">
                    <span>👨‍🏫</span>
                    <span>Patron: {club.patron}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span>👥</span>
                  <span>Members: {club.membersCount || 0}</span>
                </div>
                {club.activities && club.activities.length > 0 && (
                  <div className="flex items-start space-x-2">
                    <span>⚽</span>
                    <div>
                      <span className="font-medium">Activities: </span>
                      <ul className="list-disc list-inside mt-1">
                        {club.activities.map((activity, index) => (
                          <li key={index} className="text-xs">{activity}</li>
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
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? `No clubs found for "${searchTerm}". Try a different search term.`
              : 'Get started by adding your first club'
            }
          </p>
          {!searchTerm && (
            <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Add First Club
            </button>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="text-sm text-blue-600 hover:text-blue-800"
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
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formData.activities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeActivityField(index)}
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