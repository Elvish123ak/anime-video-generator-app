/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { 
  Clapperboard, 
  Sparkles, 
  Image as ImageIcon, 
  Settings, 
  Download, 
  Plus, 
  RotateCw, 
  Play, 
  Clock, 
  Zap, 
  CheckCircle2, 
  ChevronRight,
  Monitor,
  Smartphone,
  Square,
  Maximize2,
  Trash2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";

// Reassuring messages for longer generation times
const REASSURING_MESSAGES = [
  "Drafting initial sketches...",
  "Applying cel-shading magic...",
  "Calculating anime physics...",
  "Training digital voice actors...",
  "Rendering cinematic lighting...",
  "Polishing final frames...",
  "Almost there, stay creative!"
];

type AspectRatio = "16:9" | "9:16" | "1:1" | "4:3";
type Duration = "30s" | "1m" | "2m" | "5m";
type Quality = "Fast" | "Good" | "Best";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [duration, setDuration] = useState<Duration>("30s");
  const [quality, setQuality] = useState<Quality>("Good");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rotate messages while generating
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % REASSURING_MESSAGES.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList?.contains('btn-fluid')) {
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        target.style.setProperty('--x', `${x}px`);
        target.style.setProperty('--y', `${y}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleRandomIdea = () => {
    const ideas = [
      "A futuristic Tokyo street in a rainy cyberpunk style, neon lights reflecting on puddles.",
      "A peaceful studio ghibli-inspired meadow with floating dandelion seeds and a white cat.",
      "An epic mecha battle in high orbit against a purple supernova background.",
      "A slice of life scene in a cozy ramen shop at midnight, steam rising from the bowls.",
      "A mystical forest where the trees look like giant mushrooms and small spirits hide behind them."
    ];
    setPrompt(ideas[Math.floor(Math.random() * ideas.length)]);
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setPhotos((prev) => [...prev, ev.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setIsGenerating(true);
    setProgress(0);
    setError(null);

    // Simulated progress for UI feel
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return prev;
        return prev + (100 - prev) * 0.05;
      });
    }, 1000);

    try {
      // In a real environment, we'd use the Veo API via @google/genai
      // const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      // let operation = await ai.models.generateVideos({
      //   model: 'veo-3.1-lite-generate-preview',
      //   prompt: `Anime style: ${prompt}`,
      //   config: { resolution: '1080p', aspectRatio }
      // });
      // ... polling ...
      
      // Simulating the 2-5 minute wait with a shorter timeout for this demo
      await new Promise((resolve) => setTimeout(resolve, 8000));
      
      setGeneratedVideo("https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-at-night-with-neon-lights-4458-large.mp4");
      setProgress(100);
    } catch (err) {
      setError("Failed to generate video. Please try again.");
      console.error(err);
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="h-screen flex flex-col bg-[#050505] text-[#e5e5e5] font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Header Navigation */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Clapperboard size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 font-serif italic">
            AnimeMaker
          </h1>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-white/50">
          <a href="#" className="text-white transition-colors">Studio</a>
          <a href="#" className="hover:text-white transition-colors">Gallery</a>
          <a href="#" className="hover:text-white transition-colors">Assets</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-4">
          <div className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded border border-indigo-400/20 uppercase tracking-widest">
            12 Credits Left
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-b from-gray-700 to-gray-900 border border-white/20"></div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Column: Control Panel */}
        <aside className="w-[360px] border-r border-white/5 flex flex-col p-6 space-y-6 bg-[#0a0a0a] overflow-y-auto scrollbar-hide">
          {/* Prompt Input */}
          <section className="space-y-3">
            <label className="section-label flex justify-between items-center">
              <span>📝 What to see?</span>
              <button 
                onClick={handleRandomIdea}
                className="text-indigo-400 normal-case tracking-normal hover:underline font-medium"
              >
                [Random Idea]
              </button>
            </label>
            <div className="relative group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your scene... e.g. A cyber-punk girl walking through a neon-lit Tokyo rain, lo-fi aesthetic, detailed textures..."
                className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 placeholder-white/20 resize-none transition-all group-hover:border-white/20"
              />
            </div>
          </section>

          {/* Image Uploads */}
          <section className="space-y-3">
            <label className="section-label">🖼️ Photos (Optional)</label>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-1 hover:bg-white/5 hover:border-white/20 transition-all text-white/20 hover:text-white/40"
              >
                <Plus size={20} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                className="hidden" 
                multiple 
                accept="image/*" 
              />
              {photos.map((photo, i) => (
                <div key={i} className="relative flex-shrink-0 group">
                  <img src={photo} alt="" className="w-16 h-16 rounded-xl object-cover border border-white/10" referrerPolicy="no-referrer" />
                  <button 
                    onClick={() => removePhoto(i)}
                    className="absolute inset-0 bg-red-500 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Settings Grid */}
          <section className="space-y-6 pt-2">
            <div className="flex flex-col gap-2">
              <label className="section-label">⚙️ Duration</label>
              <div className="flex p-1 bg-white/5 rounded-lg">
                {(["30s", "1m", "2m", "5m"] as Duration[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex-1 py-1.5 text-xs rounded-md transition-all font-medium ${duration === d ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="section-label">⚙️ Quality</label>
              <div className="grid grid-cols-3 gap-2">
                {(["Fast", "Good", "Best"] as Quality[]).map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`py-2 text-[10px] uppercase font-bold tracking-widest border rounded-md transition-all ${quality === q ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300' : 'border-white/10 text-white/40 hover:bg-white/5 hover:text-white'}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="section-label">⚙️ Aspect Ratio</label>
              <div className="grid grid-cols-4 gap-2">
                {(["16:9", "9:16", "1:1", "4:3"] as AspectRatio[]).map((ar) => (
                  <button
                    key={ar}
                    onClick={() => setAspectRatio(ar)}
                    className={`flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-bold border rounded-md transition-all ${aspectRatio === ar ? 'border-white bg-white/10 text-white' : 'border-white/10 text-white/40 hover:bg-white/5 hover:text-white'}`}
                  >
                    {ar === "16:9" && <Monitor size={12} />}
                    {ar === "9:16" && <Smartphone size={12} />}
                    {ar === "1:1" && <Square size={12} />}
                    {ar === "4:3" && <Maximize2 size={12} />}
                    <span>{ar}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Generate Button Area */}
          <div className="pt-4 flex flex-col gap-3 mt-auto">
            <button 
              disabled={isGenerating || !prompt}
              onClick={handleGenerate}
              className={`w-full py-5 rounded-2xl font-bold text-sm tracking-[0.2em] transition-all shadow-2xl relative group ${isGenerating || !prompt ? 'opacity-50 cursor-not-allowed bg-white/5 text-white/20' : 'btn-primary'}`}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-3">
                  <RotateCw className="animate-spin" size={18} />
                  <span>GENERATING...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span>🚀 GENERATE VIDEO</span>
                </div>
              )}
            </button>
            <div className="flex gap-2">
              <button 
                disabled={!generatedVideo}
                className="flex-1 py-3 btn-secondary rounded-xl text-[11px] font-bold uppercase tracking-wider disabled:opacity-30 transition-all"
              >
                [Download]
              </button>
              <button 
                onClick={() => { setGeneratedVideo(null); setPrompt(""); setProgress(0); }}
                className="flex-1 py-3 btn-secondary rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all"
              >
                [New Project]
              </button>
            </div>
          </div>
        </aside>

        {/* Right Column: Preview Area */}
        <section className="flex-1 p-10 flex flex-col bg-black relative">
          <div className="flex-1 rounded-[32px] bg-gradient-to-b from-[#111] to-black border border-white/10 relative overflow-hidden shadow-inner flex flex-col group">
            
            {/* Action Bar (Top) */}
            <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                 Preview Mode
               </div>
               {isGenerating && (
                 <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-indigo-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-white/40">{Math.round(progress)}%</span>
                 </div>
               )}
            </div>

            <div className="flex-1 flex items-center justify-center relative bg-center bg-cover" style={{ backgroundImage: generatedVideo ? 'none' : 'radial-gradient(circle at 50% 50%, #151515 0%, #000 100%)' }}>
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div 
                    key="generating"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-8 text-center max-w-sm z-10"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-serif italic text-white/80">Creating Video...</h3>
                      <p className="text-sm text-white/40 h-6">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={messageIndex}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="block italic"
                          >
                            {REASSURING_MESSAGES[messageIndex]}
                          </motion.span>
                        </AnimatePresence>
                      </p>
                    </div>
                  </motion.div>
                ) : generatedVideo ? (
                  <motion.div 
                    key="video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full"
                  >
                    <video 
                      src={generatedVideo} 
                      className="w-full h-full object-contain"
                      controls
                      autoPlay
                      loop
                    />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    className="flex flex-col items-center gap-6 text-center"
                  >
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center animate-pulse shadow-2xl border border-white/10">
                      <Play size={32} className="text-white/20 ml-1" />
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-2xl font-serif italic text-white/80">🎥 PREVIEW</h2>
                       <p className="text-white/30 text-sm max-w-[240px]">Your masterpiece will appear here after generation</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Player Controls Replacement for static design feel */}
              {!isGenerating && generatedVideo && (
                 <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-8 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-white/40 hover:text-white transition-colors"><RotateCw size={20} /></button>
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform">
                      <Play size={20} fill="currentColor" className="ml-1" />
                    </button>
                    <button className="text-white/40 hover:text-white transition-colors"><Maximize2 size={20} /></button>
                 </div>
              )}

              {error && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0a] border border-red-500/50 p-6 rounded-2xl flex flex-col items-center gap-3 text-red-100 z-50 shadow-2xl">
                  <AlertCircle size={32} className="text-red-400" />
                  <span className="text-sm font-medium">{error}</span>
                  <button onClick={handleGenerate} className="text-xs text-white/40 hover:text-white underline">Try Again</button>
                </div>
              )}
            </div>
          </div>

          {/* Footer Status */}
          <footer className="h-12 flex items-center justify-between px-2 pt-4 shrink-0">
            <div className="flex items-center gap-2 text-white/30">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[10px] uppercase tracking-widest font-bold">💾 7-day auto-save enabled</span>
            </div>
            <div className="flex gap-6 items-center">
              <span className="text-[10px] text-white/20 tracking-tighter">PROJECT: {generatedVideo ? 'NEONTOKYO_V4.MP4' : 'UNTITLED_PROJECT'}</span>
              <span className="text-[10px] text-white/20 font-mono">1920X1080 | 30FPS</span>
            </div>
          </footer>

          {/* Background ambient lighting */}
          <div className="absolute inset-0 pointer-events-none z-0">
             <div className="absolute top-[-20%] left-[10%] w-[60%] h-[60%] bg-indigo-500/5 blur-[150px] rounded-full" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[150px] rounded-full" />
          </div>
        </section>
      </main>
    </div>
  );
}
