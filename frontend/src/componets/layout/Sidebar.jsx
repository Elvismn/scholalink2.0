import React, { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";

const Sidebar = ({ models, activeModel, onModelChange, isMobileOpen, onMobileClose }) => {
  const { user } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close mobile sidebar when model changes
  useEffect(() => {
    if (isMobileOpen) {
      onMobileClose();
    }
  }, [activeModel]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`
      bg-gradient-to-b from-blue-800 to-purple-900 shadow-xl flex flex-col h-full
      transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16 lg:w-20' : 'w-full lg:w-64'}
      ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      fixed lg:relative z-50
    `}>
      {/* Header */}
      <div className="p-4 border-b border-blue-700">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between lg:justify-start lg:space-x-3'} mb-4`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold text-lg">S2</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white truncate">Scholalink 2.0</h2>
                <p className="text-blue-200 text-sm truncate hidden lg:block">Admin Portal</p>
              </div>
            )}
          </div>
          
          {/* Mobile Close Button */}
          {!isCollapsed && (
            <button
              onClick={onMobileClose}
              className="lg:hidden touch-button p-1 text-blue-200 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* User Info */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} pt-4 border-t border-blue-700`}>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 lg:w-10 lg:h-10"
              }
            }}
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0 hidden lg:block">
              <p className="text-white font-medium text-sm truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-blue-200 text-xs truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4">
          {!isCollapsed && (
            <h3 className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2 px-2 hidden lg:block">
              Management Modules
            </h3>
          )}
          <ul className="space-y-1">
            {models.map((model) => (
              <li key={model.id}>
                <button
                  onClick={() => onModelChange(model.id)}
                  className={`w-full flex items-center touch-button ${
                    isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'
                  } py-3 rounded-lg transition-all duration-200 group ${
                    activeModel === model.id
                      ? 'bg-white shadow-lg transform scale-105'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white hover:shadow-md'
                  }`}
                  title={isCollapsed ? model.name : ''}
                >
                  <span className={`text-xl transition-transform duration-200 group-hover:scale-110 ${
                    activeModel === model.id ? 'text-blue-600' : 'text-blue-300'
                  }`}>
                    {model.icon}
                  </span>
                  {!isCollapsed && (
                    <span className={`font-medium text-left flex-1 text-sm lg:text-base ${
                      activeModel === model.id ? 'text-gray-800' : 'text-blue-100'
                    }`}>
                      {model.name}
                    </span>
                  )}
                  {!isCollapsed && activeModel === model.id && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full hidden lg:block"></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Stats Section - Hidden when collapsed or on mobile */}
        {!isCollapsed && (
          <div className="mt-8 p-3 bg-blue-700/30 rounded-lg border border-blue-600/30 hidden lg:block">
            <h4 className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">
              Quick Stats
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-blue-100 text-sm">
                <span>Total Modules</span>
                <span className="bg-blue-600 px-2 py-1 rounded text-xs font-bold">
                  {models.length}
                </span>
              </div>
              <div className="flex justify-between items-center text-blue-100 text-sm">
                <span>Active</span>
                <span className="bg-green-500 px-2 py-1 rounded text-xs font-bold">
                  {activeModel}
                </span>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Footer with Toggle Button - Hidden on mobile */}
      <div className="p-4 border-t border-blue-700 hidden lg:block">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center space-x-2 text-blue-200 hover:text-white hover:bg-blue-700 py-2 rounded-lg transition-all duration-200 mb-3"
        >
          {isCollapsed ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Collapse</span>
            </>
          )}
        </button>

        {/* Footer Text - Hidden when collapsed */}
        {!isCollapsed && (
          <div className="text-center">
            <p className="text-blue-200 text-xs">
              Scholalink 2.0
            </p>
            <p className="text-blue-300 text-xs mt-1">
              School Management System
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;