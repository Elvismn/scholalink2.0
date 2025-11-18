import React, { useState, useEffect, useMemo } from 'react';
import { useClassroomAPI } from '../../services/api';
import { searchData, getSearchableFields } from '../../utils/searchUtils';

const ClassroomsView = ({ searchTerm, searchResults }) => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    gradeLevel: '',
    numberOfStudents: 0,
    classTeacher: '',
    capacity: ''
  });

  const classroomAPI = useClassroomAPI();

  // Filter classrooms based on search term
  const filteredClassrooms = useMemo(() => {
    if (!searchTerm) return classrooms;
    
    const searchableFields = getSearchableFields('classrooms');
    return searchData(classrooms, searchTerm, searchableFields);
  }, [classrooms, searchTerm]);

  // Fetch all classrooms
  const fetchClassrooms = async () => {
    setLoading(true);
    try {
      console.log('🔍 ClassroomsView - Fetching classrooms...');
      const response = await classroomAPI.getAll();
      console.log('✅ ClassroomsView - Classrooms data received:', response.data);
      setClassrooms(response.data);
      setError('');
    } catch (err) {
      console.error('❌ ClassroomsView - Error fetching classrooms:', err);
      setError('Failed to fetch classrooms. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClassrooms(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'numberOfStudents' || name === 'capacity' ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingClassroom) {
        await classroomAPI.update(editingClassroom._id, formData);
      } else {
        await classroomAPI.create(formData);
      }
      
      await fetchClassrooms();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      console.error('❌ ClassroomsView - Error saving classroom:', err);
      setError('Failed to save classroom. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (classroom) => {
    setEditingClassroom(classroom);
    setFormData({
      name: classroom.name,
      gradeLevel: classroom.gradeLevel || '',
      numberOfStudents: classroom.numberOfStudents || 0,
      classTeacher: classroom.classTeacher || '',
      capacity: classroom.capacity || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this classroom?')) {
      try {
        await classroomAPI.delete(id);
        await fetchClassrooms();
      } catch (err) {
        console.error('❌ ClassroomsView - Error deleting classroom:', err);
        setError('Failed to delete classroom. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      gradeLevel: '', 
      numberOfStudents: 0, 
      classTeacher: '', 
      capacity: '' 
    });
    setEditingClassroom(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Use filtered classrooms for display
  const displayClassrooms = searchTerm ? filteredClassrooms : classrooms;

  return (
    <div className="p-4 lg:p-6">
      {/* Header Section - Stack on mobile */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0 mb-6">
        <div className="text-center lg:text-left">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Classrooms Management</h2>
          <p className="text-gray-600 text-sm lg:text-base">
            {searchTerm ? (
              <span>
                Showing {filteredClassrooms.length} of {classrooms.length} classrooms
                {searchTerm && ` for "${searchTerm}"`}
              </span>
            ) : (
              'Manage classroom information and capacity'
            )}
          </p>
        </div>
        <button 
          onClick={openCreateModal} 
          className="touch-button bg-blue-600 text-white px-4 py-3 lg:py-2 rounded-lg hover:bg-blue-700 transition-colors w-full lg:w-auto text-base"
        >
          + Add New Classroom
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
                Searching for: <strong>"{searchTerm}"</strong> - Found {filteredClassrooms.length} results
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
            className="float-right text-red-800 font-bold touch-button"
          >
            ×
          </button>
        </div>
      )}

      {loading && !isModalOpen && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading classrooms...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {displayClassrooms.map((classroom) => (
            <div key={classroom._id} className="bg-white rounded-lg shadow-sm border p-4 lg:p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{classroom.name}</h3>
                <div className="flex space-x-2 flex-shrink-0">
                  <button 
                    onClick={() => handleEdit(classroom)} 
                    className="touch-button text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(classroom._id)} 
                    className="touch-button text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                {classroom.gradeLevel && (
                  <div className="flex items-center space-x-2">
                    <span>📊</span>
                    <span className="truncate">Grade: {classroom.gradeLevel}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span>👥</span>
                  <span className="truncate">
                    Students: {classroom.numberOfStudents || 0}
                    {classroom.capacity && ` / ${classroom.capacity}`}
                  </span>
                </div>
                {classroom.classTeacher && (
                  <div className="flex items-center space-x-2">
                    <span>👨‍🏫</span>
                    <span className="truncate">Teacher: {classroom.classTeacher}</span>
                  </div>
                )}
                {classroom.capacity && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, ((classroom.numberOfStudents || 0) / classroom.capacity) * 100)}%` 
                      }}
                    ></div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                Created: {new Date(classroom.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && displayClassrooms.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏫</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No classrooms found' : 'No classrooms yet'}
          </h3>
          <p className="text-gray-500 mb-4 px-4">
            {searchTerm 
              ? `No classrooms found for "${searchTerm}". Try a different search term.`
              : 'Get started by adding your first classroom'
            }
          </p>
          {!searchTerm && (
            <button 
              onClick={openCreateModal} 
              className="touch-button bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-base"
            >
              Add First Classroom
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
                {editingClassroom ? 'Edit Classroom' : 'Add New Classroom'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Classroom Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    placeholder="e.g., Room 101, Science Lab"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade Level
                  </label>
                  <input
                    type="text"
                    name="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    placeholder="e.g., Grade 5, Form 2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Students
                  </label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={formData.numberOfStudents}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class Teacher
                  </label>
                  <input
                    type="text"
                    name="classTeacher"
                    value={formData.classTeacher}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    placeholder="Teacher's name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    placeholder="Maximum number of students"
                  />
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
                    {loading ? 'Saving...' : (editingClassroom ? 'Update' : 'Create')}
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

export default ClassroomsView;