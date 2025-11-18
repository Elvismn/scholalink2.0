import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Dashboard from './pages/dashboards/Dashboard';
import Login from './pages/auth/Login';
import './App.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AppContent() {
  return (
    <Router>
      <div className="app-container min-h-screen">
        <Routes>
          {/* Public route - accessible when signed out */}
          <Route 
            path="/login" 
            element={
              <>
                <SignedIn>
                  <Navigate to="/" replace />
                </SignedIn>
                <SignedOut>
                  <Login />
                </SignedOut>
              </>
            } 
          />
          
          {/* Protected dashboard route */}
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
          
          {/* Dashboard specific route */}
          <Route
            path="/dashboard"
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      routerPush={(to) => window.location.assign(to)}
      routerReplace={(to) => window.location.replace(to)}
    >
      <AppContent />
    </ClerkProvider>
  );
}

export default App;