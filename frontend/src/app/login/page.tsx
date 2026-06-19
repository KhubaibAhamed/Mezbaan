"use client";

import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // 🚀 Connects directly to your Java Spring Boot backend on port 8080!
      const response = await fetch('https://fuzzy-zebra-5g44gqqwxvvqcpg4p-8080.app.github.dev/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // 🛡️ SECURITY: Save the JWT token securely to the browser!
        localStorage.setItem('mezbaan_jwt', data.token);
        localStorage.setItem('mezbaan_role', data.role);
        
        // Routes the user to the correct dashboard based on backend role!
        if (data.role === 'ADMIN' || data.role === 'SUPER_ADMIN') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/discover';
        }
      } else {
        setErrorMsg("Invalid credentials. For Admin, try admin@mezbaan.com with password: admin123");
      }
    } catch (error) {
      console.error("Connection error", error);
      setErrorMsg("Cannot connect to Java Backend. Please verify that your Spring Boot server is running on port 8080!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white px-4">
      <div className="w-full max-w-md p-8 bg-[#111] border border-gray-800 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Top Radial Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-yellow-500/20 blur-[60px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-600">
            Welcome to Mezbaan
          </h2>
          <p className="text-gray-400 text-center mb-8 text-sm">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                  placeholder="admin@mezbaan.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                {errorMsg}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-black font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500 space-y-1">
            <p>Admin Login: <span className="text-gray-300">admin@mezbaan.com / admin123</span></p>
            <p>Customer Login: <span className="text-gray-300">customer@email.com / any password</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}