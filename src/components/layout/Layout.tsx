import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow mt-16 pb-10">
        <Outlet />
      </main>
      <footer className="bg-dark-900 border-t border-dark-800 py-6">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm">V</div>
                <span className="text-lg font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">Voice AI</span>
              </div>
            </div>
            <div className="text-dark-400 text-sm">
              © {new Date().getFullYear()} pzhiq. 保留所有权利。
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 