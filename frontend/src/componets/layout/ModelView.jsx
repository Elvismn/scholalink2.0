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
const ModelView = ({ model }) => {
  const renderModelContent = () => {
    switch (model) {
      case 'parents': return <ParentsView />;
      case 'students': return <StudentsView/>
      case 'staff': return <StaffView />;
      case 'courses': return <CoursesView />;
      case 'classrooms': return <ClassroomsView />;
      case 'clubs': return <ClubsView />;
      case 'departments': return <DepartmentsView />;
      case 'stakeholders': return <StakeholdersView />;
      case 'inventory': return <InventoryView />;
      case 'curriculum': return <CurriculumView />;
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