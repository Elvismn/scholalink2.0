import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Scholalink 2.0</h1>
          <p className="text-gray-600 mt-2 text-sm lg:text-base">School Administration Portal</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "shadow-none w-full",
              header: "text-center",
              headerTitle: "text-xl lg:text-2xl",
              headerSubtitle: "text-sm lg:text-base",
              formButton: "touch-button py-3 lg:py-2 text-base",
              formFieldInput: "py-3 lg:py-2 text-base",
              footerActionLink: "text-sm lg:text-base"
            }
          }}
        />
      </div>
    </div>
  );
};

export default Login;