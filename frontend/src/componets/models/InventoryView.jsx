import React, { useState, useEffect, useMemo } from 'react';
import { useInventoryAPI } from '../../services/api'; // CHANGED: Using hook now
import { searchData, getSearchableFields } from '../../utils/searchUtils';

const InventoryView = ({ searchTerm, searchResults }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'General',
    quantity: 1,
    condition: 'Good'
  });

  // ✅ CHANGED: Use the hook-based API (removed manual token handling)
  const inventoryAPI = useInventoryAPI();

  // Filter inventory based on search term
  const filteredInventory = useMemo(() => {
    if (!searchTerm) return inventory;
    
    const searchableFields = getSearchableFields('inventory');
    return searchData(inventory, searchTerm, searchableFields);
  }, [inventory, searchTerm]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      console.log('🔍 InventoryView - Fetching inventory...');
      const response = await inventoryAPI.getAll();
      console.log('✅ InventoryView - Inventory data received:', response.data);
      setInventory(response.data);
      setError('');
    } catch (err) {
      console.error('❌ InventoryView - Error fetching inventory:', err);
      setError('Failed to fetch inventory. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchInventory(); 
  }, []); // ✅ inventoryAPI is stable, so no need to add it to dependencies

  // Debug search
  useEffect(() => {
    console.log('🔍 Inventory Search Debug:', {
      searchTerm,
      inventoryCount: inventory.length,
      filteredCount: filteredInventory.length,
      searchableFields: getSearchableFields('inventory')
    });
  }, [searchTerm, inventory, filteredInventory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'quantity' ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('💾 InventoryView - Saving inventory item:', editingItem ? 'update' : 'create');

      if (editingItem) {
        await inventoryAPI.update(editingItem._id, formData);
        console.log('✅ InventoryView - Inventory item updated successfully');
      } else {
        await inventoryAPI.create(formData);
        console.log('✅ InventoryView - Inventory item created successfully');
      }
      
      await fetchInventory();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      console.error('❌ InventoryView - Error saving inventory item:', err);
      setError('Failed to save inventory item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    console.log('✏️ InventoryView - Editing inventory item:', item._id);
    setEditingItem(item);
    setFormData({
      itemName: item.itemName,
      category: item.category || 'General',
      quantity: item.quantity || 1,
      condition: item.condition || 'Good'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      try {
        console.log('🗑️ InventoryView - Deleting inventory item:', id);
        await inventoryAPI.delete(id);
        console.log('✅ InventoryView - Inventory item deleted successfully');
        await fetchInventory();
      } catch (err) {
        console.error('❌ InventoryView - Error deleting inventory item:', err);
        setError('Failed to delete inventory item. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      itemName: '', 
      category: 'General', 
      quantity: 1, 
      condition: 'Good' 
    });
    setEditingItem(null);
  };

  const openCreateModal = () => {
    console.log('➕ InventoryView - Opening create modal');
    resetForm();
    setIsModalOpen(true);
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Fair': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-orange-100 text-orange-800';
      case 'Broken': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Library': return '📚';
      case 'Lab': return '🔬';
      case 'General': return '📦';
      default: return '📦';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Use filtered inventory for display
  const displayInventory = searchTerm ? filteredInventory : inventory;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
          <p className="text-gray-600">
            {searchTerm ? (
              <span>
                Showing {filteredInventory.length} of {inventory.length} items
                {searchTerm && ` for "${searchTerm}"`}
              </span>
            ) : (
              'Manage school equipment and resources'
            )}
          </p>
        </div>
        <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Add New Item
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
                Searching for: <strong>"{searchTerm}"</strong> - Found {filteredInventory.length} results
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
          <p className="mt-2 text-gray-600">Loading inventory...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayInventory.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{item.itemName}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span>{getCategoryIcon(item.category)}</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🔄</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getConditionColor(item.condition)}`}>
                    {item.condition}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🔢</span>
                  <span>Quantity: {item.quantity}</span>
                </div>
                {item.lastChecked && (
                  <div className="flex items-center space-x-2">
                    <span>📅</span>
                    <span>Last Checked: {formatDate(item.lastChecked)}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                Created: {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && displayInventory.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No inventory items found' : 'No inventory items yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? `No inventory items found for "${searchTerm}". Try a different search term.`
              : 'Get started by adding your first inventory item'
            }
          </p>
          {!searchTerm && (
            <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Add First Item
            </button>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Microscope, Textbook, Chair"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Library">Library</option>
                    <option value="Lab">Lab</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                    <option value="Broken">Broken</option>
                  </select>
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
                    {loading ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
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

export default InventoryView;