import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="bg-white p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Scholalink 2.0</h1>
          <p className="text-gray-600 mt-2">School Administration Portal</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none"
            }
          }}
        />
      </div>
    </div>
  );
};

export default Login;