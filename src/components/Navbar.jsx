import React, { useState } from 'react';

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <nav className="bg-gradient-to-r from-neutral-900 to-neutral-800 sticky top-0 z-50 shadow-lg shadow-black/20 border-b border-green-500/30 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <div className="logo font-bold text-white text-2xl flex items-center transition-all duration-300 hover:scale-105">
          <span className="text-purple-500 text-3xl">&lt;</span>
          <span className="bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">Pass</span>
          <span className="text-purple-500">Vault</span>
          <span className="text-purple-500 text-3xl">/&gt;</span>
        </div>
        
        <div className="flex items-center space-x-4">
     
          <a 
            href="https://github.com/ITSAMARHERE" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-white bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:shadow-green-800/30 hover:scale-105"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="bg-purple-900 rounded-full p-2">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </div>
            <span className={`font-semibold px-4 transition-all duration-300 ${isHovered ? 'pr-5' : ''}`}>GitHub</span>
          </a>
          <button className="md:hidden bg-neutral-800 p-2 rounded-md hover:bg-neutral-700 transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;