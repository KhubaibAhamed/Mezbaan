"use client";

import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, UtensilsCrossed, User, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Trigger entrance animation on mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);
    
    // Simulate network latency and database validation
    setTimeout(() => {
      setIsLoading(false);
      
      if (isLoginMode) {
        setNotification({ 
          message: `Successfully authenticated! Redirecting...`, 
          type: 'success' 
        });
        
        // --- SECURE DYNAMIC ROUTING PATHWAY ---
        setTimeout(() => {
          if (email.toLowerCase() === 'admin@mezbaan.com') {
            window.location.href = '/admin'; // Route to Restaurant Admin Panel
          } else {
            window.location.href = '/discover'; // Route Customer to Discovery & Seat Selection Portal
          }
        }, 1200);

      } else {
        // Success Notification for Sign Up
        setNotification({ 
          message: `Account created for ${name}! You can now sign in to start booking.`, 
          type: 'success' 
        });
        
        // Reset states and switch tab automatically
        setPassword('');
        setTimeout(() => {
          setIsLoginMode(true);
          setNotification(null);
        }, 3000);
      }
    }, 1500);
  };

  return (
    <main className={`relative flex items-center justify-center w-full min-h-screen bg-[#0a0a0a] overflow-hidden transition-all duration-1000 ease-out ${isMounted ? 'opacity-100' : 'opacity-0 scale-95 blur-md'}`}>
      
      {/* Dynamic atmospheric ambient lighting spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none transition-all duration-1000" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-900/10 rounded-full blur-[120px] pointer-events-none transition-all duration-1000" />

      {/* Primary Interactive Auth Panel */}
      <div className="relative z-10 w-full max-w-md p-8 mx-4 border border-white/10 rounded-2xl bg-black/50 backdrop-blur-xl shadow-2xl overflow-hidden">
        
        {/* Branding Container */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 mb-4 border border-yellow-600 rounded-full bg-black/50 transition-transform duration-500 hover:scale-110 hover:rotate-12">
            <UtensilsCrossed className="w-8 h-8 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white transition-all duration-300">
            {isLoginMode ? 'Welcome Back' : 'Join Mezbaan'}
          </h1>
          <p className="mt-2 text-sm text-gray-400 text-center">
            {isLoginMode ? 'Sign in to access premium dining & dynamic reservations' : 'Unlock seat selection, pre-ordering, and real-time menus'}
          </p>
        </div>

        {/* Dynamic Alert Banner */}
        {notification && (
          <div className={`flex items-center gap-3 p-4 mb-6 rounded-lg border text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${notification.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {notification.message}
          </div>
        )}

        {/* Unified Input Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Sign Up Specific Form Field */}
          <div className={`space-y-2 overflow-hidden transition-all duration-500 ease-in-out ${isLoginMode ? 'max-h-0 opacity-0 m-0' : 'max-h-24 opacity-100'}`}>
            <label className="text-sm font-medium text-gray-300">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-3 pl-10 pr-4 text-white transition-all bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 disabled:opacity-50 text-sm"
                placeholder="E.g. Rajesh Malhotra"
                required={!isLoginMode}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Core Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 pl-10 pr-4 text-white transition-all bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 disabled:opacity-50 text-sm"
                placeholder="E.g. admin@mezbaan.com or customer@gmail.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Secure Password Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">Password</label>
              {isLoginMode && (
                <a href="#" className="text-xs text-yellow-500 hover:text-yellow-400 transition-colors">Forgot password?</a>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 pl-10 pr-4 text-white transition-all bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 disabled:opacity-50 text-sm"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Trigger Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center w-full gap-2 py-3 mt-6 text-black transition-all bg-yellow-500 rounded-lg hover:bg-yellow-400 disabled:opacity-70 disabled:cursor-wait font-semibold hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] text-sm"
          >
            {isLoading ? 'Securing Connection...' : (isLoginMode ? 'Sign In' : 'Create Account')}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        {/* Interactive Mode Toggles */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setNotification(null);
                setPassword('');
              }} 
              className="text-yellow-500 hover:text-yellow-400 font-medium hover:underline transition-all"
            >
              {isLoginMode ? 'Create one' : 'Sign In'}
            </button>
          </p>
          <div className="mt-6 pt-6 border-t border-white/10">
            <a href="/" className="inline-flex items-center text-xs text-gray-500 hover:text-white transition-colors">
              <ArrowRight className="w-3 h-3 mr-1 rotate-180" /> Return to Welcome Screen
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}