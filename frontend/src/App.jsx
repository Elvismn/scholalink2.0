import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Dashboard from './pages/dashboards/Dashboard';
import Login from './pages/auth/Login';
import './App.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;


function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route
              path="/"
              element={
                <>
                  <SignedIn>
                    <Dashboard />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            
            {/* Catch all redirect */}
            <Route path="*" element={<RedirectToSignIn />} />
          </Routes>
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;