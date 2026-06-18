"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Sparkles, 
  Send, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Filter,
  UtensilsCrossed,
  Info,
  ChevronRight,
  Download,
  Phone,
  ArrowLeft
} from 'lucide-react';

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  priceLevel: string;
  location: string;
  availableTables: number;
  image: string;
  tags: string[];
  description: string;
  contact: string;
}

const mockRestaurants: Restaurant[] = [
  {
    id: 1,
    name: "The Royal Biryani Durbar",
    cuisine: "Mughlai & Awadhi",
    rating: 4.9,
    deliveryTime: "30-40 min prep",
    priceLevel: "₹₹₹",
    location: "Sardar Marg, Civil Lines",
    availableTables: 4,
    image: "🍛",
    tags: ["Best Seller", "Fine Dine", "Live Music"],
    description: "Experience royal culinary perfection with recipes passed down through generations of Awadhi chefs.",
    contact: "+91 91100 22334"
  },
  {
    id: 2,
    name: "Dakshin Express",
    cuisine: "Traditional South Indian",
    rating: 4.7,
    deliveryTime: "15-20 min prep",
    priceLevel: "₹",
    location: "Station Road Corner",
    availableTables: 7,
    image: "🥞",
    tags: ["Fast Prep", "Pure Veg", "Family Seating"],
    description: "Crispy ghee roast paper-thin dosas and piping hot traditional filter coffee served fresh.",
    contact: "+91 92200 33445"
  },
  {
    id: 3,
    name: "Pind Punjab De",
    cuisine: "North Indian & Tandoori",
    rating: 4.8,
    deliveryTime: "25-35 min prep",
    priceLevel: "₹₹",
    location: "National Highway Link",
    availableTables: 3,
    image: "🫓",
    tags: ["Clay Tandoor", "Butter Heavy", "Outdoor Garden"],
    description: "Authentic tandoori specialties and slow-cooked rich black dal makhani straight from Punjab.",
    contact: "+91 93300 44556"
  },
  {
    id: 4,
    name: "Zayka Street",
    cuisine: "Indo-Chinese Fusion",
    rating: 4.4,
    deliveryTime: "15-25 min prep",
    priceLevel: "₹",
    location: "Gandhi Chowk Bazaar",
    availableTables: 9,
    image: "🍜",
    tags: ["Wok Tossed", "Late Night", "Pocket Friendly"],
    description: "Spicy Schezwan noodles, crispy Manchurian, and authentic street-style food on a budget.",
    contact: "+91 94400 55667"
  }
];

// Mock menu items for pre-ordering
const menuItems = [
  { id: 'm1', name: 'Special Chicken Biryani', price: 340, veg: false },
  { id: 'm2', name: 'Paneer Butter Masala', price: 280, veg: true },
  { id: 'm3', name: 'Garlic Butter Naan', price: 60, veg: true },
  { id: 'm4', name: 'Dal Makhani Tadka', price: 240, veg: true },
  { id: 'm5', name: 'Crispy Butter Dosa', price: 150, veg: true },
];

export default function DiscoverPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);
  
  // Seating and Booking states
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookingTime, setBookingTime] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [bookingDate, setBookingDate] = useState<string>('');

  // Cart/Pre-ordering states
  const [cart, setCart] = useState<Record<string, number>>({});
  
  // Chatbot state
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: "Hello! I am your Mezbaan dining assistant. Need food recommendations, help choosing a table, or want to place a quick booking? Ask me anything!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Checkout Receipt States
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);
  const [bookingProgress, setBookingProgress] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [finalBookingCode, setFinalBookingCode] = useState('');

  useEffect(() => {
    setIsMounted(true);
    // Set default booking date as today
    const today = new Date().toISOString().split('T')[0];
    setBookingDate(today);
  }, []);

  if (!isMounted) return null;

  const mockTableSeats = [
    { code: "A1", label: "Window Side", seats: 2, status: "free" },
    { code: "A2", label: "Cozy Corner", seats: 2, status: "occupied" },
    { code: "B1", label: "Executive Lounge", seats: 6, status: "free" },
    { code: "B2", label: "Family Circle", seats: 4, status: "occupied" },
    { code: "C1", label: "Window Side Side", seats: 4, status: "free" },
    { code: "C2", label: "Standard Inner", seats: 2, status: "free" },
    { code: "D1", label: "VIP Sofa", seats: 8, status: "free" },
    { code: "D2", label: "Romantic Booth", seats: 2, status: "occupied" }
  ];

  const handleSeatSelect = (code: string, status: string) => {
    if (status === 'occupied') return;
    if (selectedSeats.includes(code)) {
      setSelectedSeats(selectedSeats.filter(s => s !== code));
    } else {
      setSelectedSeats([...selectedSeats, code]);
    }
  };

  const updateCartQty = (itemId: string, change: number) => {
    const currentQty = cart[itemId] || 0;
    const newQty = Math.max(0, currentQty + change);
    if (newQty === 0) {
      const { [itemId]: removed, ...rest } = cart;
      setCart(rest);
    } else {
      setCart({ ...cart, [itemId]: newQty });
    }
  };

  const calculateCartTotal = () => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = menuItems.find(m => m.id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  };

  const handleSendMessage = (e?: React.FormEvent, predefined?: string) => {
    if (e) e.preventDefault();
    const query = predefined || chatInput;
    if (!query.trim()) return;

    setChatMessages(prev => [...prev, { sender: 'user', text: query }]);
    setChatInput('');
    setIsBotTyping(true);

    setTimeout(() => {
      let botResponse = "I've logged your request. Let me check with Mezbaan database...";
      const lowerQuery = query.toLowerCase();

      if (lowerQuery.includes('spicy') || lowerQuery.includes('recommend') || lowerQuery.includes('best dish')) {
        botResponse = "At 'The Royal Biryani Durbar', you must order the Special Chicken Biryani (cooked in slow-dum style with traditional ghee). It has a robust spice level. If you prefer milder food, try the Paneer Butter Masala!";
      } else if (lowerQuery.includes('veg') || lowerQuery.includes('vegetarian')) {
        botResponse = "Dakshin Express is a completely 100% Pure Vegetarian restaurant. They are famous for their paper-thin crispy Butter Dosa and authentic filter coffee!";
      } else if (lowerQuery.includes('book') || lowerQuery.includes('reserve')) {
        botResponse = "To book a table instantly, select one of the premium restaurant cards in front of you, pick your custom time-slot, select your seats on our dynamic layout, and hit 'Confirm Booking'!";
      } else {
        botResponse = "I've searched your nearby restaurants. 3 out of 4 venues are open right now with available tables! Let me know if you want me to pre-select a romantic table next to a window.";
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      setIsBotTyping(false);
    }, 1200);
  };

  const handleFinalCheckout = () => {
    if (!bookingTime || selectedSeats.length === 0 || !bookingDate) {
      alert("Please choose a Date, Time-slot, and at least 1 Seat on the visual map to continue!");
      return;
    }

    setIsProcessingBooking(true);
    setBookingProgress(0);

    const interval = setInterval(() => {
      setBookingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessingBooking(false);
            setFinalBookingCode(`MZB-${Math.floor(100000 + Math.random() * 900000)}`);
            setShowReceipt(true);
          }, 600);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const handleDownloadInvoice = () => {
    alert("Invoice generated! Downloading PDF directly using browser channels...");
  };

  // Filter list based on search and selected tag
  const filteredRestaurants = mockRestaurants.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? r.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(mockRestaurants.flatMap(r => r.tags)));

  return (
    <div className="flex h-screen bg-[#050505] text-gray-100 overflow-hidden relative">
      
      {/* Dynamic Background Fog */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-yellow-600/5 blur-[120px] pointer-events-none z-0" />
      
      {/* Sidebar / Discovery Stream */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        
        {/* Sub-Header Navbar */}
        <header className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-yellow-600 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-wider text-white">MEZBAAN</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsBotOpen(!isBotOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-600/10 text-yellow-500 border border-yellow-600/20 hover:bg-yellow-600/20 transition-all text-sm font-semibold"
            >
              <Sparkles className="w-4 h-4 animate-pulse" /> Ask AI Host
            </button>
            <a href="/login" className="text-xs text-gray-400 hover:text-white border border-white/10 rounded-lg px-3 py-1.5 bg-white/5 transition-all">
              Sign Out
            </a>
          </div>
        </header>

        {/* Scrollable Feed Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Search Input and Visual Greeting Banner */}
            <div className="p-8 bg-gradient-to-r from-yellow-900/10 to-black border border-white/5 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <UtensilsCrossed className="w-40 h-40 text-yellow-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Find Your Perfect Dining Spot</h2>
              <p className="text-sm text-gray-400 mb-6">Real-time dynamic seat selectors, digital queue limits, and automated booking configurations.</p>
              
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search by restaurant name, food styles, or specific dishes..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-black/60 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-yellow-500 text-sm transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Quick Tag Pills */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mr-2">Quick Tags:</span>
              <button 
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${!selectedTag ? 'bg-yellow-600 text-black border-yellow-600' : 'bg-transparent border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'}`}
              >
                All Venues
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${selectedTag === tag ? 'bg-yellow-600 text-black border-yellow-600' : 'bg-transparent border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'}`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Listing Stream */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRestaurants.map((res) => (
                <div key={res.id} className="p-6 bg-black/40 border border-white/5 rounded-2xl hover:border-white/10 transition-all hover:scale-[1.01] flex flex-col justify-between group shadow-xl">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-4xl p-3 bg-yellow-600/10 rounded-xl border border-yellow-600/15">{res.image}</div>
                      <div className="flex items-center gap-1.5 text-xs text-yellow-500 font-bold bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/20">
                        <Star className="w-3.5 h-3.5 fill-yellow-500" /> {res.rating}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-yellow-500 transition-colors">{res.name}</h3>
                    <p className="text-xs text-gray-400 mb-2 font-medium">{res.cuisine} • {res.priceLevel}</p>
                    <p className="text-sm text-gray-300 leading-relaxed mb-4">{res.description}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                      <MapPin className="w-3.5 h-3.5" /> {res.location}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {res.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-md">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-green-500 font-semibold bg-green-500/10 px-2.5 py-1 rounded-md border border-green-500/10">
                      {res.availableTables} Tables Live
                    </span>
                    <button 
                      onClick={() => {
                        setActiveRestaurant(res);
                        setSelectedSeats([]);
                        setCart({});
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black text-xs font-bold rounded-lg transition-all shadow-md"
                    >
                      Book Table <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* --- FLOATING DETAILED SEAT & BOOKING SELECTION PANEL --- */}
      {activeRestaurant && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-40 flex justify-end animate-in fade-in slide-in-from-right duration-300">
          <div className="w-full max-w-2xl bg-[#090909] h-full border-l border-white/10 flex flex-col justify-between overflow-hidden shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveRestaurant(null)}
                  className="p-1.5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="font-bold text-white text-lg">{activeRestaurant.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5"><Phone className="w-3 h-3" /> {activeRestaurant.contact}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveRestaurant(null)}
                className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Custom Seat Plan Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Step 1: Input Booking Basics */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-yellow-600/10 text-yellow-500 border border-yellow-600/20 text-xs flex items-center justify-center font-bold">1</span>
                  Reservation Options
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Reservation Date</label>
                    <input 
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Time Slot Selection</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-yellow-500 appearance-none"
                    >
                      <option value="">Select slot...</option>
                      <option value="12:00 PM - Lunch">12:00 PM (Lunch)</option>
                      <option value="02:00 PM - High Tea">02:00 PM</option>
                      <option value="07:00 PM - Dinner Peak">07:00 PM (Dinner Peak)</option>
                      <option value="09:00 PM - Late Night">09:00 PM (Late Night)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Expected Guests</label>
                    <input 
                      type="number"
                      min="1"
                      max="15"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full bg-black border border-gray-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Dynamic Seat Selector Layout */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-yellow-600/10 text-yellow-500 border border-yellow-600/20 text-xs flex items-center justify-center font-bold">2</span>
                    Select Your Tables (Abhibus Layout)
                  </h4>
                  <div className="flex items-center gap-3 text-[10px]">
                    <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-green-950 border border-green-500 rounded-sm"></span> Free</div>
                    <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-yellow-600 rounded-sm"></span> Selected</div>
                    <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-gray-900 border border-white/5 rounded-sm"></span> Occupied</div>
                  </div>
                </div>

                <div className="p-4 bg-black/40 border border-white/5 rounded-xl text-center">
                  <div className="w-1/2 h-1.5 bg-gray-800 mx-auto rounded-full mb-8 text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center justify-center">Main Stage / Live Music</div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {mockTableSeats.map((table) => {
                      const isSelected = selectedSeats.includes(table.code);
                      const isOccupied = table.status === 'occupied';
                      return (
                        <button
                          key={table.code}
                          onClick={() => handleSeatSelect(table.code, table.status)}
                          disabled={isOccupied}
                          className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
                            isOccupied ? 'bg-gray-950/40 border-white/5 text-gray-600 cursor-not-allowed' :
                            isSelected ? 'bg-yellow-600 text-black border-yellow-600 shadow-[0_0_10px_rgba(202,138,4,0.3)]' :
                            'bg-green-950/20 border-green-500/30 text-green-400 hover:border-green-500'
                          }`}
                        >
                          <span className="text-sm font-bold">{table.code}</span>
                          <span className="text-[9px] opacity-75">{table.seats} Seats</span>
                          <span className="text-[8px] font-medium mt-1 truncate">{table.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 3: Menu Pre-Ordering Component */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-yellow-600/10 text-yellow-500 border border-yellow-600/20 text-xs flex items-center justify-center font-bold">3</span>
                  Pre-order Menu Items (Optional)
                </h4>
                <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-3">
                  {menuItems.map((item) => {
                    const qty = cart[item.id] || 0;
                    return (
                      <div key={item.id} className="flex justify-between items-center text-xs">
                        <div>
                          <div className="flex items-center gap-1.5 font-semibold text-white">
                            <span className={`w-2 h-2 rounded-full ${item.veg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {item.name}
                          </div>
                          <div className="text-[10px] text-gray-500 mt-0.5">₹{item.price} each</div>
                        </div>
                        
                        <div className="flex items-center gap-2 bg-black border border-gray-850 px-2.5 py-1 rounded-lg">
                          <button onClick={() => updateCartQty(item.id, -1)} className="text-gray-400 hover:text-white font-bold px-1 text-sm">-</button>
                          <span className="text-white font-bold w-4 text-center">{qty}</span>
                          <button onClick={() => updateCartQty(item.id, 1)} className="text-yellow-500 hover:text-yellow-400 font-bold px-1 text-sm">+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Sticky Footer Summary */}
            <div className="p-6 border-t border-white/5 bg-black/60 flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm">
                <div>
                  <p className="text-xs text-gray-500">Reserved Tables: <span className="text-white font-semibold">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}</span></p>
                  <p className="text-xs text-gray-500 mt-0.5">Total Food Add-on: <span className="text-green-400 font-semibold">₹{calculateCartTotal()}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total Bill Payable</p>
                  <p className="text-lg font-bold text-yellow-500">₹{calculateCartTotal() + (selectedSeats.length * 100)}</p>
                  <span className="text-[9px] text-gray-500">(Includes ₹100 Seat Reservation Fee)</span>
                </div>
              </div>

              <button 
                onClick={handleFinalCheckout}
                className="w-full flex items-center justify-center gap-2 py-3 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(202,138,4,0.3)]"
              >
                Confirm Booking <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- FLOATING SLIDE-OUT CHAT INTERFACE --- */}
      {isBotOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[480px] bg-[#0c0c0c] border border-yellow-600/20 rounded-2xl flex flex-col justify-between overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-bottom duration-300">
          {/* Bot Header */}
          <div className="p-4 border-b border-white/5 bg-black flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-600/10 border border-yellow-600/30 flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-yellow-500 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Mezbaan Dining Guide</h4>
                <p className="text-[10px] text-green-500">Online • AI Host</p>
              </div>
            </div>
            <button onClick={() => setIsBotOpen(false)} className="p-1 hover:bg-white/5 rounded-lg text-gray-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-yellow-600 text-black font-semibold rounded-tr-none' : 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isBotTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/5 rounded-xl rounded-tl-none px-3 py-2 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="p-2 border-t border-white/5 flex gap-1.5 overflow-x-auto whitespace-nowrap bg-black/30">
            <button onClick={() => handleSendMessage(undefined, "Suggest me spicy food options")} className="text-[10px] border border-gray-800 text-gray-400 px-2.5 py-1 rounded-full hover:border-yellow-600 transition-all">🌶️ Spicy options</button>
            <button onClick={() => handleSendMessage(undefined, "Are there Pure Veg restaurants?")} className="text-[10px] border border-gray-800 text-gray-400 px-2.5 py-1 rounded-full hover:border-yellow-600 transition-all">🥗 Pure Veg</button>
            <button onClick={() => handleSendMessage(undefined, "How to secure my seat booking?")} className="text-[10px] border border-gray-800 text-gray-400 px-2.5 py-1 rounded-full hover:border-yellow-600 transition-all">🎟️ Seat Help</button>
          </div>

          {/* Input Chat Field */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-white/5 bg-black/60 flex gap-2">
            <input 
              type="text"
              placeholder="Ask anything..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-[#121212] border border-gray-850 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-500"
            />
            <button type="submit" className="p-2 bg-yellow-600 text-black rounded-lg hover:bg-yellow-500 transition-all">
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>
      )}

      {/* --- REAL-TIME BOOKING PROGRESS OVERLAY --- */}
      {isProcessingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-yellow-600/20 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-600/10" />
            <div className="w-12 h-12 rounded-full bg-yellow-600/10 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <UtensilsCrossed className="w-6 h-6 text-yellow-500 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Locking Seating Coordinates</h3>
            <p className="text-xs text-gray-400 mb-4">Allocating Abhibus seats and preparing pre-ordered dining vouchers...</p>
            
            <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-yellow-600 transition-all duration-300" style={{ width: `${bookingProgress}%` }} />
            </div>
            <span className="text-xs font-bold text-yellow-500">{bookingProgress}% Locked</span>
          </div>
        </div>
      )}

      {/* --- SUCCESS BOOKING RECEIPT DRAWER --- */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0d0d0d] border border-yellow-600/30 rounded-2xl w-full max-w-md p-6 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-28 h-28 bg-green-500/10 rounded-full blur-2xl"></div>
            
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">Reservation Confirmed!</h3>
            <p className="text-xs text-gray-400 mt-1">Your seats have been booked securely at Mezbaan servers.</p>
            
            {/* Core Ticket */}
            <div className="my-6 p-4 bg-black border border-white/5 rounded-xl text-left space-y-3.5 text-xs relative">
              <div className="absolute top-0 right-4 translate-y-[-50%] px-2.5 py-0.5 bg-yellow-600 text-black font-extrabold rounded-full text-[9px] uppercase">
                {finalBookingCode}
              </div>

              <div>
                <span className="text-gray-500 uppercase font-bold text-[9px] tracking-wider block">Restaurant</span>
                <span className="text-white font-semibold text-sm">{activeRestaurant?.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 uppercase font-bold text-[9px] tracking-wider block">Date & Time</span>
                  <span className="text-white font-medium">{bookingDate} • {bookingTime.split(' - ')[0]}</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase font-bold text-[9px] tracking-wider block">Allocated Table</span>
                  <span className="text-yellow-500 font-bold">{selectedSeats.join(', ')}</span>
                </div>
              </div>

              {Object.keys(cart).length > 0 && (
                <div className="pt-2 border-t border-white/5">
                  <span className="text-gray-500 uppercase font-bold text-[9px] tracking-wider block mb-1">Pre-ordered Food items</span>
                  <div className="space-y-1">
                    {Object.entries(cart).map(([id, qty]) => {
                      const item = menuItems.find(m => m.id === id);
                      return item ? (
                        <div key={id} className="flex justify-between text-gray-300 text-[11px]">
                          <span>{item.name} x{qty}</span>
                          <span>₹{item.price * qty}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-white/5 flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium">Final Amount Paid</span>
                <span className="text-green-400 font-bold text-base">₹{calculateCartTotal() + (selectedSeats.length * 100)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleDownloadInvoice}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-white/10 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-xs font-semibold transition-all"
              >
                <Download className="w-4 h-4" /> Save Receipt
              </button>
              <button 
                onClick={() => {
                  setShowReceipt(false);
                  setActiveRestaurant(null);
                  setSelectedSeats([]);
                }}
                className="flex-1 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-black text-xs font-bold rounded-xl transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}