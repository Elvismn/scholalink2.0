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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex h-screen bg-app-background app-content">
      {/* Sidebar */}
      <Sidebar 
        models={models} 
        activeModel={activeModel} 
        onModelChange={setActiveModel} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0">
        {/* Premium Header */}
        <header className="bg-white/80 backdrop-blur-glass border-b border-gray-200/50 shadow-sm">
          <div className="flex justify-between items-center px-8 py-5">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-premium-blue to-premium-purple bg-clip-text text-transparent">
                {models.find(m => m.id === activeModel)?.name || 'Dashboard'}
              </h1>
              <p className="text-gray-600 mt-1 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                {getGreeting()}, {user?.firstName}! Ready to manage your school?
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="relative">
                <UserButton 
                  afterSignOutUrl="/login"
                  appearance={{
                    elements: {
                      avatarBox: "w-12 h-12 border-2 border-premium-blue/20 hover:border-premium-blue/40 transition-all duration-300"
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Premium Main Content Area */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            <ModelView model={activeModel} />
          </div>
        </main>

        {/* Premium Footer */}
        <footer className="bg-white/60 backdrop-blur-glass border-t border-gray-200/50 py-4 px-8">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Scholalink 2.0</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">School Management System</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>{new Date().getFullYear()} © All rights reserved</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;