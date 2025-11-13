import React from "react";
import { UserButton, useUser } from "@clerk/clerk-react";

const Sidebar = ({ models, activeModel, onModelChange }) => {
  const { user } = useUser();

  return (
    <div className="w-64 bg-gradient-to-b from-blue-800 to-purple-900 shadow-xl flex flex-col h-screen rounded">
      {/* Header */}
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">S2</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Scholalink 2.0</h2>
            <p className="text-blue-200 text-sm">Admin Portal</p>
          </div>
        </div>
        
        {/* User Info */}
        <div className="flex items-center space-x-3 pt-4 border-t border-blue-700">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8"
              }
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-blue-200 text-xs truncate">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2 px-2">
            Management Modules
          </h3>
          <ul className="space-y-1">
            {models.map((model) => (
              <li key={model.id}>
                <button
                  onClick={() => onModelChange(model.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                    activeModel === model.id
                      ? 'bg-white shadow-lg transform scale-105'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white hover:shadow-md'
                  }`}
                >
                  <span className={`text-xl transition-transform duration-200 group-hover:scale-110 ${
                    activeModel === model.id ? 'text-blue-600' : 'text-blue-300'
                  }`}>
                    {model.icon}
                  </span>
                  <span className={`font-medium text-left ${
                    activeModel === model.id ? 'text-gray-800' : 'text-blue-100'
                  }`}>
                    {model.name}
                  </span>
                  {activeModel === model.id && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Stats Section */}
        <div className="mt-8 p-3 bg-blue-700/30 rounded-lg border border-blue-600/30">
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
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-700">
        <div className="text-center">
          <p className="text-blue-200 text-xs">
            Scholalink 2.0
          </p>
          <p className="text-blue-300 text-xs mt-1">
            School Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;