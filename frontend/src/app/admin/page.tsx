"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Package, 
  Bot, 
  Users, 
  Menu, 
  X, 
  Bell, 
  Search,
  Plus,
  Filter,
  AlertTriangle,
  CheckCircle2,
  MoreVertical,
  Trash2,
  Edit,
  Clock,
  User,
  Download,
  Send,
  Sparkles,
  TrendingUp,
  UserPlus,
  Briefcase,
  Activity,
  FileSpreadsheet
} from 'lucide-react';

// --- MOCK DATA FOR INVENTORY ---
const initialInventory = [
  { id: 1, name: 'Basmati Rice', category: 'Raw Material', quantity: 65, unit: 'kg', threshold: 20 },
  { id: 2, name: 'Chicken (Whole)', category: 'Raw Material', quantity: 8, unit: 'kg', threshold: 15 }, 
  { id: 3, name: 'Paneer', category: 'Raw Material', quantity: 12, unit: 'kg', threshold: 5 },
  { id: 4, name: 'Special Biryani Masala', category: 'Spices', quantity: 1.5, unit: 'kg', threshold: 2 }, 
  { id: 5, name: 'Onions', category: 'Vegetables', quantity: 40, unit: 'kg', threshold: 10 },
];

// --- MOCK DATA FOR TABLES ---
const initialTables = [
  { id: 1, number: 'T-01', capacity: 4, status: 'free', time: null },
  { id: 2, number: 'T-02', capacity: 2, status: 'occupied', time: '45 mins' },
  { id: 3, number: 'T-03', capacity: 6, status: 'reserved', time: 'In 30 mins' },
  { id: 4, number: 'T-04', capacity: 4, status: 'free', time: null },
  { id: 5, number: 'T-05', capacity: 8, status: 'occupied', time: '1 hr 10 mins' },
  { id: 6, number: 'T-06', capacity: 2, status: 'free', time: null },
  { id: 7, number: 'T-07', capacity: 4, status: 'reserved', time: 'In 2 hrs' },
  { id: 8, number: 'T-08', capacity: 4, status: 'free', time: null },
];

// --- MOCK DATA FOR STAFF ---
const initialStaff = [
  { id: 1, name: "Ramesh Kumar", role: "Head Chef", status: "Active", shift: "Morning (08:00 AM - 04:00 PM)", phone: "+91 98765 43210" },
  { id: 2, name: "Priya Sharma", role: "Sous Chef", status: "Active", shift: "Evening (04:00 PM - 12:00 AM)", phone: "+91 87654 32109" },
  { id: 3, name: "Amit Patel", role: "Senior Waiter", status: "Active", shift: "Morning (08:00 AM - 04:00 PM)", phone: "+91 76543 21098" },
  { id: 4, name: "Sunita Reddy", role: "Manager", status: "Break", shift: "Full Day (11:00 AM - 11:00 PM)", phone: "+91 65432 10987" },
  { id: 5, name: "Vikram Singh", role: "Cashier", status: "Offline", shift: "Evening (04:00 PM - 12:00 AM)", phone: "+91 54321 09876" }
];

export default function AdminDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Inventory State
  const [inventory, setInventory] = useState(initialInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'Raw Material', quantity: '', unit: 'kg', threshold: '' });

  // Tables State
  const [tables, setTables] = useState(initialTables);

  // Staff State
  const [staffList, setStaffList] = useState(initialStaff);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: 'Waiter', shift: 'Morning (08:00 AM - 04:00 PM)', phone: '', status: 'Active' });

  // AI Chat State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'gemini', text: "Namaste! I'm your Mezbaan Admin Assistant. How can I assist you with your restaurant operations today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportFormat, setExportFormat] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Rules of Hooks compliance check: NO return statements occur above any hook declaration!
  if (!isMounted) return null; 

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const itemToAdd = {
      id: inventory.length + 1,
      name: newItem.name,
      category: newItem.category,
      quantity: Number(newItem.quantity),
      unit: newItem.unit,
      threshold: Number(newItem.threshold)
    };
    setInventory([itemToAdd, ...inventory]);
    setIsAddModalOpen(false);
    setNewItem({ name: '', category: 'Raw Material', quantity: '', unit: 'kg', threshold: '' });
  };

  const deleteItem = (id: number) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const staffToAdd = {
      id: staffList.length + 1,
      name: newStaff.name,
      role: newStaff.role,
      shift: newStaff.shift,
      phone: newStaff.phone,
      status: newStaff.status
    };
    setStaffList([...staffList, staffToAdd]);
    setIsStaffModalOpen(false);
    setNewStaff({ name: '', role: 'Waiter', shift: 'Morning (08:00 AM - 04:00 PM)', phone: '', status: 'Active' });
  };

  const deleteStaff = (id: number) => {
    setStaffList(staffList.filter(s => s.id !== id));
  };

  const toggleStaffStatus = (id: number) => {
    const statusCycle: Record<string, string> = { 'Active': 'Break', 'Break': 'Offline', 'Offline': 'Active' };
    setStaffList(staffList.map(s => s.id === id ? { ...s, status: statusCycle[s.status] || 'Active' } : s));
  };

  const handleTableStatusChange = (id: number, newStatus: string) => {
    setTables(tables.map(table => 
      table.id === id ? { ...table, status: newStatus, time: newStatus === 'free' ? null : 'Just now' } : table
    ));
  };

  const triggerDataExport = (format: string) => {
    setExportFormat(format);
    setIsExporting(true);
    setExportProgress(0);

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
          }, 1000);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleSendChatMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const query = customText || chatInput;
    if (!query.trim()) return;

    setChatMessages(prev => [...prev, { sender: 'user', text: query }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "I have scanned the system database. Let me help you with that.";
      const lowerQuery = query.toLowerCase();

      if (lowerQuery.includes('popular') || lowerQuery.includes('dish') || lowerQuery.includes('performance')) {
        replyText = "Based on our PostgreSQL records, 'Special Chicken Biryani' and 'Paneer Butter Masala' accounted for 64% of today's customer order volume. I recommend prepping an extra 5kg of Paneer and 10kg of Chicken before the dinner peak.";
      } else if (lowerQuery.includes('stock') || lowerQuery.includes('alert') || lowerQuery.includes('inventory')) {
        replyText = `We currently have 2 items flagged as Low Stock:
        • Chicken Whole: Only 8 kg remaining (Minimum Alert: 15 kg)
        • Special Biryani Masala: Only 1.5 kg remaining (Minimum Alert: 2 kg)
        I have prepared a draft order to email your local vendor. Shall I send it?`;
      } else if (lowerQuery.includes('staff') || lowerQuery.includes('employee') || lowerQuery.includes('shifts')) {
        replyText = `Staff Shift Update:
        • Head Chef Ramesh and Amit Patel (Senior Waiter) are currently on site.
        • Priya Sharma and Vikram Singh are scheduled for the evening shift starting at 04:00 PM.
        • Sunita Reddy is currently on a scheduled break.`;
      } else {
        replyText = "I've processed your data request. The Mezbaan ecosystem is perfectly balanced at the moment. Total revenue projected for tonight based on current reservations is ₹42,500.";
      }

      setChatMessages(prev => [...prev, { sender: 'gemini', text: replyText }]);
      setIsTyping(false);
    }, 1200);
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = inventory.filter(item => item.quantity <= item.threshold).length;
  const freeTables = tables.filter(t => t.status === 'free').length;
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const reservedTables = tables.filter(t => t.status === 'reserved').length;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-6 bg-black/40 border border-white/5 rounded-xl">
                <div className="flex justify-between">
                  <h3 className="text-gray-400 text-sm font-medium">Daily Revenue</h3>
                  <TrendingUp className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold text-white mt-2">₹42,500</p>
                <span className="text-xs text-green-500 font-medium">+14% from yesterday</span>
              </div>
              <div className="p-6 bg-black/40 border border-white/5 rounded-xl">
                <div className="flex justify-between">
                  <h3 className="text-gray-400 text-sm font-medium">Table Occupancy</h3>
                  <UtensilsCrossed className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold text-white mt-2">{((occupiedTables / tables.length) * 100).toFixed(0)}%</p>
                <span className="text-xs text-gray-500">{occupiedTables} Active tables live</span>
              </div>
              <div className="p-6 bg-black/40 border border-white/5 rounded-xl">
                <div className="flex justify-between">
                  <h3 className="text-gray-400 text-sm font-medium">Staff Attendance</h3>
                  <Users className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold text-white mt-2">{staffList.filter(s => s.status === 'Active').length} / {staffList.length}</p>
                <span className="text-xs text-green-500">Adequate kitchen support</span>
              </div>
              <div className="p-6 bg-black/40 border border-white/5 rounded-xl">
                <div className="flex justify-between">
                  <h3 className="text-gray-400 text-sm font-medium">Critical Stock Alerts</h3>
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-3xl font-bold text-red-500 mt-2">{lowStockCount}</p>
                <span className="text-xs text-red-400 font-medium">{lowStockCount > 0 ? "Reorder recommended" : "Stock fully optimized"}</span>
              </div>
            </div>

            {/* Quick Analytics & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 bg-black/40 border border-white/5 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-4">Stock Utilization Map</h3>
                <div className="space-y-4">
                  {inventory.map(item => {
                    const ratio = Math.min((item.quantity / 100) * 100, 100);
                    const isLow = item.quantity <= item.threshold;
                    return (
                      <div key={item.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300 font-medium">{item.name}</span>
                          <span className={`font-semibold ${isLow ? 'text-red-400' : 'text-gray-400'}`}>{item.quantity} {item.unit}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${isLow ? 'bg-red-500' : 'bg-yellow-600'}`}
                            style={{ width: `${ratio}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="p-6 bg-black/40 border border-white/5 rounded-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Gemini AI Daily Briefing</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    "Overall efficiency is up by 12% today. Table T-05 has been occupied the longest (1hr 10m). Inventory levels are stable for evening operations except for Raw Chicken and Biryani Masala. Consider ordering immediately to prevent menu closures."
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> Powered by Gemini Flash
                  </span>
                  <button 
                    onClick={() => setActiveTab('ai')}
                    className="text-xs bg-yellow-600/10 hover:bg-yellow-600/20 text-yellow-500 border border-yellow-600/20 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Open AI Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'tables':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-6 bg-black/40 border border-white/5 rounded-xl">
                <h3 className="text-gray-400 text-sm font-medium">Total Tables</h3>
                <p className="text-3xl font-bold text-white mt-2">{tables.length}</p>
              </div>
              <div className="p-6 bg-green-900/20 border border-green-500/20 rounded-xl">
                <h3 className="text-green-400 text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Free
                </h3>
                <p className="text-3xl font-bold text-green-500 mt-2">{freeTables}</p>
              </div>
              <div className="p-6 bg-red-900/20 border border-red-500/20 rounded-xl">
                <h3 className="text-red-400 text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" /> Occupied
                </h3>
                <p className="text-3xl font-bold text-red-500 mt-2">{occupiedTables}</p>
              </div>
              <div className="p-6 bg-yellow-900/20 border border-yellow-500/20 rounded-xl">
                <h3 className="text-yellow-400 text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Reserved
                </h3>
                <p className="text-3xl font-bold text-yellow-500 mt-2">{reservedTables}</p>
              </div>
            </div>

            <div className="p-6 bg-black/40 border border-white/5 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Live Floor Plan</h2>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> Free</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> Occupied</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Reserved</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {tables.map((table) => (
                  <div 
                    key={table.id}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center min-h-[140px] shadow-lg group
                      ${table.status === 'free' ? 'bg-green-950/20 border-green-500/30 hover:border-green-500 shadow-green-900/20' : ''}
                      ${table.status === 'occupied' ? 'bg-red-950/20 border-red-500/30 hover:border-red-500 shadow-red-900/20' : ''}
                      ${table.status === 'reserved' ? 'bg-yellow-950/20 border-yellow-500/30 hover:border-yellow-500 shadow-yellow-900/20' : ''}
                    `}
                  >
                    <div className="absolute top-2 right-2 text-xs font-bold text-gray-500 bg-black/50 px-2 py-1 rounded-md">
                      {table.capacity} Seats
                    </div>
                    
                    <h3 className={`text-2xl font-bold mb-1 
                      ${table.status === 'free' ? 'text-green-400' : ''}
                      ${table.status === 'occupied' ? 'text-red-400' : ''}
                      ${table.status === 'reserved' ? 'text-yellow-400' : ''}
                    `}>
                      {table.number}
                    </h3>
                    
                    {table.time && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                        <Clock className="w-3 h-3" /> {table.time}
                      </div>
                    )}

                    {/* Quick Action Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      {table.status !== 'free' && (
                        <button onClick={() => handleTableStatusChange(table.id, 'free')} className="text-xs bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg border border-green-500/50 hover:bg-green-500 hover:text-black transition-colors w-24">
                          Mark Free
                        </button>
                      )}
                      {table.status !== 'occupied' && (
                        <button onClick={() => handleTableStatusChange(table.id, 'occupied')} className="text-xs bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg border border-red-500/50 hover:bg-red-500 hover:text-white transition-colors w-24">
                          Walk-in
                        </button>
                      )}
                      {table.status !== 'reserved' && (
                        <button onClick={() => handleTableStatusChange(table.id, 'reserved')} className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-lg border border-yellow-500/50 hover:bg-yellow-500 hover:text-black transition-colors w-24">
                          Reserve
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'inventory':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-black/40 border border-white/5 rounded-xl">
                <h3 className="text-gray-400 text-sm font-medium">Total Unique Items</h3>
                <p className="text-3xl font-bold text-white mt-2">{inventory.length}</p>
              </div>
              <div className="p-6 bg-red-900/20 border border-red-500/20 rounded-xl">
                <h3 className="text-red-400 text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Low Stock Alerts
                </h3>
                <p className="text-3xl font-bold text-red-500 mt-2">{lowStockCount}</p>
              </div>
              <div className="p-6 bg-green-900/20 border border-green-500/20 rounded-xl">
                <h3 className="text-green-400 text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Healthy Stock
                </h3>
                <p className="text-3xl font-bold text-green-500 mt-2">{inventory.length - lowStockCount}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-black/40 p-4 border border-white/5 rounded-xl">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search ingredients..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/50 border border-gray-800 rounded-lg text-white focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all"
                />
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700 w-full sm:w-auto">
                  <Filter className="w-4 h-4" /> Filter
                </button>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-semibold rounded-lg transition-colors w-full sm:w-auto shadow-[0_0_15px_rgba(202,138,4,0.3)]"
                >
                  <Plus className="w-5 h-5" /> Add Material
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-white/5 rounded-xl bg-black/20">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/60 border-b border-white/5 text-sm text-gray-400">
                    <th className="p-4 font-medium">Item Name</th>
                    <th className="p-4 font-medium">Category</th>
                    <th className="p-4 font-medium">Current Stock</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => {
                    const isLow = item.quantity <= item.threshold;
                    return (
                      <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 text-white font-medium">{item.name}</td>
                        <td className="p-4 text-gray-400">
                          <span className="px-2 py-1 bg-gray-800 rounded-md text-xs">{item.category}</span>
                        </td>
                        <td className="p-4">
                          <span className={`font-bold ${isLow ? 'text-red-400' : 'text-white'}`}>
                            {item.quantity} {item.unit}
                          </span>
                          <span className="text-gray-500 text-xs ml-2">(Min: {item.threshold})</span>
                        </td>
                        <td className="p-4">
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-xs font-medium">
                              <AlertTriangle className="w-3 h-3" /> Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md text-xs font-medium">
                              <CheckCircle2 className="w-3 h-3" /> In Stock
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteItem(item.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredInventory.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        No materials found. Adjust your search or add a new item.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'ai':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px] animate-in fade-in duration-500">
            {/* AI Assistant Chat Interface */}
            <div className="lg:col-span-2 bg-black/40 border border-white/5 rounded-xl flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-black/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-600/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Mezbaan Gemini Host</h3>
                    <p className="text-xs text-green-500">AI Assistant Online</p>
                  </div>
                </div>
              </div>

              {/* Chat Log */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed 
                      ${msg.sender === 'user' 
                        ? 'bg-yellow-600 text-black font-medium rounded-tr-none' 
                        : 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/5 text-gray-400 rounded-xl rounded-tl-none px-4 py-3 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendChatMessage} className="p-4 border-t border-white/5 flex gap-2">
                <input 
                  type="text"
                  placeholder="Ask Gemini about inventory, staff shifts, or dish sales..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-black/60 border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500 transition-colors"
                />
                <button type="submit" className="px-4 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-black font-semibold rounded-lg transition-colors flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* AI Control & Prompt Suggestions */}
            <div className="space-y-4">
              <div className="p-6 bg-black/40 border border-white/5 rounded-xl">
                <h4 className="font-bold text-white text-sm mb-3">Quick Operational Prompts</h4>
                <div className="space-y-2">
                  <button 
                    onClick={(e) => handleSendChatMessage(undefined, "Analyze raw material consumption and low stock patterns")}
                    className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 border border-white/5 transition-all"
                  >
                    📈 "Analyze stock consumption"
                  </button>
                  <button 
                    onClick={(e) => handleSendChatMessage(undefined, "List active staff members and shift timings")}
                    className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 border border-white/5 transition-all"
                  >
                    👥 "Who is on shift right now?"
                  </button>
                  <button 
                    onClick={(e) => handleSendChatMessage(undefined, "What are the most popular menu items today?")}
                    className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 border border-white/5 transition-all"
                  >
                    🔥 "What is the best performing dish?"
                  </button>
                </div>
              </div>

              <div className="p-6 bg-black/40 border border-white/5 rounded-xl">
                <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-1">
                  <Activity className="w-4 h-4 text-green-500" /> Database Integration
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  The AI is safely sandboxed on Python FastAPI. All table structures and real-time inputs are synced via PostgreSQL read-replicas, preventing any direct modification of production databases during queries.
                </p>
              </div>
            </div>
          </div>
        );
      case 'staff':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Staff Headers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-gray-400 text-sm font-medium">On-Duty Staff</h3>
                  <p className="text-3xl font-bold text-white mt-2">{staffList.filter(s => s.status === 'Active').length}</p>
                </div>
                <Briefcase className="w-10 h-10 text-yellow-600/30" />
              </div>
              <div className="p-6 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-gray-400 text-sm font-medium">On Break</h3>
                  <p className="text-3xl font-bold text-white mt-2">{staffList.filter(s => s.status === 'Break').length}</p>
                </div>
                <Clock className="w-10 h-10 text-yellow-600/30" />
              </div>
              <div className="p-6 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-gray-400 text-sm font-medium">Total Staff Strength</h3>
                  <p className="text-3xl font-bold text-white mt-2">{staffList.length}</p>
                </div>
                <Users className="w-10 h-10 text-yellow-600/30" />
              </div>
            </div>

            {/* Actions & List */}
            <div className="p-6 bg-black/40 border border-white/5 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Employee Roster</h2>
                <button 
                  onClick={() => setIsStaffModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-semibold rounded-lg transition-colors shadow-[0_0_15px_rgba(202,138,4,0.3)]"
                >
                  <UserPlus className="w-4 h-4" /> Add Employee
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-sm text-gray-400 bg-black/20">
                      <th className="p-4 font-medium">Employee Name</th>
                      <th className="p-4 font-medium">Designation / Role</th>
                      <th className="p-4 font-medium">Scheduled Shift</th>
                      <th className="p-4 font-medium">Duty Status</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map((staff) => (
                      <tr key={staff.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                        <td className="p-4 font-medium text-white">
                          <div>
                            <p>{staff.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{staff.phone}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded-md text-xs font-semibold">{staff.role}</span>
                        </td>
                        <td className="p-4 text-sm text-gray-400">{staff.shift}</td>
                        <td className="p-4">
                          <button 
                            onClick={() => toggleStaffStatus(staff.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer
                              ${staff.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20' : ''}
                              ${staff.status === 'Break' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20' : ''}
                              ${staff.status === 'Offline' ? 'bg-gray-850 text-gray-500 border-gray-800 hover:bg-gray-800' : ''}
                            `}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full 
                              ${staff.status === 'Active' ? 'bg-green-500' : ''}
                              ${staff.status === 'Break' ? 'bg-yellow-500' : ''}
                              ${staff.status === 'Offline' ? 'bg-gray-500' : ''}
                            `} />
                            {staff.status}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => deleteStaff(staff.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'tables', icon: UtensilsCrossed, label: 'Live Tables' },
    { id: 'inventory', icon: Package, label: 'Inventory' },
    { id: 'ai', icon: Bot, label: 'AI Assistant' },
    { id: 'staff', icon: Users, label: 'Staff Management' },
  ];

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden text-gray-100 font-sans">
      
      {/* Sidebar - Desktop */}
      <aside className={`hidden md:flex flex-col w-64 bg-black border-r border-white/5 z-20`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center">
            <UtensilsCrossed className="w-4 h-4 text-black" />
          </div>
          <span className="text-xl font-bold tracking-wider text-white">MEZBAAN</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-yellow-600/10 text-yellow-500 border border-yellow-600/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-yellow-500' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0">
              <span className="font-bold text-gray-300 font-sans">A</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@mezbaan.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex animate-in fade-in duration-200">
          <div className="w-64 bg-black h-full border-r border-white/5 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold text-white tracking-wider">MEZBAAN</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-yellow-600/10 text-yellow-500 border border-yellow-600/20' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-yellow-500' : ''}`} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-black/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-white tracking-tight capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Professional Export Dropdown Button */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-350 hover:text-white text-sm font-medium rounded-lg border border-white/5 transition-colors">
                <Download className="w-4 h-4" /> Export Report
              </button>
              <div className="absolute right-0 top-11 bg-[#0a0a0a] border border-gray-800 rounded-lg shadow-2xl overflow-hidden w-40 hidden group-hover:block z-30 transition-all">
                <button onClick={() => triggerDataExport('PDF')} className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"><Briefcase className="w-3.5 h-3.5 text-red-400" /> PDF Document</button>
                <button onClick={() => triggerDataExport('CSV')} className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"><FileSpreadsheet className="w-3.5 h-3.5 text-green-400" /> CSV Sheets</button>
                <button onClick={() => triggerDataExport('Excel (XLS)')} className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"><FileSpreadsheet className="w-3.5 h-3.5 text-yellow-550" /> Excel Book</button>
                <button onClick={() => triggerDataExport('DOCX')} className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"><Briefcase className="w-3.5 h-3.5 text-blue-400" /> Word File</button>
              </div>
            </div>

            <button className="p-2 text-gray-400 hover:text-white relative">
              <Bell className="w-6 h-6" />
              {lowStockCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-black"></span>
              )}
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth z-10">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>

        {/* Background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-yellow-600/5 blur-[150px] pointer-events-none z-0" />
      </main>

      {/* --- ADD NEW INVENTORY ITEM MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Add Raw Material</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Item Name</label>
                <input 
                  type="text" required value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                  placeholder="e.g. Basmati Rice"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                <select 
                  value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500 appearance-none"
                >
                  <option>Raw Material</option>
                  <option>Vegetables</option>
                  <option>Spices</option>
                  <option>Packaging</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Quantity</label>
                  <input 
                    type="number" required min="0" step="0.1" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})}
                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                    placeholder="e.g. 50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Unit</label>
                  <select 
                    value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})}
                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500 appearance-none"
                  >
                    <option value="kg">kg</option>
                    <option value="liters">liters</option>
                    <option value="pcs">pieces</option>
                    <option value="grams">grams</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Low Stock Alert Threshold</label>
                <input 
                  type="number" required min="0" step="0.1" value={newItem.threshold} onChange={e => setNewItem({...newItem, threshold: e.target.value})}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                  placeholder="Alert me when stock falls below..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-yellow-600 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors">
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD NEW STAFF MODAL --- */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Add New Employee</h2>
              <button onClick={() => setIsStaffModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddStaff} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                <input 
                  type="text" required value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                  placeholder="e.g. Ramesh Kumar"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Role/Designation</label>
                <select 
                  value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                >
                  <option value="Head Chef">Head Chef</option>
                  <option value="Sous Chef">Sous Chef</option>
                  <option value="Manager">Manager</option>
                  <option value="Waiter">Waiter</option>
                  <option value="Cashier">Cashier</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Contact Number</label>
                <input 
                  type="text" required value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                  placeholder="e.g. +91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Scheduled Shift</label>
                <select 
                  value={newStaff.shift} onChange={e => setNewStaff({...newStaff, shift: e.target.value})}
                  className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                >
                  <option value="Morning (08:00 AM - 04:00 PM)">Morning Shift</option>
                  <option value="Evening (04:00 PM - 12:00 AM)">Evening Shift</option>
                  <option value="Full Day (11:00 AM - 11:00 PM)">Full Day</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsStaffModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-yellow-600 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors">
                  Onboard Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- REAL-TIME EXPORT PROGRESS DIALOG --- */}
      {isExporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-yellow-600/20 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-600/10" />
            <div className="w-12 h-12 rounded-full bg-yellow-600/10 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Download className="w-6 h-6 text-yellow-500 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Generating Mezbaan Report</h3>
            <p className="text-xs text-gray-400 mb-4">Structuring PostgreSQL & MongoDB data pools into .{exportFormat.toLowerCase()}</p>
            
            <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-yellow-600 transition-all duration-300" style={{ width: `${exportProgress}%` }} />
            </div>
            
            <span className="text-xs font-bold text-yellow-500">{exportProgress}% Completed</span>
          </div>
        </div>
      )}
    </div>
  );
}