// Updated Dashboard.jsx with mobile optimizations
import React, { useState, useMemo } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import Sidebar from '../../componets/layout/Sidebar';
import ModelView from '../../componets/layout/ModelView';
import GlobalSearch from '../../componets/search/GlobalSearch';

const Dashboard = () => {
  const [activeModel, setActiveModel] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleModelChange = (model) => {
    setActiveModel(model);
    clearSearch();
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleMobileClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-app-background app-content relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fadeIn"
          onClick={handleMobileClose}
        />
      )}
      
      {/* Sidebar with Mobile Animation */}
      <Sidebar 
        models={models} 
        activeModel={activeModel} 
        onModelChange={handleModelChange}
        isMobileOpen={isSidebarOpen}
        onMobileClose={handleMobileClose}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0 w-full">
        {/* Premium Header - Mobile Optimized */}
        <header className="bg-white/80 backdrop-blur-glass border-b border-gray-200/50 shadow-sm mobile-optimized">
          <div className="px-4 lg:px-8 py-4 lg:py-5">
            {/* Top Row - Mobile Header */}
            <div className="flex justify-between items-center mb-4">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden touch-button p-2 rounded-lg bg-premium-blue/10 hover:bg-premium-blue/20 transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6 text-premium-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Title - Centered on mobile */}
              <div className="flex-1 lg:flex-none text-center lg:text-left">
                <h1 className="text-xl lg:text-3xl font-bold bg-gradient-to-r from-premium-blue to-premium-purple bg-clip-text text-transparent">
                  {models.find(m => m.id === activeModel)?.name || 'Dashboard'}
                </h1>
                <p className="text-gray-600 mt-1 flex items-center justify-center lg:justify-start text-sm lg:text-base">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  {getGreeting()}, {user?.firstName}!
                </p>
              </div>

              {/* User Info - Hidden on mobile, visible on desktop */}
              <div className="hidden lg:flex items-center space-x-4">
                <div className="text-right">
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

              {/* Mobile User Button */}
              <div className="lg:hidden">
                <UserButton 
                  afterSignOutUrl="/login"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 border-2 border-premium-blue/20"
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Global Search Bar - Stack on mobile */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
              <div className="w-full lg:flex-1">
                <GlobalSearch 
                  onSearchResults={handleSearchResults}
                  onSearchChange={handleSearchChange}
                  currentModel={activeModel}
                />
              </div>
              
              {/* Search Status */}
              {searchTerm && (
                <div className="flex items-center justify-between lg:justify-start space-x-2">
                  <span className="text-sm text-gray-600 flex-shrink-0">
                    Searching: "{searchTerm}"
                  </span>
                  <button
                    onClick={clearSearch}
                    className="touch-button text-gray-400 hover:text-gray-600 transition-colors p-1"
                    aria-label="Clear search"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Premium Main Content Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-8 slide-in-right">
          <div className="max-w-7xl mx-auto">
            <ModelView 
              model={activeModel} 
              searchTerm={searchTerm}
              searchResults={searchResults}
            />
          </div>
        </main>

        {/* Premium Footer - Simplified on mobile */}
        <footer className="bg-white/60 backdrop-blur-glass border-t border-gray-200/50 py-3 lg:py-4 px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center text-sm text-gray-600 space-y-2 lg:space-y-0">
            <div className="flex items-center space-x-4 mobile-text-center">
              <span className="font-semibold">Scholalink 2.0</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">School Management System</span>
            </div>
            <div className="flex items-center">
              <span>{new Date().getFullYear()} © All rights reserved</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;