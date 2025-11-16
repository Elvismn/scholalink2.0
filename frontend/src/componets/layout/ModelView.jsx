// Updated ModelView.jsx
import React from 'react';
import ParentsView from '../models/ParentsView';
import StaffView from '../models/StaffView';
import CoursesView from '../models/CoursesView';
import ClassroomsView from '../models/ClassroomsView';
import ClubsView from '../models/ClubsView';
import DepartmentsView from '../models/DepartmentsView';
import StakeholdersView from '../models/StakeholdersView';
import InventoryView from '../models/InventoryView';
import CurriculumView from '../models/CurriculumView';
import StudentsView from '../models/StudentsView';

const ModelView = ({ model, searchTerm, searchResults }) => {
  const renderModelContent = () => {
    const commonProps = {
      searchTerm: searchTerm,
      searchResults: searchResults
    };

    switch (model) {
      case 'parents': return <ParentsView {...commonProps} />;
      case 'students': return <StudentsView {...commonProps} />;
      case 'staff': return <StaffView {...commonProps} />;
      case 'courses': return <CoursesView {...commonProps} />;
      case 'classrooms': return <ClassroomsView {...commonProps} />;
      case 'clubs': return <ClubsView {...commonProps} />;
      case 'departments': return <DepartmentsView {...commonProps} />;
      case 'stakeholders': return <StakeholdersView {...commonProps} />;
      case 'inventory': return <InventoryView {...commonProps} />;
      case 'curriculum': return <CurriculumView {...commonProps} />;
      default: return (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-600">
            Select a module from the sidebar to get started
          </h3>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {renderModelContent()}
    </div>
  );
};

export default ModelView;