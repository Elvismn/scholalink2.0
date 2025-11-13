import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { classroomAPI } from '../../services/api';

const ClassroomsView = () => {
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

  const { getToken } = useAuth();

  const fetchClassrooms = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await classroomAPI.getAll(token);
      setClassrooms(response.data);
    } catch (err) {
      setError('Failed to fetch classrooms');
      console.error('Error fetching classrooms:', err);
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
      const token = await getToken();
      if (editingClassroom) {
        await classroomAPI.update(editingClassroom._id, formData, token);
      } else {
        await classroomAPI.create(formData, token);
      }
      await fetchClassrooms();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save classroom');
      console.error('Error saving classroom:', err);
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
        const token = await getToken();
        await classroomAPI.delete(id, token);
        await fetchClassrooms();
      } catch (err) {
        setError('Failed to delete classroom');
        console.error('Error deleting classroom:', err);
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Classrooms Management</h2>
          <p className="text-gray-600">Manage classroom information and capacity</p>
        </div>
        <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Add New Classroom
        </button>
      </div>

      {error && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>)}

      {loading && !isModalOpen && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading classrooms...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom) => (
            <div key={classroom._id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{classroom.name}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(classroom)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                  <button onClick={() => handleDelete(classroom._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                {classroom.gradeLevel && (
                  <div className="flex items-center space-x-2">
                    <span>📊</span>
                    <span>Grade: {classroom.gradeLevel}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span>👥</span>
                  <span>
                    Students: {classroom.numberOfStudents || 0}
                    {classroom.capacity && ` / ${classroom.capacity} capacity`}
                  </span>
                </div>
                {classroom.classTeacher && (
                  <div className="flex items-center space-x-2">
                    <span>👨‍🏫</span>
                    <span>Teacher: {classroom.classTeacher}</span>
                  </div>
                )}
                {classroom.capacity && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
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

      {!loading && classrooms.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏫</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No classrooms yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first classroom</p>
          <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add First Classroom
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
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