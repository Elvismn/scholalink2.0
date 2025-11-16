// src/utils/searchUtils.js
export const searchData = (data, searchTerm, searchableFields) => {
  if (!searchTerm || !searchTerm.trim()) return data;

  const lowercasedTerm = searchTerm.toLowerCase().trim();
  
  return data.filter(item => {
    return searchableFields.some(field => {
      const value = getNestedValue(item, field);
      if (value === null || value === undefined) return false;
      
      // Convert to string and search
      return value.toString().toLowerCase().includes(lowercasedTerm);
    });
  });
};

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

// Field configurations for each model
export const getSearchableFields = (model) => {
  const fieldConfigs = {
    students: ['firstName', 'lastName', 'studentId', 'grade', 'parentName', 'parentEmail', 'status'],
    staff: ['name', 'role', 'position', 'department', 'email', 'contact'],
    parents: ['name', 'contact', 'email', 'address', 'children'],
    courses: ['name', 'code', 'description', 'instructor'],
    classrooms: ['name', 'gradeLevel', 'classTeacher'],
    departments: ['name', 'head', 'description'],
    clubs: ['name', 'advisor', 'description'],
    inventory: ['name', 'category', 'description'],
    stakeholders: ['name', 'type', 'contact', 'email'],
    curriculum: ['name', 'gradeLevel', 'subject']
  };

  return fieldConfigs[model] || [];
};

// Advanced filtering utilities
export const filterData = (data, filters) => {
  return data.filter(item => {
    return Object.entries(filters).every(([field, filterValue]) => {
      if (!filterValue) return true;
      
      const itemValue = getNestedValue(item, field);
      
      if (Array.isArray(filterValue)) {
        return filterValue.includes(itemValue);
      }
      
      if (typeof filterValue === 'object' && filterValue.min !== undefined) {
        return itemValue >= filterValue.min && itemValue <= filterValue.max;
      }
      
      return itemValue === filterValue;
    });
  });
};

// Highlight search term in text
export const highlightText = (text, searchTerm) => {
  if (!searchTerm || !text) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.toString().replace(regex, '<mark class="bg-yellow-200">$1</mark>');
};