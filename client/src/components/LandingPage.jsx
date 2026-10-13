import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  Layers, 
  Calendar, 
  CheckCircle2, 
  Bot, 
  Users, 
  CheckSquare, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FolderKanban,
  BarChart3,
  Cpu,
  Share2,
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
  ShieldCheck,
  Star,
  Package,
  FileCheck2,
  Menu,
  X,
  Copy,
  Check,
  Clock,
  Zap,
  Target,
  Sparkle,
  Sliders,
  DollarSign,
  Workflow,
  Laptop
} from 'lucide-react';
import DemoModal from './DemoModal';

export default function LandingPage({ onLaunchApp }) {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

  // Interactive Visual Story tab state
  const [activeStoryTab, setActiveStoryTab] = useState('clients');

  // Interactive Dashboard Preview tab state
  const [previewTab, setPreviewTab] = useState('overview');

  // Interactive AI Simulator state
  const [selectedAIPreset, setSelectedAIPreset] = useState('festive');
  const [copiedAI, setCopiedAI] = useState(false);

  // Scrollspy & Scroll Progress Handler
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const currentScroll = window.scrollY;
      const progress = totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0;
      setScrollProgress(progress);

      const sections = [
        'hero',
        'clients',
        'features',
        'visual-story',
        'workflow',
        'preview',
        'ai-studio',
        'showcase',
        'impact',
        'footer'
      ];

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180 && rect.bottom >= 180) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll helper
  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Preset prompts for the Interactive AI Generator Simulator
  const aiPresets = {
    festive: {
      label: 'Navratri Festive Reel',
      hook: '🔥 When traditional garba energy meets high-fashion streetwear aesthetics...',
      visual: 'Dynamic slow-mo 60fps shot of Dandiya sticks hitting in sync with bass drop, neon violet backlighting and traditional mirror-work highlights.',
      caption: 'This Navratri, celebrate with heritage pride and unapologetic modern style. Discover the limited edition festive collection crafted for real celebrations.',
      hashtags: '#Navratri2026 #DiGiTrendCreative #FestiveFashion #GarbaNights #VisualIdentity',
      cta: 'Double-tap if your festive wardrobe is ready! DM "FESTIVE" for early VIP catalog access.'
    },
    b2b: {
      label: 'B2B SaaS Growth Post',
      hook: '💡 83% of creative agencies bleed margins not on talent, but on task coordination chaos.',
      visual: 'High-contrast split visual: Left side showing messy WhatsApp notifications & spreadsheets; Right side showing pristine DiGi Trend Ops dashboard.',
      caption: 'Stop running your creative business on fragmented chat groups. A unified creative operations platform cuts turnaround time by 60% and guarantees client retention.',
      hashtags: '#CreativeOps #AgencyGrowth #B2BSaaS #ProductivitySystems #ExecutiveLeadership',
      cta: 'Swipe through the 5-point agency audit. Drop a comment for our 2026 agency profitability blueprint.'
    },
    luxury: {
      label: 'Luxury Brand Identity',
      hook: '✨ True luxury never screams. It whispers with uncompromising precision.',
      visual: 'Macro close-up on embossed matte black foil packaging with warm amber directional lighting and minimalist serif typography.',
      caption: 'Every curve, tone, and tactile finish tells your customer what you stand for before they even touch the product. Bespoke brand architecture built to endure.',
      hashtags: '#LuxuryBranding #EditorialDesign #BrandArchitecture #MinimalAesthetic #PackagingDesign',
      cta: 'Explore the full monograph at the link in bio. Private consultations by appointment.'
    },
    viral: {
      label: 'Viral D2C Reel Script',
      hook: '⚡ Stop scrolling if your brand still posts boring stock images in 2026.',
      visual: 'Fast 1.2s hook cut: hand slapping camera lens to transition from dull grey warehouse to vibrant neon-infused creative production set.',
      caption: 'Audience attention spans are under 2 seconds. If your first frame doesn’t disrupt their pattern, your budget is burning. Here are 3 hook formulas you can steal today.',
      hashtags: '#ViralMarketing #CreativeStrategy #VideoProduction #ContentHooks #SocialMediaGrowth',
      cta: 'Bookmark this reel for your next shoot. Which formula are you testing this week?'
    }
  };

  const handleCopyAI = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedAI(true);
    setTimeout(() => setCopiedAI(false), 2000);
  };

  // Client Logos for Marquee
  const clientLogos = [
    { name: 'Jagdamba Agro Polymers', tag: 'Agriculture & Exports', color: 'from-emerald-500 to-teal-600' },
    { name: 'Falcon Precision Tech', tag: 'Industrial Engineering', color: 'from-blue-600 to-cyan-500' },
    { name: 'Velvet Luxe Cosmetics', tag: 'D2C Beauty & Lifestyle', color: 'from-pink-500 to-rose-600' },
    { name: 'Orbit Cloud ERP', tag: 'Enterprise Tech', color: 'from-purple-600 to-indigo-600' },
    { name: 'Saurashtra Spices', tag: 'Food & FMCG Brand', color: 'from-amber-500 to-orange-600' },
    { name: 'Silverline Packaging', tag: 'Sustainable Materials', color: 'from-slate-600 to-slate-800' },
    { name: 'Apex Media Works', tag: 'Film & Production', color: 'from-violet-600 to-purple-800' },
    { name: 'Zenith Digital India', tag: 'Omnichannel Retail', color: 'from-cyan-600 to-blue-700' }
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-purple-500/30 selection:text-purple-700 font-['Plus_Jakarta_Sans'] overflow-x-hidden">
      
      {/* =========================================================================
          FIXED TOP NAVBAR (High Impact, Scrollspy Active Section, Responsive Drawer)
         ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm transition-all duration-300">
        
        {/* Dynamic Top Scroll Progress Indicator */}
        <div 
          className="h-[3px] bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
          
          {/* Logo & Agency Branding */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group" 
            onClick={() => scrollTo('hero')}
          >
            {/* Hexagonal 3D Isometric Gradient Logo */}
            <div className="w-10 h-10 relative flex items-center justify-center transition-transform group-hover:scale-105">
              <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
                <polygon points="20,2 38,12 38,28 20,38 2,28 2,12" fill="none" stroke="url(#navHexGrad)" strokeWidth="4" />
                <defs>
                  <linearGradient id="navHexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <path d="M 20 20 L 38 12 M 20 20 L 20 38 M 20 20 L 2 12" stroke="url(#navHexGrad)" strokeWidth="3" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 font-['Outfit'] block leading-none">
                  DiGi Trend
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Live" />
              </div>
              <span className="text-[10px] text-slate-400 tracking-wider font-semibold uppercase">
                Branding Solutions
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links — Full Section Coverage */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-slate-600">
            {[
              { id: 'hero', label: 'Home' },
              { id: 'clients', label: 'Clients' },
              { id: 'features', label: 'Features' },
              { id: 'visual-story', label: 'Platform Story' },
              { id: 'workflow', label: 'Workflow' },
              { id: 'preview', label: 'Workspace' },
              { id: 'ai-studio', label: 'AI Studio' },
              { id: 'showcase', label: 'Creative 2026' },
              { id: 'impact', label: 'Impact' },
              { id: 'footer', label: 'About' }
            ].map(item => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-purple-100 text-purple-700 font-bold shadow-sm' 
                      : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
                  }`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onLaunchApp('dashboard')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200 px-6 py-6 space-y-3 shadow-2xl animate-in slide-in-from-top-4 duration-200">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              {[
                { id: 'hero', label: 'Home' },
                { id: 'clients', label: 'Clients' },
                { id: 'features', label: 'Features' },
                { id: 'visual-story', label: 'Platform Story' },
                { id: 'workflow', label: 'Workflow' },
                { id: 'preview', label: 'Workspace' },
                { id: 'ai-studio', label: 'AI Studio' },
                { id: 'showcase', label: 'Creative 2026' },
                { id: 'impact', label: 'ROI & Impact' },
                { id: 'footer', label: 'About & Contact' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`text-left px-3 py-2.5 rounded-xl transition-all ${
                    activeSection === item.id 
                      ? 'bg-purple-100 text-purple-700 font-bold' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLaunchApp('dashboard');
                }}
                className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold text-xs text-center shadow-md shadow-purple-600/30"
              >
                Launch Live App
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsDemoModalOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs text-center hover:bg-slate-200"
              >
                Book Demo
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Spacer for Fixed Header */}
      <div className="h-20" />

      {/* =========================================================================
          HERO SECTION (High-Impact Dark Canvas, 3D Mockup, Floating Badges & Live Stats)
         ========================================================================= */}
      <section id="hero" className="px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <div className="max-w-7xl mx-auto rounded-[36px] bg-[#080d1d] text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-slate-800/80">
          
          {/* Ambient Multi-Hue Glow Auras */}
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/25 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
          <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Subtle Cyber Grid Background */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left Column: Headlines, copy, and CTAs */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              {/* Badge: Creative Operations Platform */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-slate-200 text-xs font-semibold backdrop-blur-md shadow-inner">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span className="text-purple-300 font-bold uppercase tracking-wider text-[10px]">DiGi Trend 2026</span>
                <span className="text-slate-400">·</span>
                <span>Creative Operations Platform</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-1.5">
                <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.1] font-['Outfit'] text-white">
                  From Ideas to Impact
                </h1>
                <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.1] font-['Outfit']">
                  <span>Manage, </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300">
                    Create & Grow
                  </span>
                </h2>
                <h3 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.1] font-['Outfit'] text-white">
                  All in One Place
                </h3>
              </div>

              {/* Subtitle paragraph */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg font-normal">
                Plan content calendars, orchestrate creative task pipelines, collaborate with cross-functional teams, and harness Google Gemini AI to craft high-converting campaigns — 10x faster.
              </p>

              {/* Dual Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onLaunchApp('dashboard')}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-purple-600/35 transition-all flex items-center gap-2.5 hover:scale-105 active:scale-95 group"
                >
                  <span>Launch Live Workspace</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  className="px-6 py-3.5 rounded-full bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2.5 transition-all hover:border-slate-500 shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Schedule Live Demo</span>
                </button>
              </div>

              {/* Micro Trust Indicators */}
              <div className="pt-3 flex items-center gap-6 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span>Built-in Gemini AI</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>24h SLA Tracking</span>
                </div>
              </div>

            </div>

            {/* Right Column: 3D Laptop Display + Side Tablet + Floating Social & AI Badges */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              
              {/* Floating 3D Badge 1: AI (Purple top-right) */}
              <div className="absolute -top-4 right-1/4 z-30 w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center font-black text-sm shadow-xl shadow-purple-600/40 border border-purple-400/40 animate-float-slow">
                <Sparkles className="w-5 h-5 text-purple-200" />
              </div>

              {/* Floating 3D Badge 2: Instagram (Pink top-left) */}
              <div className="absolute top-10 -left-3 z-30 w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 border border-white/20 animate-float-reverse">
                <Instagram className="w-5 h-5" />
              </div>

              {/* Floating 3D Badge 3: LinkedIn (Cyan/Blue top-right) */}
              <div className="absolute top-6 right-6 z-30 w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20 animate-float-slow">
                <Linkedin className="w-4 h-4" />
              </div>

              {/* Floating 3D Badge 4: YouTube (Red far-right) */}
              <div className="absolute top-1/3 -right-4 z-30 w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30 border border-white/20 animate-float-reverse">
                <Youtube className="w-5 h-5" />
              </div>

              {/* Floating 3D Badge 5: Facebook (Blue bottom-left) */}
              <div className="absolute bottom-8 -left-4 z-30 w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20 animate-float-slow">
                <Facebook className="w-5 h-5" />
              </div>

              {/* Realistic 3D Laptop Display Container */}
              <div 
                onClick={() => onLaunchApp('dashboard')}
                className="w-full max-w-lg aspect-[1.3/1] rounded-2xl bg-[#0f172a] p-3 shadow-2xl border border-slate-700/80 cursor-pointer group hover:border-purple-500/70 transition-all relative transform hover:-translate-y-1 duration-300"
              >
                {/* Laptop Screen Bezel */}
                <div className="w-full h-full rounded-xl bg-white overflow-hidden p-3.5 flex flex-col justify-between text-slate-800 shadow-inner">
                  
                  {/* Window Bar */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="text-[11px] font-bold text-slate-800 ml-2">DiGi Trend Workspace</span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200">
                      Live Ops
                    </span>
                  </div>

                  {/* Dashboard Cards inside Screen */}
                  <div className="grid grid-cols-3 gap-2.5 my-auto">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-semibold block">Retainer Clients</span>
                      <span className="text-base font-black text-slate-900 font-['Outfit']">12</span>
                      <span className="text-[8px] text-emerald-600 font-bold block mt-0.5">↑ +2 this month</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100">
                      <span className="text-[9px] text-purple-600 font-semibold block">Active Projects</span>
                      <span className="text-base font-black text-purple-700 font-['Outfit']">8</span>
                      <span className="text-[8px] text-purple-500 font-bold block mt-0.5">48 Tasks</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                      <span className="text-[9px] text-emerald-600 font-semibold block">Monthly Revenue</span>
                      <span className="text-xs sm:text-sm font-black text-emerald-700 font-['Outfit']">₹3.85L</span>
                      <span className="text-[8px] text-emerald-600 font-bold block mt-0.5">100% Invoiced</span>
                    </div>
                  </div>

                  {/* Task and Velocity Mini Chart */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-semibold text-slate-700">Sprint SLA Velocity: 94%</span>
                    </div>
                    <span className="text-purple-600 font-bold flex items-center gap-1 group-hover:underline">
                      View Console ➔
                    </span>
                  </div>
                </div>

                {/* Floating Tablet Screen next to Laptop (Right side) */}
                <div className="absolute -bottom-4 -right-4 w-40 h-52 rounded-xl bg-[#090d1a] border border-slate-600 p-2.5 shadow-2xl hidden sm:flex flex-col justify-between z-20">
                  <div className="text-[9px] font-bold text-slate-300 pb-1.5 border-b border-slate-800 flex justify-between items-center">
                    <span>Task Pipeline</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="space-y-1.5 my-auto text-[9px]">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 truncate flex items-center justify-between">
                      <span>Navratri Banner</span>
                      <span className="text-[8px] px-1 py-0.2 rounded bg-rose-950 text-rose-300">High</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 truncate flex items-center justify-between">
                      <span>Reel Concept</span>
                      <span className="text-[8px] px-1 py-0.2 rounded bg-amber-950 text-amber-300">Review</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 truncate flex items-center justify-between">
                      <span>ERP Brochure</span>
                      <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-950 text-emerald-300">Done</span>
                    </div>
                  </div>
                  <div className="text-[8px] text-purple-400 text-center font-bold bg-purple-950/40 py-1 rounded">
                    ⚡ Gemini AI Synced
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Bottom 4-Column Stats Strip inside Dark Container */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-slate-800/80 mt-12 text-left">
            
            {/* Stat 1 */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/50">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">50+</div>
                <div className="text-xs text-slate-400 font-medium">Happy Clients</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/50">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <FolderKanban className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">120+</div>
                <div className="text-xs text-slate-400 font-medium">Campaigns Delivered</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/50">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">1M+</div>
                <div className="text-xs text-slate-400 font-medium">Creative Assets</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/50">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">99.4%</div>
                <div className="text-xs text-slate-400 font-medium">Client Satisfaction</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          CLIENT LOGOS MARQUEE (Social Proof, Infinite Looping Brand Showcase)
         ========================================================================= */}
      <section id="clients" className="py-12 bg-slate-50/70 border-y border-slate-200/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest block">
            Trusted by Leading Growth Brands & Creative Teams across Gujarat & India
          </span>
        </div>

        {/* Looping Marquee Ribbon */}
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee flex items-center gap-6">
            {[...clientLogos, ...clientLogos].map((client, idx) => (
              <div 
                key={idx}
                className="shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onLaunchApp('clients')}
              >
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${client.color} flex items-center justify-center text-white font-black text-xs`}>
                  {client.name.charAt(0)}
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 font-['Outfit'] block leading-tight">
                    {client.name}
                  </span>
                  <span className="text-[10px] text-slate-600 font-medium">
                    {client.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: EVERYTHING YOU NEED, IN ONE PLACE (5 Core Pillars)
         ========================================================================= */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="text-left space-y-2">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-widest block">
                Integrated Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-['Outfit'] tracking-tight">
                Everything You Need, In One Place
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                Manage your entire creative operation seamlessly — from initial client requests to final cross-platform distribution.
              </p>
            </div>
            
            <button
              onClick={() => onLaunchApp('dashboard')}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 self-start md:self-end"
            >
              <span>Explore all modules</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 5 Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            
            {/* Card 1: Client Management */}
            <div 
              onClick={() => onLaunchApp('clients')}
              className="bg-white p-6 rounded-3xl border border-slate-200/90 hover:border-purple-300 hover:shadow-xl transition-all duration-300 space-y-4 cursor-pointer group shadow-sm flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
                  Client Management
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Keep all client briefs, retainer scopes, brand assets & stakeholder contacts unified.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-purple-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View Client CRM</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Card 2: Task Management */}
            <div 
              onClick={() => onLaunchApp('tasks')}
              className="bg-white p-6 rounded-3xl border border-slate-200/90 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 space-y-4 cursor-pointer group shadow-sm flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
                  Task Management
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kanban task tracking, priority SLA queues, designer workloads & instant approvals.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Manage Deliverables</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Card 3: Content Planner */}
            <div 
              onClick={() => onLaunchApp('content')}
              className="bg-white p-6 rounded-3xl border border-slate-200/90 hover:border-purple-300 hover:shadow-xl transition-all duration-300 space-y-4 cursor-pointer group shadow-sm flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
                  Content Planner
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Plan, schedule & visualize social posts across Instagram, LinkedIn, YouTube & Facebook.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-purple-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Open Calendar</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Card 4: Creative Assistant */}
            <div 
              onClick={() => onLaunchApp('ai')}
              className="bg-white p-6 rounded-3xl border border-slate-200/90 hover:border-pink-300 hover:shadow-xl transition-all duration-300 space-y-4 cursor-pointer group shadow-sm flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
                  Creative Assistant
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generate hooks, captions, visual art directions & curated hashtags with Gemini AI.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-pink-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Try Gemini AI</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Card 5: Analytics & Reports */}
            <div 
              onClick={() => onLaunchApp('dashboard')}
              className="bg-white p-6 rounded-3xl border border-slate-200/90 hover:border-blue-300 hover:shadow-xl transition-all duration-300 space-y-4 cursor-pointer group shadow-sm flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
                  Analytics & Growth
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Track retainer revenue, throughput velocity, project margins & monthly growth.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View Analytics</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          VISUAL STORY SECTION: WHAT THE PLATFORM DOES (Interactive Journey Switcher)
         ========================================================================= */}
      <section id="visual-story" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">
              The Visual Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] tracking-tight">
              A Connected Engine for Creative Velocity
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              See how DiGi Trend orchestrates the 5 foundational pillars of high-performing creative agencies.
            </p>
          </div>

          {/* Interactive Navigation Pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
            {[
              { id: 'clients', label: '1. Retainer Clients', icon: Users },
              { id: 'tasks', label: '2. Task Kanban', icon: CheckSquare },
              { id: 'content', label: '3. Content Calendar', icon: Calendar },
              { id: 'ai', label: '4. Gemini AI Engine', icon: Bot },
              { id: 'growth', label: '5. Growth & Metrics', icon: TrendingUp }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeStoryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveStoryTab(tab.id)}
                  className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 scale-105'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Story Stage Showcase */}
          <div className="bg-[#0b1021] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Story Explanatory Details */}
            <div className="lg:col-span-5 space-y-5 text-left">
              {activeStoryTab === 'clients' && (
                <>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
                    <span>Pillar 01 · Client Operations</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black font-['Outfit']">
                    Never Lose a Client Brief or Brand Guideline Again
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Store brand typography, hex codes, target demographic personas, contract values, and key stakeholders in a single source of truth.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Retainer contracts with monthly renewal alerts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>One-click access to brand drive folders & guidelines</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Full deliverable history mapped by client account</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => onLaunchApp('clients')}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 transition-all"
                  >
                    <span>Launch Client Manager</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              {activeStoryTab === 'tasks' && (
                <>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                    <span>Pillar 02 · Task Production</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black font-['Outfit']">
                    High-Throughput Kanban with 24h SLA Protection
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Prioritize tasks with Low, Medium, High, and Urgent badges. Filter by client, service type, or status with sub-second responsiveness.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Instant status toggle: To Do ➔ In Progress ➔ Review ➔ Completed</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Task detail modal with reference design attachments</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Designer workload balancing & priority reordering</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => onLaunchApp('tasks')}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-all"
                  >
                    <span>Open Task Pipeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              {activeStoryTab === 'content' && (
                <>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold">
                    <span>Pillar 03 · Omnichannel Content</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black font-['Outfit']">
                    Visual Calendar for Multi-Brand Social Campaigns
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Schedule, preview, and organize social media posts across Instagram, LinkedIn, YouTube, and Facebook without missing peak engagement windows.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Multi-platform calendar view with client colour codes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Built-in post scheduler with copy & caption drafts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Hashtag libraries & media attachment previews</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => onLaunchApp('content')}
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-2 transition-all"
                  >
                    <span>Open Content Calendar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              {activeStoryTab === 'ai' && (
                <>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold">
                    <span>Pillar 04 · Gemini Creative Intelligence</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black font-['Outfit']">
                    Turn Vague Client Requests into 5-Part Creative Briefs
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Integrated with Google Gemini Flash to output complete production-ready briefs: Hooks, Visual Directions, Captions, Hashtags, and Alternate CTAs.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>5-part structured brief output ready for designers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Full generation history with one-click copy</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Contextual offline fallback for guaranteed uptime</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => onLaunchApp('ai')}
                    className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-2 transition-all"
                  >
                    <span>Launch AI Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              {activeStoryTab === 'growth' && (
                <>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold">
                    <span>Pillar 05 · Retainer Revenue & Scalability</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black font-['Outfit']">
                    Real-Time Business KPIs for Agency Executives
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Track monthly retainer revenue (₹3.85L), client retention rates, pending creative bottlenecks, and SLA fulfillment in real-time.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>6-month retainer revenue progression charts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Task status breakdown & team velocity metrics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Automated monthly agency performance reports</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => onLaunchApp('dashboard')}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-all"
                  >
                    <span>View Executive Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>

            {/* Simulated Live UI Preview Screen */}
            <div className="lg:col-span-7 bg-[#070b16] rounded-2xl border border-slate-700/80 p-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-300 font-bold ml-2">DiGi Trend / {activeStoryTab.toUpperCase()}</span>
                </div>
                <span className="text-[10px] text-purple-400 font-mono">v2.4.0-PRO</span>
              </div>

              {/* Dynamic UI Content based on active Tab */}
              <div className="py-4 space-y-3">
                {activeStoryTab === 'clients' && (
                  <div className="space-y-2.5">
                    {[
                      { name: 'Jagdamba Agro Polymers', retainer: '₹75,000/mo', deliverables: '16 Posts + 4 Reels', status: 'Active' },
                      { name: 'Falcon Precision Tech', retainer: '₹60,000/mo', deliverables: '8 Carousels + B2B Case Study', status: 'Active' },
                      { name: 'Velvet Luxe Cosmetics', retainer: '₹90,000/mo', deliverables: 'Full Campaign + Influencer Kit', status: 'Active' }
                    ].map((c, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white block">{c.name}</span>
                          <span className="text-[10px] text-slate-400">{c.deliverables}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-400 block">{c.retainer}</span>
                          <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">{c.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeStoryTab === 'tasks' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">In Progress (3)</span>
                      <div className="p-2 rounded-lg bg-slate-800/80 text-[11px] text-slate-200">
                        <span className="font-semibold block">Navratri Banner 02</span>
                        <span className="text-[9px] text-slate-400">Assigned: Riya Shah</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-800/80 text-[11px] text-slate-200">
                        <span className="font-semibold block">Agro Pipe 3D Render</span>
                        <span className="text-[9px] text-slate-400">Assigned: Amit Patel</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Review & Ready (2)</span>
                      <div className="p-2 rounded-lg bg-slate-800/80 text-[11px] text-slate-200">
                        <span className="font-semibold block">Velvet Serum Reel</span>
                        <span className="text-[9px] text-emerald-400">Client Approved</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-800/80 text-[11px] text-slate-200">
                        <span className="font-semibold block">ERP Case Study PDF</span>
                        <span className="text-[9px] text-purple-400">Pending Feedback</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeStoryTab === 'content' && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-slate-400 pb-1 border-b border-slate-800">
                      <span>Mon 12</span>
                      <span className="text-purple-400">Tue 13 (Today)</span>
                      <span>Wed 14</span>
                      <span>Thu 15</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-[10px]">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">Published (2)</div>
                      <div className="p-2 rounded-lg bg-purple-900/30 border border-purple-600/50 text-purple-200 font-bold">
                        <div>IG Reel 6PM</div>
                        <div className="text-[8px] text-emerald-400">Scheduled</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">LinkedIn Post</div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">YouTube Short</div>
                    </div>
                  </div>
                )}

                {activeStoryTab === 'ai' && (
                  <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-purple-400 uppercase">Gemini 1.5 Output</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-200">220ms</span>
                    </div>
                    <div className="text-slate-200 font-semibold text-xs">
                      "Why 83% of Gujarat Manufacturing Brands Lose Customers to Generic Design"
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Visual Direction: High-contrast macro lighting on precision machinery vs dull blurred stock visuals.
                    </div>
                  </div>
                )}

                {activeStoryTab === 'growth' && (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[9px] text-slate-400 block">Total Revenue</span>
                      <span className="text-sm font-black text-emerald-400 font-['Outfit']">₹3,85,000</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[9px] text-slate-400 block">On-Time SLA</span>
                      <span className="text-sm font-black text-purple-400 font-['Outfit']">94.2%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[9px] text-slate-400 block">Creatives Made</span>
                      <span className="text-sm font-black text-cyan-400 font-['Outfit']">142</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: HOW IT WORKS (5 Sequential Stages with Connected Arrows)
         ========================================================================= */}
      <section id="workflow" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          
          <div className="text-left mb-16 space-y-2">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest block">
              Operational Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-['Outfit'] tracking-tight">
              How It Works: 5 Steps to Velocity
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Simple steps. Uncompromising execution. Measurable growth.
            </p>
          </div>

          {/* 5 Connected Stages with Horizontal Arrows */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 relative">
            
            {/* Step 01 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-purple-300 transition-all space-y-3 relative text-left group">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform">
                01
              </div>
              <h4 className="font-bold text-sm text-slate-900 font-['Outfit']">Client Request</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Centralized brief intake with automated brand asset mapping.
              </p>
              <div className="hidden lg:block absolute top-8 -right-3 text-slate-300 z-10">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            {/* Step 02 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all space-y-3 relative text-left group">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform">
                02
              </div>
              <h4 className="font-bold text-sm text-slate-900 font-['Outfit']">Plan & AI Brief</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Assign tasks and generate multi-angle concepts with Gemini.
              </p>
              <div className="hidden lg:block absolute top-8 -right-3 text-slate-300 z-10">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            {/* Step 03 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-purple-300 transition-all space-y-3 relative text-left group">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform">
                03
              </div>
              <h4 className="font-bold text-sm text-slate-900 font-['Outfit']">Collaborate</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Designers and copywriters execute with real-time feedback loops.
              </p>
              <div className="hidden lg:block absolute top-8 -right-3 text-slate-300 z-10">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            {/* Step 04 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all space-y-3 relative text-left group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform">
                04
              </div>
              <h4 className="font-bold text-sm text-slate-900 font-['Outfit']">Review & QA</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Client approvals, brand compliance checks and schedule sync.
              </p>
              <div className="hidden lg:block absolute top-8 -right-3 text-slate-300 z-10">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            {/* Step 05 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-pink-300 transition-all space-y-3 text-left group">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-700 border border-pink-200 flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform">
                05
              </div>
              <h4 className="font-bold text-sm text-slate-900 font-['Outfit']">Deliver & Scale</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Publish across platforms and measure retainer ROI metrics.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: INTERACTIVE DASHBOARD & WORKSPACE PREVIEW
         ========================================================================= */}
      <section id="preview" className="px-4 sm:px-6 lg:px-8 py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto rounded-[36px] bg-[#090e1d] text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-slate-800">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Real Agency Dashboard Screen Mockup (6 Cols) */}
            <div 
              onClick={() => onLaunchApp('dashboard')}
              className="lg:col-span-6 bg-white rounded-2xl overflow-hidden shadow-2xl text-slate-800 p-5 border border-slate-200 cursor-pointer group hover:scale-[1.01] transition-transform duration-300"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
                  <span>DiGi Trend Live Operations Console</span>
                </div>
                <span className="text-purple-600 font-bold group-hover:underline flex items-center gap-1">
                  Open Workspace ➔
                </span>
              </div>

              {/* Stat Boxes */}
              <div className="grid grid-cols-2 gap-2.5 my-3.5">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[9px] text-slate-400 font-semibold block">Total Clients</span>
                  <span className="text-lg font-black text-slate-900 font-['Outfit']">12</span>
                  <span className="text-[8px] text-emerald-600 font-bold">100% active</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[9px] text-slate-400 font-semibold block">Tasks In Sprint</span>
                  <span className="text-lg font-black text-purple-600 font-['Outfit']">48</span>
                  <span className="text-[8px] text-purple-600 font-bold">94% On Time</span>
                </div>
              </div>

              {/* Progress and Chart Representation */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Deliverables SLA Velocity</span>
                  <span className="text-[10px] text-slate-400">Target 40h delivery window</span>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-purple-600 border-t-cyan-400 border-r-emerald-400 flex items-center justify-center font-bold text-xs text-slate-800">
                  94%
                </div>
              </div>
            </div>

            {/* Center/Right Column: Text & Try AI Assistant Button (6 Cols) */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block">
                Live Studio Experience
              </span>
              <h3 className="text-3xl sm:text-4xl font-black text-white font-['Outfit'] leading-tight">
                Designed for Creative Directors, Made for Velocity
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                Replace fragmented Trello boards, lost WhatsApp approvals, and forgotten spreadsheets with a purpose-built workspace engineered for Indian agency workflows.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onLaunchApp('dashboard')}
                  className="px-6 py-3.5 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <span>Explore Live Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onLaunchApp('ai')}
                  className="px-6 py-3.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-purple-300 font-bold text-xs border border-purple-500/30 flex items-center gap-2 transition-all"
                >
                  <Bot className="w-4 h-4" />
                  <span>Try AI Assistant</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE AI STUDIO SANDBOX (Try AI directly on the Landing Page)
         ========================================================================= */}
      <section id="ai-studio" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest block">
              Live AI Playground
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-['Outfit'] tracking-tight">
              Test Drive the Gemini Creative Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select an agency use-case below to test our 5-part structured creative brief generator.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Preset Selector Buttons (Left 4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Select Creative Prompt
              </span>
              {Object.keys(aiPresets).map((key) => {
                const preset = aiPresets[key];
                const isSelected = selectedAIPreset === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedAIPreset(key)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-50 border-purple-400 text-purple-900 shadow-sm font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-purple-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs">{preset.label}</span>
                    <Sparkles className={`w-4 h-4 ${isSelected ? 'text-purple-600' : 'text-slate-400'}`} />
                  </button>
                );
              })}

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 mt-4 text-xs text-slate-600">
                <span className="font-bold text-slate-900 block">Why 5-Part Briefs?</span>
                <p className="text-[11px] leading-relaxed">
                  Most AI tools give loose text. DiGi Trend forces structural consistency so designers can jump directly into Figma without clarifying rounds.
                </p>
              </div>
            </div>

            {/* Generated Brief Card Output (Right 8 cols) */}
            <div className="lg:col-span-8 bg-[#0a0f1d] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-5">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Gemini 1.5 Structured Output</span>
                    <span className="text-[10px] text-slate-400">{aiPresets[selectedAIPreset].label}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyAI(
                    `${aiPresets[selectedAIPreset].hook}\n\n${aiPresets[selectedAIPreset].visual}\n\n${aiPresets[selectedAIPreset].caption}\n\n${aiPresets[selectedAIPreset].hashtags}\n\n${aiPresets[selectedAIPreset].cta}`
                  )}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  {copiedAI ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAI ? 'Copied Brief!' : 'Copy Brief'}</span>
                </button>
              </div>

              {/* 5-Part Sections */}
              <div className="space-y-4 text-xs">
                
                {/* 1. Hook */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                    1. Attention Hook
                  </span>
                  <p className="text-slate-100 font-semibold leading-relaxed">
                    {aiPresets[selectedAIPreset].hook}
                  </p>
                </div>

                {/* 2. Visual Direction */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                    2. Visual Art Direction (For Designer)
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {aiPresets[selectedAIPreset].visual}
                  </p>
                </div>

                {/* 3. Caption */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    3. Social Copy / Body Caption
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {aiPresets[selectedAIPreset].caption}
                  </p>
                </div>

                {/* 4. Hashtags & CTA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider block">
                      4. Curated Hashtags
                    </span>
                    <p className="text-purple-300 font-mono text-[11px]">
                      {aiPresets[selectedAIPreset].hashtags}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      5. Call to Action (CTA)
                    </span>
                    <p className="text-slate-300 text-[11px]">
                      {aiPresets[selectedAIPreset].cta}
                    </p>
                  </div>
                </div>

              </div>

              {/* Call to Launch Full AI Suite */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onLaunchApp('ai')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-purple-600/30 hover:scale-105 transition-all flex items-center gap-1.5"
                >
                  <span>Open Full AI Studio with Custom Inputs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 10: CREATIVE CHALLENGE — "Why Businesses Need Strong Branding in 2026"
         ========================================================================= */}
      <section id="showcase" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                Creative Challenge — Section 10
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] leading-tight">
                Why Businesses Need Strong<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">
                  Branding in 2026
                </span>
              </h2>
              <p className="text-xs text-slate-500 max-w-md">
                A bespoke 1:1 Instagram post crafted for DiGi Trend — bold typographic hierarchy, strategic positioning, and art direction purpose-built for high-converting brand authority.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 self-start sm:self-end shrink-0">
              <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2"/>
                <circle cx="12" cy="12" r="4" strokeWidth="2"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0"/>
              </svg>
              <div>
                <span className="font-bold text-slate-800 block">Instagram Feed</span>
                <span className="text-slate-400">1:1 Square Format · 1080×1080px</span>
              </div>
            </div>
          </div>

          {/* Main Content: 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* LEFT: The 1:1 Instagram Creative Post */}
            <div className="lg:col-span-5">
              <div className="relative max-w-[380px] mx-auto lg:mx-0 shadow-xl rounded-2xl overflow-hidden border border-slate-200">

                {/* Instagram UI: Top Bar */}
                <div className="bg-white px-4 py-2.5 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-[1.5px]">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-black text-[9px] text-purple-700">DT</div>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-none">digitrend.branding</span>
                      <span className="text-[10px] text-slate-400">Rajkot, Gujarat</span>
                    </div>
                  </div>
                  <button className="px-3 py-1 rounded-full bg-purple-600 text-white text-[10px] font-bold">Follow</button>
                </div>

                {/* The 1:1 Post Creative — Core Instagram Square */}
                <div className="w-full aspect-square bg-[#06040f] relative overflow-hidden flex flex-col justify-between p-7">

                  {/* Background Accents */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1a0533] via-[#06040f] to-[#0d0024] pointer-events-none" />
                  <div className="absolute top-0 right-0 w-72 h-72 bg-violet-600/20 rounded-full blur-[80px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-56 h-56 bg-indigo-800/25 rounded-full blur-[60px] pointer-events-none" />

                  {/* Editorial Graphic Rule */}
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    <div className="absolute top-1/2 left-[-20%] w-[140%] h-[1px] bg-gradient-to-r from-transparent via-violet-400/20 to-transparent rotate-[-14deg]" />
                  </div>

                  {/* TOP ROW */}
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-gradient-to-tr from-purple-500 to-indigo-400 flex items-center justify-center">
                          <span className="text-[7px] font-black text-white">D</span>
                        </div>
                        <span className="text-[9px] font-bold text-violet-300 tracking-[0.15em] uppercase">DiGi Trend</span>
                      </div>
                      <span className="text-[8px] text-slate-500 tracking-widest uppercase block">Branding Solutions · Rajkot</span>
                    </div>
                    <div className="border border-violet-500/40 rounded-lg px-2.5 py-1 bg-violet-500/10 backdrop-blur-sm">
                      <span className="text-[9px] font-black text-violet-300 tracking-wider">2026</span>
                    </div>
                  </div>

                  {/* CENTER: Primary Typographic Statement */}
                  <div className="relative z-10 space-y-4 my-auto">
                    <div className="flex items-center gap-2">
                      <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-violet-400/60" />
                      <span className="text-[8px] font-bold text-violet-400/80 tracking-[0.2em] uppercase">Branding Strategy</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-[22px] font-black leading-[1.1] tracking-tight font-['Outfit'] text-white">
                        When AI can generate
                      </h3>
                      <h3 className="text-[22px] font-black leading-[1.1] tracking-tight font-['Outfit']">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300">
                          10,000 logos
                        </span>
                        <span className="text-white"> in 10s,</span>
                      </h3>
                      <h3 className="text-[22px] font-black leading-[1.1] tracking-tight font-['Outfit'] text-slate-200">
                        sameness is commercial
                      </h3>
                      <h3 className="text-[22px] font-black leading-[1.1] tracking-tight font-['Outfit'] text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
                        suicide.
                      </h3>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed max-w-[260px]">
                      Originality is no longer a luxury—it is your single surviving commercial moat. Bespoke brand identity commands pricing power.
                    </p>

                    <div className="flex items-center gap-4 pt-1">
                      <div className="text-center">
                        <div className="text-sm font-black text-white font-['Outfit']">73%</div>
                        <div className="text-[8px] text-slate-500 leading-tight">consumers pay more<br/>for strong brands</div>
                      </div>
                      <div className="w-[1px] h-8 bg-slate-700" />
                      <div className="text-center">
                        <div className="text-sm font-black text-violet-300 font-['Outfit']">4.3×</div>
                        <div className="text-[8px] text-slate-500 leading-tight">revenue growth vs<br/>unbranded peers</div>
                      </div>
                      <div className="w-[1px] h-8 bg-slate-700" />
                      <div className="text-center">
                        <div className="text-sm font-black text-pink-300 font-['Outfit']">∞</div>
                        <div className="text-[8px] text-slate-500 leading-tight">competitive<br/>moat value</div>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ROW: CTA */}
                  <div className="relative z-10 flex items-end justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 w-fit">
                        <span className="text-[9px] font-black text-white tracking-wide uppercase">Book a Brand Audit</span>
                        <ArrowRight className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-[8px] text-slate-600 pl-1">DM 'AUDIT' to get started</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-slate-600 block">#Branding2026</span>
                      <span className="text-[8px] text-slate-600 block">#DiGiTrend</span>
                    </div>
                  </div>

                </div>

                {/* Instagram UI: Bottom Bar */}
                <div className="bg-white px-4 py-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-rose-500">
                        <svg className="w-5 h-5 fill-rose-500" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        <span className="text-[10px] font-bold text-slate-700">2,847</span>
                      </button>
                      <button className="flex items-center gap-1 text-slate-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        <span className="text-[10px] font-bold">184</span>
                      </button>
                    </div>
                    <span className="text-[9px] text-slate-400">DiGi Trend Original</span>
                  </div>
                  <div className="text-[10px] text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-800">digitrend.branding </span>
                    Originality is your only moat in 2026. Book an executive brand audit → Link in bio.
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT: Strategic Art Direction Notes */}
            <div className="lg:col-span-7 space-y-6">

              {/* The Big Idea */}
              <div className="bg-[#06040f] rounded-2xl p-6 text-white border border-violet-900/40 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">The Strategic Thesis</span>
                </div>
                <h3 className="text-lg font-black font-['Outfit'] leading-snug">
                  The <span className="text-violet-400">Commodity Paradox of 2026</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Generative AI has made generic visual creation free and instantaneous. When sameness is infinite and cheap, distinctiveness becomes the rarest and most defensible commercial asset. Strong branding is no longer decorative — it is pricing power.
                </p>
              </div>

              {/* 3-Column Design Decision Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    label: 'Typography',
                    icon: '𝐓',
                    color: 'text-violet-600',
                    bg: 'bg-violet-50',
                    border: 'border-violet-200',
                    detail: 'Outfit Black for high-impact authority. Ultra-tight tracking at 1.1 line-height to command visual hierarchy against dark canvas.'
                  },
                  {
                    label: 'Color System',
                    icon: '◉',
                    color: 'text-indigo-600',
                    bg: 'bg-indigo-50',
                    border: 'border-indigo-200',
                    detail: 'Deep space #06040f base with violet-purple accent gradient to rose. Conveys premium authority while remaining thumb-stopping in a white feed.'
                  },
                  {
                    label: 'Composition',
                    icon: '⊡',
                    color: 'text-pink-600',
                    bg: 'bg-pink-50',
                    border: 'border-pink-200',
                    detail: 'Rule-of-thirds grid with diagonal light-leak tension lines. Asymmetric stat strip creates secondary scanning path for data-driven audiences.'
                  }
                ].map((card, i) => (
                  <div key={i} className={`${card.bg} border ${card.border} rounded-xl p-4 space-y-2`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-black ${card.color}`}>{card.icon}</span>
                      <span className={`text-xs font-bold ${card.color}`}>{card.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{card.detail}</p>
                  </div>
                ))}
              </div>

              {/* Hashtag List */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-2">
                {['#Branding2026', '#DiGiTrend', '#BrandStrategy', '#AgencyLife', '#VisualIdentity', '#CreativeOps', '#MarketingIndia', '#StartupBranding', '#DesignThinking', '#RajkotBusiness'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200 text-[10px] font-bold hover:bg-violet-100 transition-colors cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: ROI & AGENCY COMPARISON MATRIX
         ========================================================================= */}
      <section id="impact" className="py-24 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest block">
              Proven Transformation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-['Outfit'] tracking-tight">
              Traditional Agency Chaos vs DiGi Trend
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Why high-output design studios switch from fragmented tools to DiGi Trend Creative Ops.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              
              {/* Old Way */}
              <div className="p-8 space-y-5 bg-rose-50/20">
                <div className="flex items-center gap-2 text-rose-600">
                  <X className="w-5 h-5" />
                  <h4 className="font-bold text-sm uppercase tracking-wider font-['Outfit']">The Traditional Chaos</h4>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Client briefs scattered across WhatsApp chats & unread emails</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Missed social calendar dates and hurried last-minute graphics</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Copywriters spend 3-4 hours brainstorming generic captions</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Zero visibility into team designer bandwidth and sprint bottlenecks</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Uncertain retainer billing and forgotten invoice follow-ups</span>
                  </li>
                </ul>
              </div>

              {/* DiGi Trend Way */}
              <div className="p-8 space-y-5 bg-purple-50/30">
                <div className="flex items-center gap-2 text-purple-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <h4 className="font-bold text-sm uppercase tracking-wider font-['Outfit']">The DiGi Trend Standard</h4>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Centralized Client CRM with brand kits and documented retainers</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Visual multi-platform content calendar with scheduled publication queues</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>5-second Google Gemini creative generation for hooks, captions & art direction</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Live Kanban task management with 24h SLA alerts and priority tags</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Executive KPI dashboard with live ₹3.85L monthly revenue tracking</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5: PASTEL IRIDESCENT CTA BANNER
         ========================================================================= */}
      <section id="cta" className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto rounded-[36px] bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-10 sm:p-16 text-center text-slate-900 space-y-6 shadow-lg relative overflow-hidden border border-purple-200/60">
          
          {/* Soft floating diamond shapes in background */}
          <div className="absolute left-10 top-1/2 -translate-y-1/2 w-36 h-36 bg-pink-300/40 rounded-3xl rotate-45 blur-xl pointer-events-none" />
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-36 h-36 bg-purple-300/40 rounded-3xl rotate-45 blur-xl pointer-events-none" />

          <span className="text-xs font-bold text-purple-700 uppercase tracking-widest block relative z-10">
            Start Scaling Today
          </span>

          <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-slate-900 relative z-10 max-w-2xl mx-auto leading-tight">
            Ready to Transform Your Creative Operations?
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto relative z-10">
            Join DiGi Trend and take your agency workflow, team output, and client satisfaction to the highest standard.
          </p>
          
          <div className="relative z-10 pt-4 flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={() => onLaunchApp('dashboard')}
              className="px-8 py-3.5 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-purple-600/30 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Launch Free Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="px-8 py-3.5 rounded-full bg-white/90 hover:bg-white text-slate-800 font-bold text-xs uppercase tracking-wider border border-purple-200 hover:scale-105 transition-all shadow-sm"
            >
              <span>Schedule Live Demo</span>
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FOOTER (Comprehensive Contact, Links & Socials)
         ========================================================================= */}
      <footer id="footer" className="border-t border-slate-200/80 py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Col 1: Brand details (4 cols) */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 relative flex items-center justify-center">
                  <svg viewBox="0 0 40 40" className="w-full h-full">
                    <polygon points="20,2 38,12 38,28 20,38 2,28 2,12" fill="none" stroke="url(#footHex)" strokeWidth="4" />
                    <defs>
                      <linearGradient id="footHex" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div>
                  <span className="font-bold text-base text-slate-900 font-['Outfit'] block leading-tight">
                    DiGi Trend
                  </span>
                  <span className="text-[10px] text-slate-400">Branding Solutions · Creative Ops</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Empowering modern creative studios, marketing agencies, and branding leaders to deliver unforgettable client impact with intelligence and speed.
              </p>

              <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All systems operational · Gemini AI v1.5 Flash Connected</span>
              </div>
            </div>

            {/* Col 2: Navigation Links (3 cols) */}
            <div className="md:col-span-3 space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block font-['Outfit']">
                Platform Navigation
              </span>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><button onClick={() => scrollTo('hero')} className="hover:text-purple-600 transition-colors">Home & Hero</button></li>
                <li><button onClick={() => scrollTo('clients')} className="hover:text-purple-600 transition-colors">Client Showcase</button></li>
                <li><button onClick={() => scrollTo('features')} className="hover:text-purple-600 transition-colors">Core Features</button></li>
                <li><button onClick={() => scrollTo('visual-story')} className="hover:text-purple-600 transition-colors">Platform Story</button></li>
                <li><button onClick={() => scrollTo('workflow')} className="hover:text-purple-600 transition-colors">Workflow Pipeline</button></li>
                <li><button onClick={() => scrollTo('ai-studio')} className="hover:text-purple-600 transition-colors">AI Studio Sandbox</button></li>
                <li><button onClick={() => scrollTo('showcase')} className="hover:text-purple-600 transition-colors">Section 10 Creative Challenge</button></li>
              </ul>
            </div>

            {/* Col 3: Contact & HQ (4 cols) */}
            <div className="md:col-span-4 space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block font-['Outfit']">
                Agency Headquarters
              </span>
              <div className="space-y-2.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>RK World Tower, Rajkot, Gujarat, India</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600 shrink-0" />
                  <a href="mailto:connect@digi-trend.com" className="hover:text-purple-600 transition-colors">connect@digi-trend.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-purple-600 shrink-0" />
                  <a href="tel:9428163116" className="hover:text-purple-600 transition-colors">+91 94281 63116</a>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3 text-slate-400">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-purple-100 hover:text-purple-600 flex items-center justify-center transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-purple-100 hover:text-purple-600 flex items-center justify-center transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-purple-100 hover:text-purple-600 flex items-center justify-center transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-purple-100 hover:text-purple-600 flex items-center justify-center transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* Copyright bar */}
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} DiGi Trend Branding Solutions. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-600 cursor-pointer">Security Overview</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Demo Modal */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

    </div>
  );
}
