import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Dashboard from './pages/dashboards/Dashboard';
import Login from './pages/auth/Login';
import { useAuthSetup } from './hooks/useAuthSetup'; // ✅ ADD THIS IMPORT
import './App.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Creating a wrapper component to handle auth setup
function AppContent() {
  // ✅ Setting up authentication - this runs when auth state changes
  useAuthSetup();
  
  return (
    <Router>
      <div className="app-container min-h-screen">
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
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <AppContent />
    </ClerkProvider>
  );
}

export default App;