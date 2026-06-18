"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, Stars } from '@react-three/drei';
import { ArrowRight, UtensilsCrossed, ChefHat } from 'lucide-react';
import * as THREE from 'three';

interface DropletProps {
  position: [number, number, number];
  scale: number;
  speed: number;
}

function GoldDroplet({ position, scale, speed }: DropletProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial 
          color="#d4af37" 
          envMapIntensity={2} 
          clearcoat={1} 
          clearcoatRoughness={0.1} 
          metalness={0.8} 
          roughness={0.2} 
          distort={0.4} 
          speed={2} 
        />
      </mesh>
    </Float>
  );
}

function FloatingScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <Environment preset="city" />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      
      {/* Background Floating Objects */}
      <GoldDroplet position={[-4, 2, -5]} scale={1.2} speed={1.5} />
      <GoldDroplet position={[5, -2, -8]} scale={1.8} speed={1} />
      <GoldDroplet position={[2, 3, -4]} scale={0.8} speed={2} />
      <GoldDroplet position={[-5, -3, -6]} scale={1.5} speed={1.2} />
    </>
  );
}

export default function SplashPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Intercept the navigation to play a smooth exit animation first
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    setIsExiting(true);
    
    // Wait for the cinematic zoom transition to finish before changing the URL
    setTimeout(() => {
      window.location.href = path;
    }, 1000); // 1 full second for the massive zoom effect
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]">
      
      {/* 3D Canvas Background */}
      <div className={`absolute inset-0 z-0 transition-all duration-700 ease-in-out ${isExiting ? 'opacity-0 blur-xl scale-110' : 'opacity-100 blur-0 scale-100'}`}>
        {isMounted && (
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <FloatingScene />
          </Canvas>
        )}
      </div>

      {/* HTML Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6 text-center text-white bg-black/40 backdrop-blur-sm">
        
        {}
        {/* Logo Icon - Zooms in massively to cover the screen on exit */}
        <div className={`flex items-center justify-center w-20 h-20 mb-6 border rounded-full backdrop-blur-md transition-all duration-[1000ms] ease-[cubic-bezier(0.87,0,0.13,1)] z-50 ${isExiting ? 'scale-[150] border-transparent bg-[#0a0a0a]' : 'scale-100 border-yellow-600 bg-black/50'}`}>
          <UtensilsCrossed className={`w-10 h-10 transition-all duration-500 ${isExiting ? 'opacity-0 scale-50' : 'text-yellow-500 opacity-100 scale-100'}`} />
        </div>

        {}
        {/* Text & Buttons Group - Fades out and drops down on exit */}
        <div className={`flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${isExiting ? 'opacity-0 translate-y-12 blur-md' : 'opacity-100 translate-y-0 blur-0'}`}>
          {/* Brand Name */}
          <h1 className="text-6xl font-extrabold tracking-tight md:text-8xl">
            MEZBAAN
          </h1>
          
          {/* Tagline */}
          <p className="max-w-2xl mt-6 text-xl font-light text-gray-300 md:text-2xl">
            The ultimate intelligent ecosystem for premier restaurants and culinary enthusiasts.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-4 mt-12 sm:flex-row">
            <a href="/login" onClick={(e) => handleNavigation(e, '/login')} className="flex items-center gap-2 px-8 py-4 text-lg font-semibold text-black transition-all duration-300 bg-yellow-500 rounded-full hover:bg-yellow-400 hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.4)]">
              Book a Table <ArrowRight className="w-5 h-5" />
            </a>
            
            <a href="/login" onClick={(e) => handleNavigation(e, '/login')} className="flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 border border-gray-600 rounded-full hover:border-yellow-500 hover:text-yellow-500 bg-black/30 hover:bg-black/50">
              <ChefHat className="w-5 h-5" /> Admin Portal
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-10 animate-bounce text-gray-500 text-sm tracking-widest transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
          EXPERIENCE THE FUTURE
        </div>
      </div>
    </main>
  );
}