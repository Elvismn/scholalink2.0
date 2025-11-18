import React, { useState, useEffect, useMemo } from 'react';
import { useCourseAPI } from '../../services/api'; // CHANGED: Using hook now
import { searchData, getSearchableFields } from '../../utils/searchUtils';

const CoursesView = ({ searchTerm, searchResults }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    instructor: '',
    code: '',
    description: '',
    department: ''
  });

  // ✅ CHANGED: Use the hook-based API (removed manual token handling)
  const courseAPI = useCourseAPI();

  // Filter courses based on search term
  const filteredCourses = useMemo(() => {
    if (!searchTerm) return courses;
    
    const searchableFields = getSearchableFields('courses');
    return searchData(courses, searchTerm, searchableFields);
  }, [courses, searchTerm]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      console.log('🔍 CoursesView - Fetching courses...');
      const response = await courseAPI.getAll();
      console.log('✅ CoursesView - Courses data received:', response.data);
      setCourses(response.data);
      setError('');
    } catch (err) {
      console.error('❌ CoursesView - Error fetching courses:', err);
      setError('Failed to fetch courses. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []); // ✅ courseAPI is stable, so no need to add it to dependencies

  // Debug search
  useEffect(() => {
    console.log('🔍 Courses Search Debug:', {
      searchTerm,
      coursesCount: courses.length,
      filteredCount: filteredCourses.length,
      searchableFields: getSearchableFields('courses')
    });
  }, [searchTerm, courses, filteredCourses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('💾 CoursesView - Saving course:', editingCourse ? 'update' : 'create');

      if (editingCourse) {
        await courseAPI.update(editingCourse._id, formData);
        console.log('✅ CoursesView - Course updated successfully');
      } else {
        await courseAPI.create(formData);
        console.log('✅ CoursesView - Course created successfully');
      }
      
      await fetchCourses();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      console.error('❌ CoursesView - Error saving course:', err);
      setError('Failed to save course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    console.log('✏️ CoursesView - Editing course:', course._id);
    setEditingCourse(course);
    setFormData({
      name: course.name,
      instructor: course.instructor,
      code: course.code,
      description: course.description || '',
      department: course.department || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        console.log('🗑️ CoursesView - Deleting course:', id);
        await courseAPI.delete(id);
        console.log('✅ CoursesView - Course deleted successfully');
        await fetchCourses();
      } catch (err) {
        console.error('❌ CoursesView - Error deleting course:', err);
        setError('Failed to delete course. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      instructor: '', 
      code: '', 
      description: '', 
      department: '' 
    });
    setEditingCourse(null);
  };

  const openCreateModal = () => {
    console.log('➕ CoursesView - Opening create modal');
    resetForm();
    setIsModalOpen(true);
  };

  // Use filtered courses for display
  const displayCourses = searchTerm ? filteredCourses : courses;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Courses Management</h2>
          <p className="text-gray-600">
            {searchTerm ? (
              <span>
                Showing {filteredCourses.length} of {courses.length} courses
                {searchTerm && ` for "${searchTerm}"`}
              </span>
            ) : (
              'Manage academic courses and instructors'
            )}
          </p>
        </div>
        <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Add New Course
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
                Searching for: <strong>"{searchTerm}"</strong> - Found {filteredCourses.length} results
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
          <p className="mt-2 text-gray-600">Loading courses...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCourses.map((course) => (
            <div key={course._id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(course)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                  <button onClick={() => handleDelete(course._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span>📝</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{course.code}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>👨‍🏫</span>
                  <span>Instructor: {course.instructor}</span>
                </div>
                {course.department && (
                  <div className="flex items-center space-x-2">
                    <span>🏢</span>
                    <span>Department: {course.department}</span>
                  </div>
                )}
                {course.description && (
                  <div className="flex items-start space-x-2">
                    <span>📄</span>
                    <span className="text-xs">{course.description}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                Created: {new Date(course.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && displayCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No courses found' : 'No courses yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? `No courses found for "${searchTerm}". Try a different search term.`
              : 'Get started by adding your first course'
            }
          </p>
          {!searchTerm && (
            <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Add First Course
            </button>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Name *
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
                    Instructor *
                  </label>
                  <input 
                    type="text" 
                    name="instructor" 
                    value={formData.instructor} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Instructor's full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Code *
                  </label>
                  <input 
                    type="text" 
                    name="code" 
                    value={formData.code} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="e.g., MATH101, CS201"
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
                    placeholder="e.g., Mathematics, Computer Science"
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
                    placeholder="Course description and objectives..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => { setIsModalOpen(false); resetForm(); }} 
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingCourse ? 'Update' : 'Create')}
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

export default CoursesView;