import React from 'react';
import { Leaf, Sprout } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-emerald-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-100 p-1.5 rounded-lg">
             <Leaf className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">AgroDetect</h1>
        </div>
        <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-flex items-center text-emerald-100 text-sm font-medium">
                <Sprout className="w-4 h-4 mr-1" />
                AI Plant Doctor
            </span>
        </div>
      </div>
    </header>
  );
};

export default Header;