// Main App component with layout and routing
import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { TradingDashboard } from './components/TradingDashboard';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 text-white">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-800/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent" />
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${10 + Math.random() * 20}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* App Content */}
        <div className="relative z-10">
          <Header 
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            isMobileMenuOpen={isSidebarOpen}
          />
          
          <Sidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          
          <main className="pt-16">
            <TradingDashboard />
          </main>
        </div>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(29, 11, 46, 0.9)',
              color: '#fff',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              backdropFilter: 'blur(10px)'
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff'
              }
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff'
              }
            }
          }}
        />
      </div>
    </AppProvider>
  );
}

export default App;