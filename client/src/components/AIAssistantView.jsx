import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  MessageSquare, 
  FileText, 
  Hash, 
  Image, 
  Lightbulb, 
  Zap, 
  Loader2, 
  ArrowRight, 
  History, 
  Clock, 
  Search, 
  Eye, 
  X, 
  Filter, 
  User, 
  Building2, 
  Calendar,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import api from '../services/api';

export default function AIAssistantView({ currentUser }) {
  const [activeTab, setActiveTab] = useState('studio'); // 'studio' | 'history'
  const [promptInput, setPromptInput] = useState('');
  const [selectedClient, setSelectedClient] = useState('Jagdamba Agro Polymers');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  // History State
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [historyClientFilter, setHistoryClientFilter] = useState('ALL');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  // Initial chat conversation showcasing the exact Section 6 example
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user',
      text: 'Create an Instagram post idea for a plastic manufacturing company for Diwali.'
    },
    {
      id: 2,
      sender: 'ai',
      headline: 'Shaping Sustainable Brilliance: Where Precision Engineering Meets Festive Light. ✨🪔',
      visualConcept: 'A high-contrast cinematic visual: Minimalist golden diyas arranged around precision-engineered translucent polymer components. Soft volumetric lighting highlights the sleek edges, with golden bokeh in the deep slate-blue background. DiGi Trend client branding in the top-right corner.',
      caption: 'This Diwali, we celebrate the power of innovation that molds the future. At Jagdamba Agro Polymers, every component is crafted with relentless quality, sustainability, and purpose.\n\nMay the festival of lights illuminate fresh milestones of growth, strong partnerships, and engineering excellence.\n\n✨ Wishing all our esteemed industry partners, vendors, and clients a prosperous Diwali!',
      hashtags: '#Diwali2026 #ManufacturingExcellence #PlasticEngineering #SustainableIndustry #MakeInIndia #DiGiTrendCreative',
      cta: 'Explore our certified industrial polymers catalog - Link in bio.',
      alternateIdea: 'Behind-the-scenes 15s Reel: Transition from factory molten molding line spark to a glowing golden Diwali diya flame, symbolizing transformation.'
    }
  ]);

  const clientsList = [
    'Jagdamba Agro Polymers',
    'RK World Tower Developers',
    'Aura Luxury Ayurvedic Spa',
    'Vortex Global ERP Systems',
    'Kavya Organic Superfoods'
  ];

  const quickPrompts = [
    { 
      label: 'Diwali Plastic Manufacturer (Example)', 
      prompt: 'Create an Instagram post idea for a plastic manufacturing company for Diwali.' 
    },
    { 
      label: 'Commercial Real Estate Campaign', 
      prompt: 'Brainstorm a 5-day social media campaign idea for commercial real estate leasing in Rajkot.' 
    },
    { 
      label: 'Industrial Polymer Hashtags', 
      prompt: 'Suggest 15 trending high-intent hashtags for Gujarat plastic and polymer engineering businesses.' 
    },
    { 
      label: 'SaaS Software Launch Brief', 
      prompt: 'Generate a creative content brief for a B2B ERP enterprise software company launch.' 
    },
    { 
      label: 'Ayurvedic Skincare Reel Hook', 
      prompt: 'Write an engaging Instagram reel hook and visual concept for luxury Ayurvedic skincare rituals.' 
    },
    { 
      label: 'Brand Differentiation Angle', 
      prompt: 'Explain why generic Canva templates hurt B2B brand authority in 2026.' 
    }
  ];

  // Fetch AI Generation History
  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await api.getAIHistory();
      if (res?.data && Array.isArray(res.data)) {
        setHistory(res.data);
      }
    } catch (err) {
      console.warn('Notice loading AI history:', err.message);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSendPrompt = async (textToSend) => {
    const text = textToSend || promptInput;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text
    };

    setMessages(prev => [...prev, userMsg]);
    setPromptInput('');
    setIsGenerating(true);

    try {
      const res = await api.generateAIContent({
        prompt: text,
        client: selectedClient,
        createdBy: currentUser?.name || 'Mahek Kureshi',
        clientContext: {
          clientName: selectedClient,
          industry: 'Manufacturing & Commercial Operations',
          tone: 'Engaging, Authoritative & Brand-Aligned'
        }
      });

      // Extract structured payload correctly from backend response
      const structured = res?.structuredOutput || res?.data?.generatedResult || res?.data?.structuredOutput || res?.data || {};

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        headline: structured.headline || `Strategic Creative Angle: ${text.slice(0, 45)}`,
        visualConcept: structured.visualConcept || structured.visual || structured.theme || 'High-impact contemporary visual layout with bold typography, dynamic lighting, and brand color palette.',
        caption: structured.caption || 'Empowering brand resonance through calculated design, strategic hooks, and compelling storytelling.',
        hashtags: Array.isArray(structured.hashtags) 
          ? structured.hashtags.join(' ') 
          : (structured.hashtags || '#DiGiTrend #CreativeOps #Marketing2026'),
        cta: structured.cta || 'Explore our full campaign catalog - Link in bio.',
        alternateIdea: structured.alternateIdea || 'A 15-second animated Reel or Carousel breakdown exploring this concept in detail.'
      };

      setMessages(prev => [...prev, aiMsg]);

      // Automatically refresh stored history
      fetchHistory();
    } catch (err) {
      console.warn('API error, using contextual engine:', err.message);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          headline: `Creative Strategy for: "${text.slice(0, 45)}"`,
          visualConcept: 'Sleek, minimalist aesthetic with glassmorphic depth, contrasting brand typography, and dynamic accent gradients.',
          caption: `Transforming great ideas into unforgettable market presence. Built with precision and creative excellence for modern enterprises.`,
          hashtags: '#CreativeOps #ModernBranding #DiGiTrendSolutions #DigitalGrowth',
          cta: 'DM us to learn more or collaborate on your next campaign.',
          alternateIdea: 'Short interactive carousel highlighting key value propositions.'
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (content, key) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Just now';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtered history list
  const filteredHistory = history.filter(item => {
    const matchesClient = historyClientFilter === 'ALL' || item.client === historyClientFilter;
    const query = historySearch.toLowerCase();
    const promptMatch = item.prompt && item.prompt.toLowerCase().includes(query);
    const clientMatch = item.client && item.client.toLowerCase().includes(query);
    const headlineMatch = item.generatedResult?.headline && item.generatedResult.headline.toLowerCase().includes(query);
    const captionMatch = item.generatedResult?.caption && item.generatedResult.caption.toLowerCase().includes(query);
    return matchesClient && (!query || promptMatch || clientMatch || headlineMatch || captionMatch);
  });

  return (
    <div className="flex-1 bg-[#f8fafc] text-slate-800 min-h-screen p-6 lg:p-8 space-y-6">
      
      {/* Top Header Bar with Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 font-['Outfit'] tracking-tight">
            AI Creative Assistant
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate and store structured creative briefs with Google Gemini AI.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Active Role Creator Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs shadow-xs">
            <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${currentUser?.color || 'from-purple-500 to-indigo-500'} flex items-center justify-center font-bold text-[10px] text-white`}>
              {currentUser?.initials || 'MK'}
            </div>
            <div className="text-left">
              <span className="font-bold text-slate-800 block text-[11px] leading-tight">
                {currentUser?.name || 'Mahek Kureshi'}
              </span>
              <span className="text-[9px] text-purple-600 font-semibold block leading-tight">
                {currentUser?.role || 'Agency Owner'}
              </span>
            </div>
          </div>

          {/* Tab Switcher: Studio vs Generation History */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'studio'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Creative Studio</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('history');
                fetchHistory();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Generation History</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'history' ? 'bg-purple-800 text-purple-200' : 'bg-slate-100 text-slate-600'
              }`}>
                {history.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: CREATIVE STUDIO (Interactive Brief Generator)
         ========================================================================= */}
      {activeTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left / Center Chat Column (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between min-h-[620px]">
            
            {/* Messages Flow */}
            <div className="space-y-6 flex-1 overflow-y-auto pr-1 pb-4 max-h-[640px]">
              {messages.map((m) => {
                if (m.sender === 'user') {
                  return (
                    <div key={m.id} className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="max-w-md bg-purple-600 text-white rounded-2xl rounded-tr-none px-4 py-3 text-xs leading-relaxed shadow-sm font-medium">
                        {m.text}
                      </div>
                    </div>
                  );
                }

                const fullBriefText = `Headline / Hook:\n${m.headline}\n\nVisual Concept:\n${m.visualConcept}\n\nCaption:\n${m.caption}\n\nHashtags:\n${m.hashtags}\n\nCTA:\n${m.cta || 'N/A'}\n\nAlternate Idea:\n${m.alternateIdea || 'N/A'}`;

                return (
                  <div key={m.id} className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="max-w-2xl w-full bg-slate-50/80 rounded-2xl rounded-tl-none border border-slate-200/90 p-5 text-xs text-slate-700 space-y-4 shadow-xs">
                      
                      {/* Header with Title and Copy Full Button */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-slate-900 text-xs tracking-tight">
                            Structured Creative Brief
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleCopy(fullBriefText, 'full_' + m.id)}
                          className="text-[11px] font-semibold text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Copy entire structured brief"
                        >
                          {copiedKey === 'full_' + m.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copied Brief</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Full Brief</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* 1. Headline / Hook */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-700">
                          <Zap className="w-3.5 h-3.5 text-purple-600" />
                          <span>Headline / Hook</span>
                        </div>
                        <p className="font-bold text-slate-900 text-sm leading-snug">
                          {m.headline}
                        </p>
                      </div>

                      {/* 2. Visual Concept */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                          <Image className="w-3.5 h-3.5 text-amber-600" />
                          <span>Visual Concept</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed text-xs">
                          {m.visualConcept}
                        </p>
                      </div>

                      {/* 3. Caption */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span>Caption</span>
                          </div>
                          <button
                            onClick={() => handleCopy(m.caption, 'cap_' + m.id)}
                            className="text-[10px] text-slate-500 hover:text-purple-600 flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === 'cap_' + m.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedKey === 'cap_' + m.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-3 rounded-lg border border-slate-100 italic">
                          "{m.caption}"
                        </p>
                      </div>

                      {/* 4. Hashtags */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-pink-700">
                            <Hash className="w-3.5 h-3.5 text-pink-600" />
                            <span>Hashtags</span>
                          </div>
                          <button
                            onClick={() => handleCopy(m.hashtags, 'hash_' + m.id)}
                            className="text-[10px] text-slate-500 hover:text-purple-600 flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === 'hash_' + m.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedKey === 'hash_' + m.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-purple-700 font-mono text-[11px] leading-relaxed break-words font-medium">
                          {m.hashtags}
                        </p>
                      </div>

                      {/* 5. Optional CTA & Alternate Idea */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {m.cta && (
                          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/70 space-y-1">
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                              <ArrowRight className="w-3 h-3 text-emerald-600" />
                              <span>Call to Action (CTA)</span>
                            </div>
                            <p className="text-emerald-900 font-medium text-[11px]">
                              {m.cta}
                            </p>
                          </div>
                        )}

                        {m.alternateIdea && (
                          <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-200/70 space-y-1">
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-800">
                              <Lightbulb className="w-3 h-3 text-purple-600" />
                              <span>Alternate Creative Idea</span>
                            </div>
                            <p className="text-purple-900 text-[11px] leading-relaxed">
                              {m.alternateIdea}
                            </p>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}

              {isGenerating && (
                <div className="flex justify-start animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center gap-2.5 text-xs text-purple-700 font-medium shadow-xs">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                    <span>Google Gemini AI is analyzing your brief and engineering structured creative outputs...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Prompt Input Bar with Client Selector */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Target Client:
                </span>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  {clientsList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendPrompt(); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Enter creative brief... (e.g. Create an Instagram post idea for a plastic manufacturing company for Diwali.)"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white transition-all placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={isGenerating || !promptInput.trim()}
                  className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase shadow-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Generate</span>
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: "Quick Prompts" (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                Quick Prompts
              </h3>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                1-Click Briefs
              </span>
            </div>

            <div className="space-y-2.5">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(item.prompt)}
                  disabled={isGenerating}
                  className="w-full text-left p-3.5 rounded-xl bg-slate-50 hover:bg-purple-50/80 border border-slate-200/80 hover:border-purple-300 text-xs transition-all flex flex-col gap-1 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 group-hover:text-purple-700">
                      {item.label}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    "{item.prompt}"
                  </p>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          VIEW 2: AI GENERATION HISTORY (Prompt, Client, Generated Result, Created By, Generated At)
         ========================================================================= */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          
          {/* Filter and Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-xs">
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Client Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-500">Filter Client:</span>
                <select
                  value={historyClientFilter}
                  onChange={(e) => setHistoryClientFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="ALL">All Clients ({history.length})</option>
                  {clientsList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="DiGi Trend Client">DiGi Trend Client</option>
                  <option value="General Brand">General Brand</option>
                </select>
              </div>

              {historyClientFilter !== 'ALL' && (
                <button
                  onClick={() => setHistoryClientFilter('ALL')}
                  className="text-purple-600 font-bold text-[11px] hover:underline"
                >
                  Reset Filter
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search prompt, client, headline..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Structured History Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-100 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Prompt</th>
                    <th className="py-3.5 px-4">Client</th>
                    <th className="py-3.5 px-4">Generated Result</th>
                    <th className="py-3.5 px-4">Created By</th>
                    <th className="py-3.5 px-4">Generated At</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoadingHistory ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-400">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                          <span>Loading AI generation history...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-400 space-y-2">
                        <History className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="font-semibold text-slate-600">No generation history found</p>
                        <p className="text-xs text-slate-400">Generations created in the Creative Studio will be stored here automatically.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((item) => {
                      const result = item.generatedResult || {};
                      const itemId = item._id || item.id;

                      return (
                        <tr 
                          key={itemId}
                          onClick={() => setSelectedHistoryItem(item)}
                          className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                        >
                          {/* 1. Prompt */}
                          <td className="py-3.5 px-4 max-w-[240px]">
                            <div className="flex items-start gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                              <span className="font-semibold text-slate-900 line-clamp-2" title={item.prompt}>
                                {item.prompt}
                              </span>
                            </div>
                          </td>

                          {/* 2. Client */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                              <Building2 className="w-3 h-3 text-slate-500" />
                              {item.client || 'DiGi Trend Client'}
                            </span>
                          </td>

                          {/* 3. Generated Result */}
                          <td className="py-3.5 px-4 max-w-[320px]">
                            <div className="space-y-0.5">
                              <span className="font-bold text-purple-700 block truncate" title={result.headline}>
                                {result.headline || 'Creative Strategy'}
                              </span>
                              <span className="text-[11px] text-slate-500 line-clamp-1 truncate" title={result.visualConcept || result.caption}>
                                {result.visualConcept || result.caption || 'Structured creative concept'}
                              </span>
                            </div>
                          </td>

                          {/* 4. Created By */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
                              <User className="w-3 h-3 text-slate-400" />
                              {item.createdBy || 'Creative Team'}
                            </span>
                          </td>

                          {/* 5. Generated At */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {formatDate(item.generatedAt || item.createdAt)}
                            </span>
                          </td>

                          {/* 6. Actions */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setSelectedHistoryItem(item)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                                title="View full brief"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  const text = `Headline / Hook:\n${result.headline}\n\nVisual Concept:\n${result.visualConcept}\n\nCaption:\n${result.caption}\n\nHashtags:\n${Array.isArray(result.hashtags) ? result.hashtags.join(' ') : result.hashtags}\n\nCTA:\n${result.cta || ''}\n\nAlternate Idea:\n${result.alternateIdea || ''}`;
                                  handleCopy(text, 'hist_' + itemId);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                                title="Copy brief"
                              >
                                {copiedKey === 'hist_' + itemId ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          DETAIL MODAL: VIEW SAVED AI GENERATION
         ========================================================================= */}
      {selectedHistoryItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl border border-slate-200/90 my-8 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  Archived AI Generation
                </span>
                <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
                  Creative Brief Review
                </h3>
                <p className="text-xs text-slate-500">
                  Generated on {formatDate(selectedHistoryItem.generatedAt || selectedHistoryItem.createdAt)} for <strong className="text-slate-700">{selectedHistoryItem.client || 'DiGi Trend Client'}</strong>
                </p>
              </div>

              <button
                onClick={() => setSelectedHistoryItem(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prompt Box */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">User Prompt:</span>
              <p className="text-xs font-semibold text-slate-900">
                "{selectedHistoryItem.prompt}"
              </p>
            </div>

            {/* Full Structured Output */}
            {selectedHistoryItem.generatedResult && (
              <div className="space-y-3.5 text-xs">
                
                {/* Headline / Hook */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-700">
                    <Zap className="w-3.5 h-3.5 text-purple-600" />
                    <span>Headline / Hook</span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm">
                    {selectedHistoryItem.generatedResult.headline}
                  </p>
                </div>

                {/* Visual Concept */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    <Image className="w-3.5 h-3.5 text-amber-600" />
                    <span>Visual Concept</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-xs">
                    {selectedHistoryItem.generatedResult.visualConcept}
                  </p>
                </div>

                {/* Caption */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>Caption</span>
                    </div>
                    <button
                      onClick={() => handleCopy(selectedHistoryItem.generatedResult.caption, 'modal_cap')}
                      className="text-[10px] text-slate-500 hover:text-purple-600 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'modal_cap' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'modal_cap' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-3 rounded-lg border border-slate-100 italic">
                    "{selectedHistoryItem.generatedResult.caption}"
                  </p>
                </div>

                {/* Hashtags */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-pink-700">
                      <Hash className="w-3.5 h-3.5 text-pink-600" />
                      <span>Hashtags</span>
                    </div>
                    <button
                      onClick={() => {
                        const tags = Array.isArray(selectedHistoryItem.generatedResult.hashtags) 
                          ? selectedHistoryItem.generatedResult.hashtags.join(' ') 
                          : selectedHistoryItem.generatedResult.hashtags;
                        handleCopy(tags, 'modal_hash');
                      }}
                      className="text-[10px] text-slate-500 hover:text-purple-600 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'modal_hash' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'modal_hash' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-purple-700 font-mono text-[11px] leading-relaxed break-words font-medium">
                    {Array.isArray(selectedHistoryItem.generatedResult.hashtags) 
                      ? selectedHistoryItem.generatedResult.hashtags.join(' ') 
                      : selectedHistoryItem.generatedResult.hashtags}
                  </p>
                </div>

                {/* CTA and Alternate Idea */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {selectedHistoryItem.generatedResult.cta && (
                    <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/70 space-y-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        <ArrowRight className="w-3 h-3 text-emerald-600" />
                        <span>Call to Action (CTA)</span>
                      </div>
                      <p className="text-emerald-900 font-medium text-[11px]">
                        {selectedHistoryItem.generatedResult.cta}
                      </p>
                    </div>
                  )}

                  {selectedHistoryItem.generatedResult.alternateIdea && (
                    <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-200/70 space-y-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-800">
                        <Lightbulb className="w-3 h-3 text-purple-600" />
                        <span>Alternate Creative Idea</span>
                      </div>
                      <p className="text-purple-900 text-[11px] leading-relaxed">
                        {selectedHistoryItem.generatedResult.alternateIdea}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">
                Created By: <strong className="text-slate-700">{selectedHistoryItem.createdBy || 'Creative Team'}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const result = selectedHistoryItem.generatedResult || {};
                    const text = `Headline / Hook:\n${result.headline}\n\nVisual Concept:\n${result.visualConcept}\n\nCaption:\n${result.caption}\n\nHashtags:\n${Array.isArray(result.hashtags) ? result.hashtags.join(' ') : result.hashtags}\n\nCTA:\n${result.cta || ''}\n\nAlternate Idea:\n${result.alternateIdea || ''}`;
                    handleCopy(text, 'modal_full');
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'modal_full' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'modal_full' ? 'Copied' : 'Copy All'}</span>
                </button>

                <button
                  onClick={() => {
                    // Load this prompt and response directly into Studio
                    const result = selectedHistoryItem.generatedResult || {};
                    setMessages(prev => [
                      ...prev,
                      { id: Date.now(), sender: 'user', text: selectedHistoryItem.prompt },
                      {
                        id: Date.now() + 1,
                        sender: 'ai',
                        headline: result.headline || 'Creative Strategy',
                        visualConcept: result.visualConcept || '',
                        caption: result.caption || '',
                        hashtags: Array.isArray(result.hashtags) ? result.hashtags.join(' ') : result.hashtags,
                        cta: result.cta || '',
                        alternateIdea: result.alternateIdea || ''
                      }
                    ]);
                    setSelectedHistoryItem(null);
                    setActiveTab('studio');
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Open in Studio</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
