import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { courseAPI } from '../../services/api';

const CoursesView = () => {
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

  const { getToken } = useAuth();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await courseAPI.getAll(token);
      setCourses(response.data);
    } catch (err) {
      setError('Failed to fetch courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getToken();
      if (editingCourse) {
        await courseAPI.update(editingCourse._id, formData, token);
      } else {
        await courseAPI.create(formData, token);
      }
      await fetchCourses();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save course');
      console.error('Error saving course:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
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
        const token = await getToken();
        await courseAPI.delete(id, token);
        await fetchCourses();
      } catch (err) {
        setError('Failed to delete course');
        console.error('Error deleting course:', err);
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
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Courses Management</h2>
          <p className="text-gray-600">Manage academic courses and instructors</p>
        </div>
        <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Add New Course
        </button>
      </div>

      {error && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>)}

      {loading && !isModalOpen && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading courses...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
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

      {!loading && courses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first course</p>
          <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add First Course</button>
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