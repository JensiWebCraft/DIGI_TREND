import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Edit3, 
  Trash2,
  Search,
  ExternalLink,
  Sparkles, 
  Share2, 
  Clock, 
  Instagram, 
  Facebook, 
  Linkedin,
  Youtube,
  LayoutGrid,
  List,
  CheckCircle2,
  AlertTriangle,
  X,
  FileText
} from 'lucide-react';
import api from '../services/api';

export default function ContentPlannerView() {
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'table' | 'cards'
  const [clientFilter, setClientFilter] = useState('ALL');
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [clients, setClients] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // Form State for New Post
  const [formData, setFormData] = useState({
    client: 'Jagdamba Agro Polymers',
    platform: 'Instagram',
    postType: 'Festival Creative',
    campaign: 'Navratri 2026',
    publishDate: new Date().toISOString().split('T')[0],
    status: 'Design Pending',
    caption: '',
    hashtags: ''
  });

  // Form State for Editing Post
  const [editFormData, setEditFormData] = useState({
    client: 'Jagdamba Agro Polymers',
    platform: 'Instagram',
    postType: 'Festival Creative',
    campaign: 'Navratri 2026',
    publishDate: '',
    status: 'Design Pending',
    caption: '',
    hashtags: ''
  });

  // Load live posts and clients from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const [postsRes, clientsRes] = await Promise.allSettled([
          api.getContentPosts(),
          api.getClients()
        ]);
        if (postsRes.status === 'fulfilled' && postsRes.value?.data) {
          const raw = Array.isArray(postsRes.value.data) ? postsRes.value.data : [];
          const formatted = raw.map(p => ({
            ...p,
            id: p._id || p.id,
            client: p.clientName || p.client,
            publishDate: p.publishDate ? (String(p.publishDate).includes('T') ? String(p.publishDate).split('T')[0] : p.publishDate) : ''
          }));
          setPosts(formatted);
          if (formatted.length > 0) {
            setSelectedPost(formatted[0]);
          } else {
            setSelectedPost(null);
          }
        }
        if (clientsRes.status === 'fulfilled' && clientsRes.value?.data) {
          const rawClients = Array.isArray(clientsRes.value.data) ? clientsRes.value.data : [];
          setClients(rawClients);
        }
      } catch (err) {
        console.warn('Notice loading content planner state:', err.message);
      }
    };
    loadData();
  }, []);

  // Filter posts
  const filteredPosts = posts.filter(p => {
    const pClient = p.client || p.clientName;
    const matchesClient = clientFilter === 'ALL' || pClient === clientFilter;
    const matchesPlatform = platformFilter === 'ALL' || p.platform === platformFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesDate = !dateFilter || p.publishDate === dateFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || 
      (p.campaign && p.campaign.toLowerCase().includes(query)) ||
      (pClient && pClient.toLowerCase().includes(query)) ||
      (p.caption && p.caption.toLowerCase().includes(query));
    return matchesClient && matchesPlatform && matchesStatus && matchesDate && matchesSearch;
  });

  // Helper for platform icon and badge
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'Instagram':
        return <Instagram className="w-3.5 h-3.5 text-pink-600" />;
      case 'Facebook':
        return <Facebook className="w-3.5 h-3.5 text-blue-600" />;
      case 'LinkedIn':
        return <Linkedin className="w-3.5 h-3.5 text-sky-700" />;
      case 'YouTube':
        return <Youtube className="w-3.5 h-3.5 text-red-600" />;
      default:
        return <Share2 className="w-3.5 h-3.5 text-purple-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Design Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Review Required':
      case 'Review':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Published':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Create new content post
  const handleCreateContent = async (e) => {
    e.preventDefault();
    if (!formData.campaign.trim()) return alert('Campaign name is required');

    const newPost = {
      ...formData,
      id: 'p_' + Date.now(),
      _id: 'p_' + Date.now(),
      createdAt: new Date().toISOString()
    };

    try {
      await api.createContentPost(newPost);
    } catch (err) {
      console.warn('Axios notice:', err.message);
    }

    setPosts(prev => [newPost, ...prev]);
    setSelectedPost(newPost);
    setIsNewModalOpen(false);
    setFormData({
      client: clients[0]?.name || 'Jagdamba Agro Polymers',
      platform: 'Instagram',
      postType: 'Festival Creative',
      campaign: '',
      publishDate: new Date().toISOString().split('T')[0],
      status: 'Design Pending',
      caption: '',
      hashtags: ''
    });
  };

  // Start edit
  const handleStartEdit = (post) => {
    setSelectedPost(post);
    setEditFormData({
      client: post.client || post.clientName || 'Jagdamba Agro Polymers',
      platform: post.platform || 'Instagram',
      postType: post.postType || 'Festival Creative',
      campaign: post.campaign || '',
      publishDate: post.publishDate ? (String(post.publishDate).includes('T') ? String(post.publishDate).split('T')[0] : post.publishDate) : '',
      status: post.status || 'Design Pending',
      caption: post.caption || '',
      hashtags: Array.isArray(post.hashtags) ? post.hashtags.join(' ') : (post.hashtags || '')
    });
    setIsEditModalOpen(true);
  };

  // Save edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editFormData.campaign.trim()) return alert('Campaign name is required');

    const postId = selectedPost.id || selectedPost._id;
    const updated = {
      ...selectedPost,
      ...editFormData
    };

    setPosts(prev => prev.map(p => (p.id === postId || p._id === postId ? updated : p)));
    setSelectedPost(updated);

    try {
      await api.updateContentPost(postId, editFormData);
    } catch (err) {
      console.warn('Axios notice:', err.message);
    }

    setIsEditModalOpen(false);
  };

  // Quick 1-click status change
  const handleStatusChange = async (postId, newStatus) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId || p._id === postId) {
        return { ...p, status: newStatus };
      }
      return p;
    }));

    if (selectedPost && (selectedPost.id === postId || selectedPost._id === postId)) {
      setSelectedPost(prev => ({ ...prev, status: newStatus }));
    }

    try {
      await api.updateContentPost(postId, { status: newStatus });
    } catch (err) {
      console.warn('Axios status update fallback:', err.message);
    }
  };

  // Confirm delete
  const handleStartDelete = (post) => {
    setPostToDelete(post);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    const postId = postToDelete.id || postToDelete._id;

    const remaining = posts.filter(p => p.id !== postId && p._id !== postId);
    setPosts(remaining);
    if (selectedPost && (selectedPost.id === postId || selectedPost._id === postId)) {
      setSelectedPost(remaining[0] || null);
    }

    try {
      await api.deleteContentPost(postId);
    } catch (err) {
      console.warn('Axios delete fallback:', err.message);
    }

    setIsDeleteModalOpen(false);
    setPostToDelete(null);
  };

  // Calendar days generation for October 2026
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="flex-1 bg-[#f8fafc] text-slate-800 min-h-screen p-6 lg:p-8 space-y-6">
      
      {/* Top Header Bar matching Section 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold uppercase tracking-wider mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
            Section 5 · Content Operations
          </span>
          <h2 className="text-2xl font-black text-slate-900 font-['Outfit'] tracking-tight">
            Social Media Content Planner
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Schedule client publishing pipelines across Instagram, Facebook, LinkedIn, and YouTube.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle: Calendar / Table / Cards */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'cards'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
          </div>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar: Client, Platform, Status, Date */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Client Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Client:</span>
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="ALL">All Clients ({clients.length > 0 ? clients.length : (new Set(posts.map(p => p.client || p.clientName)).size)})</option>
              {clients.map(c => (
                <option key={c._id || c.name} value={c.name}>{c.name}</option>
              ))}
              {clients.length === 0 && (
                <>
                  <option value="Jagdamba Agro Polymers">Jagdamba Agro Polymers</option>
                  <option value="RK World Tower Developers">RK World Tower Developers</option>
                  <option value="Aura Luxury Ayurvedic Spa">Aura Luxury Ayurvedic Spa</option>
                  <option value="Vortex Global ERP Systems">Vortex Global ERP Systems</option>
                  <option value="Kavya Organic Superfoods">Kavya Organic Superfoods</option>
                </>
              )}
            </select>
          </div>

          {/* Platform Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Platform:</span>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="ALL">All Platforms</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="YouTube">YouTube</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Design Pending">Design Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Review Required">Review Required</option>
              <option value="Approved">Approved</option>
              <option value="Published">Published</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Date:</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-medium text-slate-800 focus:outline-none focus:border-purple-500 text-xs cursor-pointer"
            />
            {dateFilter && (
              <button 
                onClick={() => setDateFilter('')}
                className="text-[10px] text-purple-600 font-bold hover:underline"
              >
                Clear
              </button>
            )}
          </div>

        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campaign, client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: CALENDAR VIEW
         ========================================================================= */}
      {viewMode === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Monthly Calendar (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-slate-900 text-sm">October 2026 Editorial Grid</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                <span>Active Scheduling Month</span>
              </div>
            </div>

            {/* Weekdays Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* 31 Calendar Grid Cells */}
            <div className="grid grid-cols-7 gap-2 text-xs">
              {/* Offset days from previous month */}
              {[27, 28, 29, 30].map(d => (
                <div key={'prev_' + d} className="h-24 bg-slate-50/40 rounded-xl p-1.5 border border-slate-100/50 opacity-40">
                  <span className="text-[10px] text-slate-400 font-bold">{d}</span>
                </div>
              ))}

              {daysInMonth.map((day) => {
                const dayStr = `2026-10-${day < 10 ? '0' + day : day}`;
                const postsOnDay = filteredPosts.filter(p => {
                  const pDate = p.publishDate ? (String(p.publishDate).includes('T') ? String(p.publishDate).split('T')[0] : p.publishDate) : '';
                  return pDate === dayStr;
                });
                const todayDayNumber = new Date().getDate();
                const isToday = day === todayDayNumber;

                return (
                  <div
                    key={day}
                    onClick={() => {
                      if (postsOnDay.length > 0) {
                        setSelectedPost(postsOnDay[0]);
                      }
                    }}
                    className={`h-24 rounded-xl p-1.5 border transition-all flex flex-col justify-between cursor-pointer ${
                      isToday
                        ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-100'
                        : postsOnDay.length > 0
                        ? 'bg-white hover:bg-slate-50 border-purple-200/70 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold ${isToday ? 'text-purple-700 font-extrabold' : 'text-slate-700'}`}>
                        {day}
                      </span>
                      {isToday && (
                        <span className="px-1 py-0.2 rounded bg-purple-600 text-white text-[8px] font-bold uppercase">
                          Today
                        </span>
                      )}
                    </div>

                    {/* Posts chips on day */}
                    <div className="space-y-1 overflow-y-auto max-h-16 pr-0.5">
                      {postsOnDay.map((p, idx) => (
                        <div
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPost(p);
                          }}
                          className={`px-1.5 py-0.5 rounded-lg text-[9px] font-bold border truncate flex items-center gap-1 shadow-xs transition-transform hover:scale-102 ${getStatusBadge(p.status)}`}
                          title={`${p.client}: ${p.campaign}`}
                        >
                          {getPlatformIcon(p.platform)}
                          <span className="truncate">{p.campaign}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right: Selected Post Details Panel (4 Cols) */}
          {selectedPost ? (
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  {getPlatformIcon(selectedPost.platform)}
                  <h3 className="font-bold text-sm text-slate-900">Post Blueprint</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStartEdit(selectedPost)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                    title="Edit content post"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleStartDelete(selectedPost)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Visual Concept Banner */}
              <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-[#800020] via-[#5c0017] to-[#2b000b] p-3.5 text-amber-100 flex flex-col justify-between shadow-md">
                <div className="flex justify-between items-center text-[9px] uppercase tracking-wider font-bold">
                  <span className="text-amber-300">{selectedPost.client || selectedPost.clientName}</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono">
                    {selectedPost.postType}
                  </span>
                </div>
                <div className="text-center my-auto space-y-0.5">
                  <span className="text-base font-black font-['Outfit'] text-amber-200 block truncate">
                    {selectedPost.campaign}
                  </span>
                  <span className="text-[10px] text-amber-100/80 line-clamp-1">
                    {selectedPost.caption || 'Festive Creative Campaign 2026'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[8px] text-amber-300/80 pt-1 border-t border-amber-400/20">
                  <span>{selectedPost.platform}</span>
                  <span className="font-mono">{selectedPost.publishDate}</span>
                </div>
              </div>

              {/* Specifications Table */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Client</span>
                  <span className="font-bold text-slate-800">{selectedPost.client || selectedPost.clientName}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Platform</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      {getPlatformIcon(selectedPost.platform)}
                      <span>{selectedPost.platform}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Post Type</span>
                    <span className="font-bold text-slate-800 block mt-0.5">{selectedPost.postType}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Campaign</span>
                  <span className="font-bold text-purple-700">{selectedPost.campaign}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Publish Date</span>
                  <span className="font-bold text-slate-800">{selectedPost.publishDate}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Workflow Status</span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(selectedPost.status)}`}>
                      {selectedPost.status}
                    </span>
                    <select
                      value={selectedPost.status}
                      onChange={(e) => handleStatusChange(selectedPost.id || selectedPost._id, e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-lg px-2 py-0.5 focus:outline-none cursor-pointer"
                    >
                      <option value="Design Pending">Design Pending</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Review Required">Review Required</option>
                      <option value="Approved">Approved</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                </div>

                {selectedPost.caption && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Caption Copy</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1">
                      "{selectedPost.caption}"
                    </p>
                  </div>
                )}

                {selectedPost.hashtags && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tags</span>
                    <p className="text-purple-600 font-mono text-[10px] mt-0.5">
                      {Array.isArray(selectedPost.hashtags) ? selectedPost.hashtags.join(' ') : selectedPost.hashtags}
                    </p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col items-center justify-center text-center min-h-[350px] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">No Post Selected</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
                  Click on any scheduled post or click below to schedule a new client post.
                </p>
              </div>
              <button
                onClick={() => setIsNewModalOpen(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule Post</span>
              </button>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          VIEW 2: POLISHED TABLE VIEW (Client, Platform, Post Type, Campaign, Publish Date, Status)
         ========================================================================= */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] text-slate-500 font-semibold">
                  <th className="py-3.5 px-4 font-bold">Campaign</th>
                  <th className="py-3.5 px-4 font-bold">Client</th>
                  <th className="py-3.5 px-4 font-bold">Platform</th>
                  <th className="py-3.5 px-4 font-bold">Post Type</th>
                  <th className="py-3.5 px-4 font-bold">Publish Date</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-400">
                      No matching social content posts found.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => {
                    const postId = post.id || post._id;
                    const isSelected = selectedPost && (selectedPost.id === postId || selectedPost._id === postId);

                    return (
                      <tr
                        key={postId}
                        onClick={() => setSelectedPost(post)}
                        className={`transition-colors cursor-pointer ${
                          isSelected ? 'bg-purple-50/60' : 'hover:bg-slate-50/70'
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">{post.campaign}</span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[200px] block">
                            {post.caption ? post.caption.slice(0, 45) + '...' : 'No caption'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          {post.client || post.clientName}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                            {getPlatformIcon(post.platform)}
                            <span>{post.platform}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                            {post.postType}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {post.publishDate}
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={post.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleStatusChange(postId, e.target.value)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer focus:outline-none ${getStatusBadge(post.status)}`}
                          >
                            <option value="Design Pending">Design Pending</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Review Required">Review Required</option>
                            <option value="Approved">Approved</option>
                            <option value="Published">Published</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleStartEdit(post)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                              title="Edit post"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleStartDelete(post)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete post"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
      )}

      {/* =========================================================================
          VIEW 3: VISUAL CARD VIEW
         ========================================================================= */}
      {viewMode === 'cards' && (
        filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400 space-y-3">
            <LayoutGrid className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-medium">No social content posts found.</p>
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              + Schedule Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => {
            const postId = post.id || post._id;
            return (
              <div
                key={postId}
                onClick={() => setSelectedPost(post)}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all space-y-3 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(post.status)}`}>
                      {post.status}
                    </span>
                    <div className="flex items-center gap-1 text-slate-700 text-xs font-bold">
                      {getPlatformIcon(post.platform)}
                      <span>{post.platform}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider block">
                      {post.client || post.clientName}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 font-['Outfit'] mt-0.5">
                      {post.campaign}
                    </h4>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                      {post.postType}
                    </span>
                  </div>

                  {post.caption && (
                    <p className="text-slate-600 text-[11px] line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      "{post.caption}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.publishDate}</span>
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleStartEdit(post)}
                      className="p-1 rounded text-slate-400 hover:text-purple-600"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleStartDelete(post)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )
      )}

      {/* =========================================================================
          NEW CONTENT POST MODAL (All Section 5 Required Fields)
         ========================================================================= */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl border border-slate-200/90 my-8 space-y-5 animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                  Section 5 · Content Planning
                </span>
                <h3 className="text-xl font-black text-slate-900 font-['Outfit']">
                  Schedule Client Social Post
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure client campaign, publishing date, post type, and platform channel.
                </p>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateContent} className="space-y-4 text-xs">
              
              {/* Field 1: Campaign */}
              <div>
                <label className="block text-slate-800 font-bold mb-1.5">
                  Campaign Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Navratri 2026 Festive Offer"
                  value={formData.campaign}
                  onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs"
                />
              </div>

              {/* Grid Row 1: Client & Platform */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Field 2: Client */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    Client <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs cursor-pointer"
                  >
                    {clients.map(c => (
                      <option key={c._id || c.name} value={c.name}>{c.name}</option>
                    ))}
                    {clients.length === 0 && (
                      <>
                        <option value="Jagdamba Agro Polymers">Jagdamba Agro Polymers</option>
                        <option value="RK World Tower Developers">RK World Tower Developers</option>
                        <option value="Aura Luxury Ayurvedic Spa">Aura Luxury Ayurvedic Spa</option>
                        <option value="Vortex Global ERP Systems">Vortex Global ERP Systems</option>
                        <option value="Kavya Organic Superfoods">Kavya Organic Superfoods</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Field 3: Platform */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    Platform <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs cursor-pointer"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>

              </div>

              {/* Grid Row 2: Post Type & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Field 4: Post Type */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    Post Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.postType}
                    onChange={(e) => setFormData({ ...formData, postType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs cursor-pointer"
                  >
                    <option value="Festival Creative">Festival Creative</option>
                    <option value="Carousel">Carousel (Multi-slide)</option>
                    <option value="Thought Leadership">Thought Leadership</option>
                    <option value="Reel / Short">Reel / YouTube Short</option>
                    <option value="Product Showcase">Product Showcase</option>
                    <option value="Static Graphic">Static Graphic</option>
                  </select>
                </div>

                {/* Field 5: Status */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    Workflow Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs cursor-pointer"
                  >
                    <option value="Design Pending">Design Pending</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Review Required">Review Required</option>
                    <option value="Approved">Approved</option>
                    <option value="Published">Published</option>
                  </select>
                </div>

              </div>

              {/* Field 6: Publish Date */}
              <div>
                <label className="block text-slate-800 font-bold mb-1.5">
                  Publish Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs cursor-pointer"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-slate-800 font-bold mb-1.5">
                  Post Caption & Copy
                </label>
                <textarea
                  rows="3"
                  placeholder="Enter copywriting or creative brief for the post..."
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs resize-none"
                />
              </div>

              {/* Footer */}
              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Schedule Post</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          EDIT CONTENT POST MODAL
         ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl border border-slate-200/90 my-8 space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                  Section 5 · Edit Social Content
                </span>
                <h3 className="text-xl font-black text-slate-900 font-['Outfit']">
                  Edit Scheduled Post
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-800 font-bold mb-1.5">
                  Campaign Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.campaign}
                  onChange={(e) => setEditFormData({ ...editFormData, campaign: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">Client</label>
                  <select
                    value={editFormData.client}
                    onChange={(e) => setEditFormData({ ...editFormData, client: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs cursor-pointer"
                  >
                    {clients.map(c => (
                      <option key={c._id || c.name} value={c.name}>{c.name}</option>
                    ))}
                    {clients.length === 0 && (
                      <>
                        <option value="Jagdamba Agro Polymers">Jagdamba Agro Polymers</option>
                        <option value="RK World Tower Developers">RK World Tower Developers</option>
                        <option value="Aura Luxury Ayurvedic Spa">Aura Luxury Ayurvedic Spa</option>
                        <option value="Vortex Global ERP Systems">Vortex Global ERP Systems</option>
                        <option value="Kavya Organic Superfoods">Kavya Organic Superfoods</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">Platform</label>
                  <select
                    value={editFormData.platform}
                    onChange={(e) => setEditFormData({ ...editFormData, platform: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs cursor-pointer"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">Post Type</label>
                  <select
                    value={editFormData.postType}
                    onChange={(e) => setEditFormData({ ...editFormData, postType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs cursor-pointer"
                  >
                    <option value="Festival Creative">Festival Creative</option>
                    <option value="Carousel">Carousel</option>
                    <option value="Thought Leadership">Thought Leadership</option>
                    <option value="Reel / Short">Reel / Short</option>
                    <option value="Product Showcase">Product Showcase</option>
                    <option value="Static Graphic">Static Graphic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs cursor-pointer"
                  >
                    <option value="Design Pending">Design Pending</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Review Required">Review Required</option>
                    <option value="Approved">Approved</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5">Publish Date</label>
                <input
                  type="date"
                  required
                  value={editFormData.publishDate}
                  onChange={(e) => setEditFormData({ ...editFormData, publishDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5">Post Caption</label>
                <textarea
                  rows="3"
                  value={editFormData.caption}
                  onChange={(e) => setEditFormData({ ...editFormData, caption: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          DELETE CONFIRMATION MODAL
         ========================================================================= */}
      {isDeleteModalOpen && postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200/90 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                  Delete Scheduled Post?
                </h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to remove this post from the editorial calendar?
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
              <span className="font-bold text-slate-900 block truncate">{postToDelete.campaign}</span>
              <span className="text-[11px] text-slate-500">
                {postToDelete.client || postToDelete.clientName} · {postToDelete.platform} · {postToDelete.publishDate}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
