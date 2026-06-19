"use client";

import React, { useState } from 'react';
import { LayoutDashboard, Users, Settings, LogOut, FileSpreadsheet } from 'lucide-react';

export default function AdminPage() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadCSV = () => {
    setIsDownloading(true);
    
    // Connects directly to your Python AI Server on Port 8000!
    // Make sure your Python server is running and Port 8000 is Public.
    const pythonUrl = "https://fuzzy-zebra-5g44gqqwxvvqcpg4p-8000.app.github.dev/api/admin/export/csv";
    
    // Opens the download stream in a background tab
    window.open(pythonUrl, "_blank");
    
    setTimeout(() => setIsDownloading(false), 1000);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#111] border-r border-gray-800 p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-yellow-500 mb-10 tracking-wider">MEZBAAN</h1>
        <nav className="flex-1 space-y-4">
          <a href="#" className="flex items-center gap-3 text-yellow-500 bg-yellow-500/10 p-3 rounded-lg">
            <LayoutDashboard size={20}/> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white p-3">
            <Users size={20}/> Staff
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white p-3">
            <Settings size={20}/> Settings
          </a>
        </nav>
        <a href="/login" className="flex items-center gap-3 text-red-400 hover:text-red-300 p-3 mt-auto">
          <LogOut size={20}/> Logout
        </a>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-8 border-b border-gray-800 bg-[#0d0d0d]">
          <div>
            <h2 className="text-3xl font-bold">Restaurant Dashboard</h2>
            <p className="text-gray-400 mt-1">Live overview of your tables and bookings</p>
          </div>
          
          {/* 🚀 THE MAGIC BUTTON */}
          <button 
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(202,138,4,0.3)]"
          >
            <FileSpreadsheet size={20} />
            {isDownloading ? "Generating..." : "Export Live CSV"}
          </button>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl">
              <h3 className="text-gray-400 font-medium">Total Bookings Today</h3>
              <p className="text-4xl font-bold mt-2 text-white">24</p>
            </div>
            <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl">
              <h3 className="text-gray-400 font-medium">Active Tables</h3>
              <p className="text-4xl font-bold mt-2 text-green-400">8 / 15</p>
            </div>
            <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl">
              <h3 className="text-gray-400 font-medium">Daily Revenue</h3>
              <p className="text-4xl font-bold mt-2 text-yellow-500">$1,240</p>
            </div>
          </div>

          {/* Table Map Placeholder */}
          <h3 className="text-xl font-bold mb-4">Live Table Map</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((table) => (
              <div key={table} className={`p-6 rounded-xl border flex flex-col items-center justify-center h-32 ${table % 3 === 0 ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}>
                <Users size={24} className="mb-2 opacity-80" />
                <span className="font-bold">Table {table}</span>
                <span className="text-xs mt-1">{table % 3 === 0 ? 'OCCUPIED' : 'FREE'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
