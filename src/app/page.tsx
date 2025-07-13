"use client";
import Image from "next/image";
import { Github, Linkedin, FileText, User, Briefcase, Code2, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
// Remove Particles import and usage
// import Particles from "react-tsparticles";
// import { loadFull } from "tsparticles";
// Remove VantaNetBackground import
// import VantaNetBackground from "./VantaNetBackground";

const navButtons = [
  { label: "Me", icon: User, href: "#me" },
  { label: "Resume", icon: FileText, href: "#resume" },
  { label: "Projects", icon: Briefcase, href: "#projects" },
  { label: "Skills", icon: Code2, href: "#skills" },
  { label: "Contact", icon: Mail, href: "#contact" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showInternModal, setShowInternModal] = useState(false);

  // Wave animation background effect
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    let time = 0;
    const waves = [
      { amplitude: 30, frequency: 0.02, speed: 0.5, color: 'rgba(34, 197, 94, 0.1)' },
      { amplitude: 20, frequency: 0.015, speed: 0.3, color: 'rgba(22, 163, 74, 0.08)' },
      { amplitude: 25, frequency: 0.025, speed: 0.4, color: 'rgba(21, 128, 61, 0.06)' }
    ];

    function drawWaves() {
      ctx!.clearRect(0, 0, width, height);
      
      waves.forEach((wave, index) => {
        ctx!.beginPath();
        ctx!.moveTo(0, height);
        
        for (let x = 0; x <= width; x += 2) {
          const y = height * 0.7 + 
                   Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude +
                   Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 0.7) * wave.amplitude * 0.5;
          ctx!.lineTo(x, y);
        }
        
        ctx!.lineTo(width, height);
        ctx!.closePath();
        
        const gradient = ctx!.createLinearGradient(0, height * 0.7, 0, height);
        gradient.addColorStop(0, wave.color);
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0.02)');
        
        ctx!.fillStyle = gradient;
        ctx!.fill();
      });
      
      time += 0.02;
    }

    function animate() {
      drawWaves();
      requestAnimationFrame(animate);
    }

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    }

    window.addEventListener("resize", handleResize);
    animate();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Add particlesInit for tsparticles
  // const particlesInit = async (main: any) => {
  //   await loadFull(main);
  // };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Navigate to chatbot with the search query
      const url = `/chatbot?context=general&query=${encodeURIComponent(searchQuery.trim())}`;
      window.location.href = url;
    }
  };

  const handleNavClick = (href: string) => {
    // Extract context from href and navigate to chatbot
    const context = href.replace('#', '');
    
    // Add specific queries for different contexts
    let query = '';
    if (context === 'contact') {
      query = 'How can I contact you?';
    } else if (context === 'skills') {
      query = 'What are your skills?';
    } else if (context === 'me') {
      query = 'Tell me about yourself';
    } else if (context === 'resume') {
      query = 'Tell me about your experience';
    } else if (context === 'projects') {
      query = 'What projects have you worked on?';
    }
    
    const url = `/chatbot?context=${context}${query ? `&query=${encodeURIComponent(query)}` : ''}`;
    window.location.href = url;
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Wave animation background */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none" />
      
      {/* Fixed top-right social icons */}
      <div className="fixed top-6 right-6 z-30 flex gap-4 items-center">
        <a href="https://github.com/Vivekc815" target="_blank" rel="noopener noreferrer" 
           className="p-3 rounded-full bg-white/80 backdrop-blur-md border border-white/40 shadow-lg hover:shadow-xl hover:scale-110 hover:bg-green-100 hover:text-green-700 transition-all duration-300">
          <Github className="w-6 h-6 text-gray-700 group-hover:text-green-700 transition-colors" />
        </a>
        <a href="https://www.linkedin.com/in/vivek-c-465473185/" target="_blank" rel="noopener noreferrer" 
           className="p-3 rounded-full bg-white/80 backdrop-blur-md border border-white/40 shadow-lg hover:shadow-xl hover:scale-110 hover:bg-green-100 hover:text-green-700 transition-all duration-300">
          <Linkedin className="w-6 h-6 text-gray-700 group-hover:text-green-700 transition-colors" />
        </a>
        <a href="/resume.pdf" download 
           className="p-3 rounded-full bg-white/80 backdrop-blur-md border border-white/40 shadow-lg hover:shadow-xl hover:scale-110 hover:bg-green-100 hover:text-green-700 transition-all duration-300">
          <FileText className="w-6 h-6 text-gray-700 group-hover:text-green-700 transition-colors" />
          </a>
        </div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4 pt-24 pb-12">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 120, damping: 12 }} 
          className="flex flex-col items-center gap-4"
        >
          {/* Add the floating button near the avatar - Updated for Vercel deployment */}
          <div className="relative">
            <div className="rounded-full shadow-2xl shadow-green-200/30 bg-white/80 backdrop-blur-lg p-2 mb-2">
              <Image src="/AppleMemojis1.jpg" alt="Memoji Avatar" width={160} height={160} className="rounded-full object-cover border-4 border-green-400" priority />
            </div>
            <button
              onClick={() => setShowInternModal(true)}
              className="absolute left-1/2 -bottom-4 -translate-x-1/2 px-5 py-2 bg-green-600 text-white rounded-full shadow-lg border-2 border-white/80 hover:bg-green-700 transition-all text-sm font-semibold z-10"
              style={{ minWidth: 180 }}
            >
              🟢 Open to Internships
            </button>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center">Hey, I'm Vivek</h2>
          {/* Replace the intro text with a more prominent, modern font */}
          <p className="text-xl sm:text-2xl font-bold text-emerald-700 text-center max-w-md font-[var(--font-montserrat)] mt-2">
            Computer Science student at University of Florida
          </p>
        </motion.div>

        {/* 1. Animated scroll-down indicator below hero */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 1, type: "spring", stiffness: 80 }}
          className="flex flex-col items-center mt-8"
        >
          <span className="text-gray-700 text-sm mb-1 font-semibold">Scroll down</span>
          <span className="animate-bounce text-3xl text-gray-800">↓</span>
        </motion.div>

        {/* 2. Wavy SVG divider below hero */}
        <div className="w-full overflow-hidden -mb-2">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12">
            <path fill="#d1fae5" fillOpacity="1" d="M0,32L60,37.3C120,43,240,53,360,58.7C480,64,600,64,720,58.7C840,53,960,43,1080,42.7C1200,43,1320,53,1380,58.7L1440,64L1440,80L1380,80C1320,80,1200,80,1080,80C960,80,840,80,720,80C600,80,480,80,360,80C240,80,120,80,60,80L0,80Z" />
          </svg>
        </div>

        <motion.h1 
          initial={{ y: 40, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }} 
          className="mt-8 text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 drop-shadow-lg text-center"
        >
          AI Portfolio
        </motion.h1>

        {/* Search box */}
        <motion.form 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }} 
          onSubmit={handleSearch}
          className="w-full flex justify-center mt-8"
        >
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Ask me anything..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-lg placeholder:text-gray-500"
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
              </div>
            )}
          </div>
        </motion.form>

        {/* Glassmorphism nav buttons */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.6, type: "spring", stiffness: 100 }} 
          className="flex flex-wrap justify-center gap-4 mt-10 w-full"
        >
          {navButtons.map(({ label, icon: Icon, href }) => (
            <button 
              key={label} 
              onClick={() => handleNavClick(href)}
              className="flex flex-col items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 min-w-[90px] max-w-[120px] group"
            >
              <Icon className="w-7 h-7 text-green-600 group-hover:text-green-700 transition-colors" />
              <span className="text-base font-semibold text-gray-700 group-hover:text-gray-800 transition-colors">{label}</span>
            </button>
          ))}
        </motion.div>
      </main>

      {/* Modal for Open to Internships */}
      {showInternModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white/90 rounded-3xl shadow-2xl border border-green-200 max-w-md w-full p-8 relative flex flex-col items-center">
            <button
              onClick={() => setShowInternModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-green-600 text-2xl font-bold"
              aria-label="Close"
            >
              ×
            </button>
                          <Image src="/AppleMemojis1.jfif" alt="Memoji Avatar" width={90} height={90} className="rounded-full border-4 border-green-400 shadow mb-3" />
            <h3 className="text-2xl font-bold text-gray-800 mb-1">Vivek C</h3>
            <div className="text-green-700 font-semibold mb-2">Open to Internships: Summer 2026</div>
            <p className="text-gray-700 text-center mb-4">Aspiring Software Engineer skilled in Python, C++, React JS, Node JS, Responsive UI Design, SQL, NoSQL, and Firebase. National-level badminton player, passionate about building efficient systems and learning new technologies.</p>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Python</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">C++</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">React JS</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Node JS</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">SQL</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">NoSQL</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Firebase</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Responsive UI</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <a href="mailto:vivekc.mec@gmail.com" className="text-green-700 font-medium hover:underline">vivekc.mec@gmail.com</a>
              <a href="https://www.linkedin.com/in/vivek-c-465473185/" target="_blank" rel="noopener noreferrer" className="text-green-700 font-medium hover:underline flex items-center gap-1">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            </div>
            <a
              href="/Vivek_Chenganassery_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
              className="mt-5 inline-block px-6 py-3 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all text-base"
              download
            >
              <FileText className="inline-block w-5 h-5 mr-2 -mt-1" /> My Latest Resume
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
