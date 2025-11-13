import React from "react";

const Sidebar = ({ models, activeModel, onModelChange }) => {
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">Scholalink 2.0</h2>
        <p className="text-sm text-gray-600">Admin Portal</p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {models.map((model) => (
            <li key={model.id}>
              <button
                onClick={() => onModelChange(model.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeModel === model.id
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{model.icon}</span>
                <span className="font-medium">{model.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;