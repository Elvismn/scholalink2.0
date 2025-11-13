import React, { useState } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import Sidebar from '../../componets/layout/Sidebar';
import ModelView from '../../componets/layout/ModelView';

const Dashboard = () => {
  const [activeModel, setActiveModel] = useState('parents');
  const { user } = useUser();

  const models = [
    { id: 'parents', name: 'Parents', icon: '👨‍👩‍👧‍👦' },
    { id: 'students', name: 'Students', icon: '🎓' },
    { id: 'staff', name: 'Staff', icon: '👨‍🏫' },
    { id: 'courses', name: 'Courses', icon: '📚' },
    { id: 'classrooms', name: 'Classrooms', icon: '🏫' },
    { id: 'departments', name: 'Departments', icon: '🏢' },
    { id: 'clubs', name: 'Clubs', icon: '⚽' },
    { id: 'inventory', name: 'Inventory', icon: '📦' },
    { id: 'stakeholders', name: 'Stakeholders', icon: '🤝' },
    { id: 'curriculum', name: 'Curriculum', icon: '📋' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        models={models} 
        activeModel={activeModel} 
        onModelChange={setActiveModel} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex justify-between items-center px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {models.find(m => m.id === activeModel)?.name || 'Dashboard'}
              </h1>
              <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <UserButton afterSignOutUrl="/login" />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <ModelView model={activeModel} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;