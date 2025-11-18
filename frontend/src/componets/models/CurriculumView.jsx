import React, { useState, useEffect, useMemo } from 'react';
import { useCurriculumAPI } from '../../services/api'; // CHANGED: Using hook now
import { searchData, getSearchableFields } from '../../utils/searchUtils';

const CurriculumView = ({ searchTerm, searchResults }) => {
  const [curriculums, setCurriculums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCurriculum, setEditingCurriculum] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    academicYear: '',
    subjects: [''],
    description: ''
  });

  // ✅ CHANGED: Use the hook-based API (removed manual token handling)
  const curriculumAPI = useCurriculumAPI();

  // Filter curriculums based on search term
  const filteredCurriculums = useMemo(() => {
    if (!searchTerm) return curriculums;
    
    // Use custom searchable fields that match your actual data structure
    const searchableFields = ['title', 'academicYear', 'subjects', 'description'];
    return searchData(curriculums, searchTerm, searchableFields);
  }, [curriculums, searchTerm]);

  const fetchCurriculums = async () => {
    setLoading(true);
    try {
      console.log('🔍 CurriculumView - Fetching curriculums...');
      const response = await curriculumAPI.getAll();
      console.log('✅ CurriculumView - Curriculums data received:', response.data);
      setCurriculums(response.data);
      setError('');
    } catch (err) {
      console.error('❌ CurriculumView - Error fetching curriculums:', err);
      setError('Failed to fetch curriculums. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCurriculums(); }, []); // ✅ curriculumAPI is stable, so no need to add it to dependencies

  // Debug search with actual field names
  useEffect(() => {
    console.log('🔍 Curriculum Search Debug:', {
      searchTerm,
      curriculumsCount: curriculums.length,
      filteredCount: filteredCurriculums.length,
      sampleCurriculum: curriculums[0] || 'No data',
      searchableFields: ['title', 'academicYear', 'subjects', 'description']
    });
  }, [searchTerm, curriculums, filteredCurriculums]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle subjects array changes
  const handleSubjectChange = (index, value) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index] = value;
    setFormData(prev => ({
      ...prev,
      subjects: newSubjects
    }));
  };

  // Add new subject field
  const addSubjectField = () => {
    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, '']
    }));
  };

  // Remove subject field
  const removeSubjectField = (index) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('💾 CurriculumView - Saving curriculum:', editingCurriculum ? 'update' : 'create');
      
      const dataToSend = {
        ...formData,
        subjects: formData.subjects.filter(subject => subject.trim() !== '')
      };

      if (editingCurriculum) {
        await curriculumAPI.update(editingCurriculum._id, dataToSend);
        console.log('✅ CurriculumView - Curriculum updated successfully');
      } else {
        await curriculumAPI.create(dataToSend);
        console.log('✅ CurriculumView - Curriculum created successfully');
      }
      
      await fetchCurriculums();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      console.error('❌ CurriculumView - Error saving curriculum:', err);
      setError('Failed to save curriculum. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (curriculum) => {
    console.log('✏️ CurriculumView - Editing curriculum:', curriculum._id);
    setEditingCurriculum(curriculum);
    setFormData({
      title: curriculum.title,
      academicYear: curriculum.academicYear,
      subjects: curriculum.subjects && curriculum.subjects.length > 0 ? curriculum.subjects : [''],
      description: curriculum.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this curriculum?')) {
      try {
        console.log('🗑️ CurriculumView - Deleting curriculum:', id);
        await curriculumAPI.delete(id);
        console.log('✅ CurriculumView - Curriculum deleted successfully');
        await fetchCurriculums();
      } catch (err) {
        console.error('❌ CurriculumView - Error deleting curriculum:', err);
        setError('Failed to delete curriculum. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      academicYear: '', 
      subjects: [''], 
      description: '' 
    });
    setEditingCurriculum(null);
  };

  const openCreateModal = () => {
    console.log('➕ CurriculumView - Opening create modal');
    resetForm();
    setIsModalOpen(true);
  };

  // Use filtered curriculums for display
  const displayCurriculums = searchTerm ? filteredCurriculums : curriculums;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Curriculum Management</h2>
          <p className="text-gray-600">
            {searchTerm ? (
              <span>
                Showing {filteredCurriculums.length} of {curriculums.length} curriculums
                {searchTerm && ` for "${searchTerm}"`}
              </span>
            ) : (
              'Manage academic curriculum and subjects'
            )}
          </p>
        </div>
        <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Add New Curriculum
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
                Searching for: <strong>"{searchTerm}"</strong> - Found {filteredCurriculums.length} results
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            onClick={() => setError('')}
            className="float-right text-red-800 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {loading && !isModalOpen && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading curriculums...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCurriculums.map((curriculum) => (
            <div key={curriculum._id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{curriculum.title}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(curriculum)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                  <button onClick={() => handleDelete(curriculum._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span>🎓</span>
                  <span>Academic Year: {curriculum.academicYear}</span>
                </div>
                {curriculum.subjects && curriculum.subjects.length > 0 && (
                  <div className="flex items-start space-x-2">
                    <span>📚</span>
                    <div>
                      <span className="font-medium">Subjects: </span>
                      <ul className="list-disc list-inside mt-1">
                        {curriculum.subjects.map((subject, index) => (
                          <li key={index} className="text-xs">{subject}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {curriculum.description && (
                  <div className="flex items-start space-x-2">
                    <span>📄</span>
                    <span className="text-xs">{curriculum.description}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                Created: {new Date(curriculum.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && displayCurriculums.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No curriculums found' : 'No curriculums yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? `No curriculums found for "${searchTerm}". Try a different search term.`
              : 'Get started by adding your first curriculum'
            }
          </p>
          {!searchTerm && (
            <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Add First Curriculum
            </button>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingCurriculum ? 'Edit Curriculum' : 'Add New Curriculum'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Primary School Curriculum, High School Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Year *
                  </label>
                  <input
                    type="text"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2024-2025"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Subjects
                    </label>
                    <button
                      type="button"
                      onClick={addSubjectField}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      + Add Subject
                    </button>
                  </div>
                  {formData.subjects.map((subject, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => handleSubjectChange(index, e.target.value)}
                        placeholder="Subject name"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formData.subjects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubjectField(index)}
                          className="text-red-600 hover:text-red-800 px-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
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
                    placeholder="Curriculum overview and goals..."
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
                    {loading ? 'Saving...' : (editingCurriculum ? 'Update' : 'Create')}
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

export default CurriculumView;