import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FolderKanban, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  Search, 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  Sparkles,
  ChevronRight,
  Filter,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  Check,
  AlertCircle,
  MoreVertical,
  X,
  ExternalLink,
  Bot,
  RefreshCw,
  Loader2
} from 'lucide-react';
import api from '../services/api';

export default function DashboardView({ onNavigate, currentUser }) {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeProjects: 0,
    pendingCreatives: 0,
    completedTasks: 0,
    upcomingPosts: 0,
    monthlyRevenue: 0
  });

  // View Controls
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [activeTabStatus, setActiveTabStatus] = useState('ALL'); // 'ALL' | 'To Do' | 'In Progress' | 'Review' | 'Completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeViz, setActiveViz] = useState('status'); // 'status' | 'revenue' | 'progress'

  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Live API Connected', message: 'Dashboard synced with DiGi Trend backend database', time: 'Just now', unread: true },
    { id: 2, title: 'SLA Tracking', message: 'Tasks velocity monitored in real time', time: '5m ago', unread: false }
  ]);

  // Quick Task Modal
  const [isQuickTaskOpen, setIsQuickTaskOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    client: '',
    service: 'Social Media',
    platform: 'Instagram',
    assignedTo: 'Kavita Shah (Creative Lead)',
    priority: 'High',
    status: 'To Do',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    description: '',
    referenceLink: ''
  });

  // Fetch real data from backend API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats, tasks, and clients concurrently
      const [statsRes, tasksRes, clientsRes] = await Promise.allSettled([
        api.getDashboardStats(),
        api.getTasks(),
        api.getClients()
      ]);

      let loadedTasks = [];
      let loadedClients = [];

      if (tasksRes.status === 'fulfilled' && tasksRes.value?.data) {
        loadedTasks = Array.isArray(tasksRes.value.data) ? tasksRes.value.data : [];
        setTasks(loadedTasks);
      }

      if (clientsRes.status === 'fulfilled' && clientsRes.value?.data) {
        loadedClients = Array.isArray(clientsRes.value.data) ? clientsRes.value.data : [];
        setClients(loadedClients);
        if (loadedClients.length > 0 && !newTask.client) {
          setNewTask(prev => ({ ...prev, client: loadedClients[0].name }));
        }
      }

      // Calculate dynamic KPIs from the real data
      const calculatedRevenue = loadedClients.reduce((sum, c) => sum + (Number(c.monthlyRetainer || c.retainer) || 0), 0);
      const activeTasksCount = loadedTasks.filter(t => t.status === 'In Progress' || t.status === 'Review').length;
      const pendingCount = loadedTasks.filter(t => t.status === 'To Do' || t.status === 'In Progress').length;
      const completedCount = loadedTasks.filter(t => t.status === 'Completed').length;

      let upcomingPostsCount = 0;
      if (statsRes.status === 'fulfilled' && statsRes.value?.data?.kpis) {
        upcomingPostsCount = statsRes.value.data.kpis.upcomingPosts || 0;
      }

      setStats({
        totalClients: loadedClients.length || (statsRes.status === 'fulfilled' ? statsRes.value?.data?.kpis?.totalClients : 0) || 0,
        activeProjects: activeTasksCount,
        pendingCreatives: pendingCount,
        completedTasks: completedCount,
        upcomingPosts: upcomingPostsCount,
        monthlyRevenue: calculatedRevenue || (statsRes.status === 'fulfilled' ? statsRes.value?.data?.kpis?.monthlyRevenue : 0) || 0
      });

    } catch (err) {
      console.error('Error fetching real dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Real-time dynamic counts derived from the loaded tasks array
  const totalTasks = tasks.length;
  const toDoCount = tasks.filter(t => t.status === 'To Do').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const reviewCount = tasks.filter(t => t.status === 'Review').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;

  const toDoPct = totalTasks > 0 ? Math.round((toDoCount / totalTasks) * 100) : 0;
  const inProgressPct = totalTasks > 0 ? Math.round((inProgressCount / totalTasks) * 100) : 0;
  const reviewPct = totalTasks > 0 ? Math.round((reviewCount / totalTasks) * 100) : 0;
  const completedPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // SVG Radial Donut calculations (circumference = 2 * PI * 68 ≈ 427.26)
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const toDoDash = totalTasks > 0 ? (toDoCount / totalTasks) * circumference : 0;
  const inProgressDash = totalTasks > 0 ? (inProgressCount / totalTasks) * circumference : 0;
  const reviewDash = totalTasks > 0 ? (reviewCount / totalTasks) * circumference : 0;
  const completedDash = totalTasks > 0 ? (completedCount / totalTasks) * circumference : 0;

  // Filter tasks based on real-time search & status tab
  const filteredTasks = tasks.filter(task => {
    const taskTitle = (task.taskTitle || task.title || '').toLowerCase();
    const clientName = (task.clientName || task.client || '').toLowerCase();
    const serviceName = (task.service || task.category || '').toLowerCase();
    const assignedName = (task.assignedEmployeeName || task.assignedTo || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesStatus = activeTabStatus === 'ALL' || task.status === activeTabStatus;
    const matchesQuery = 
      taskTitle.includes(query) ||
      clientName.includes(query) ||
      serviceName.includes(query) ||
      assignedName.includes(query);

    return matchesStatus && matchesQuery;
  });

  // Status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'To Do':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Review':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-500';
      case 'To Do': return 'bg-amber-500';
      case 'Review': return 'bg-purple-500';
      case 'Completed': return 'bg-emerald-500';
      default: return 'bg-slate-400';
    }
  };

  // Format date helper
  const formatDate = (dateVal) => {
    if (!dateVal) return 'Ongoing';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return String(dateVal);
    }
  };

  // Real 1-Click Status Update directly to backend API
  const handleUpdateStatus = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => (t._id === taskId || t.id === taskId) ? { ...t, status: newStatus } : t));

    try {
      await api.updateTask(taskId, { status: newStatus });
      // Refresh KPIs dynamically
      setStats(prev => {
        const updated = tasks.map(t => (t._id === taskId || t.id === taskId) ? { ...t, status: newStatus } : t);
        return {
          ...prev,
          activeProjects: updated.filter(t => t.status === 'In Progress' || t.status === 'Review').length,
          pendingCreatives: updated.filter(t => t.status === 'To Do' || t.status === 'In Progress').length,
          completedTasks: updated.filter(t => t.status === 'Completed').length
        };
      });
    } catch (err) {
      console.error('Failed to update task status in API:', err);
    }
  };

  // Real Create Task directly to backend API
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      setIsSubmitting(true);
      const payload = {
        taskTitle: newTask.title,
        title: newTask.title,
        client: newTask.client || (clients[0]?.name || 'Jagdamba Agro Polymers'),
        clientName: newTask.client || (clients[0]?.name || 'Jagdamba Agro Polymers'),
        service: newTask.service,
        category: newTask.service,
        platform: newTask.platform || 'Instagram',
        assignedEmployeeName: newTask.assignedTo,
        assignedTo: newTask.assignedTo,
        priority: newTask.priority || 'High',
        status: newTask.status || 'To Do',
        startDate: newTask.startDate,
        dueDate: newTask.dueDate,
        deadline: newTask.dueDate,
        description: newTask.description || '',
        referenceLink: newTask.referenceLink || ''
      };

      const res = await api.createTask(payload);
      const created = res?.data || { ...payload, _id: 't_' + Date.now(), id: 't_' + Date.now() };

      setTasks(prev => [created, ...prev]);
      setIsQuickTaskOpen(false);
      setNewTask({
        title: '',
        client: clients[0]?.name || '',
        service: 'Social Media',
        platform: 'Instagram',
        assignedTo: 'Kavita Shah (Creative Lead)',
        priority: 'High',
        status: 'To Do',
        startDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        description: '',
        referenceLink: ''
      });

      // Recalculate stats dynamically
      setStats(prev => ({
        ...prev,
        activeProjects: prev.activeProjects + (created.status === 'In Progress' || created.status === 'Review' ? 1 : 0),
        pendingCreatives: prev.pendingCreatives + (created.status === 'To Do' || created.status === 'In Progress' ? 1 : 0),
        completedTasks: prev.completedTasks + (created.status === 'Completed' ? 1 : 0)
      }));

    } catch (err) {
      console.error('Failed to create task in API:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic project progress grouped by real clients
  const clientProgressData = clients.map(c => {
    const clientTasks = tasks.filter(t => (t.clientName || t.client) === c.name);
    const clientCompleted = clientTasks.filter(t => t.status === 'Completed').length;
    const progress = clientTasks.length > 0 ? Math.round((clientCompleted / clientTasks.length) * 100) : 0;
    return {
      clientName: c.name,
      industry: c.industry || 'Branding & Retainer',
      totalTasks: clientTasks.length,
      completed: clientCompleted,
      progress,
      retainer: Number(c.monthlyRetainer || c.retainer) || 0
    };
  });

  return (
    <div className="flex-1 bg-[#f8fafc] text-slate-800 min-h-screen p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* =========================================================================
          TOP DASHBOARD HEADER & QUICK CONTROLS
         ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
            Agency Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time business information, live deliverable pipeline, and retainer analytics for <span className="font-semibold text-slate-700">DiGi Trend Branding Solutions</span>.
          </p>
        </div>

        {/* Right Header Action Suite */}
        <div className="flex items-center gap-3 relative">
          
          {/* Refresh Data Button */}
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-purple-600 shadow-sm hover:bg-slate-50 transition-colors"
            title="Refresh Real-Time Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-600' : ''}`} />
          </button>

          {/* Quick Date Range Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 font-medium shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
            <span>October 2026</span>
          </div>

          {/* Add Task Button */}
          <button
            onClick={() => setIsQuickTaskOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/25 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>

          {/* User Profile & Active Role Indicator */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${currentUser?.color || 'from-purple-600 via-indigo-600 to-cyan-400'} p-[1.5px] shadow-sm shrink-0`}>
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-xs text-white">
                {currentUser?.initials || 'MK'}
              </div>
            </div>
            <div className="hidden lg:block text-left">
              <span className="text-xs font-bold text-slate-800 block leading-tight truncate max-w-[120px]">
                {currentUser?.name || 'Mahek Kureshi'}
              </span>
              <span className="text-[10px] text-purple-600 font-semibold block truncate max-w-[130px]">
                {currentUser?.role || 'Agency Owner'}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* =========================================================================
          THE 5 BUSINESS INFORMATION KPIS (100% Dynamic from Real Data)
         ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* KPI 1: Total Clients */}
        <div 
          onClick={() => onNavigate('clients')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-2 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Total Clients</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
            {stats.totalClients}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Active accounts in database</span>
          </div>
        </div>

        {/* KPI 2: Active Projects */}
        <div 
          onClick={() => onNavigate('tasks')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-2 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Active Projects</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderKanban className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
            {stats.activeProjects}
          </div>
          <div className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>In Progress + Review</span>
          </div>
        </div>

        {/* KPI 3: Pending Creatives */}
        <div 
          onClick={() => onNavigate('tasks')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-2 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Pending Creatives</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
            {stats.pendingCreatives}
          </div>
          <div className="text-[10px] text-rose-500 font-semibold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>To Do + In Progress</span>
          </div>
        </div>

        {/* KPI 4: Completed Tasks */}
        <div 
          onClick={() => onNavigate('tasks')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-2 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Completed Tasks</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
            {stats.completedTasks}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{totalTasks > 0 ? `${Math.round((stats.completedTasks / totalTasks) * 100)}% delivery rate` : '0%'}</span>
          </div>
        </div>

        {/* KPI 5: Upcoming Posts */}
        <div 
          onClick={() => onNavigate('content')}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-2 hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Upcoming Posts</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
            {stats.upcomingPosts}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            Scheduled in Content Planner
          </div>
        </div>

      </div>

      {/* =========================================================================
          MEANINGFUL DATA VISUALIZATIONS (Calculated 100% Dynamically from Real Data)
         ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
        
        {/* Viz Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest block">
              Business Intelligence & Analytics
            </span>
            <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
              Live Data Visualizations
            </h2>
          </div>

          {/* Viz Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/80 text-xs font-semibold">
            <button
              onClick={() => setActiveViz('status')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeViz === 'status' 
                  ? 'bg-white text-purple-700 shadow-sm font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Task Status Distribution
            </button>
            <button
              onClick={() => setActiveViz('progress')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeViz === 'progress' 
                  ? 'bg-white text-purple-700 shadow-sm font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Project Progress by Client
            </button>
          </div>
        </div>

        {/* VIZ 1: Task Status Distribution (Calculated dynamically from real tasks) */}
        {activeViz === 'status' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-2">
            
            {/* Donut Chart (5 cols) */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-44 h-44 transform -rotate-90">
                  {/* Track Circle */}
                  <circle cx="88" cy="88" r="68" stroke="#f1f5f9" strokeWidth="18" fill="transparent" />
                  
                  {/* To Do Segment */}
                  {toDoCount > 0 && (
                    <circle 
                      cx="88" 
                      cy="88" 
                      r="68" 
                      stroke="#f59e0b" 
                      strokeWidth="18" 
                      strokeDasharray={`${toDoDash} ${circumference}`} 
                      strokeDashoffset="0"
                      fill="transparent" 
                    />
                  )}

                  {/* In Progress Segment */}
                  {inProgressCount > 0 && (
                    <circle 
                      cx="88" 
                      cy="88" 
                      r="68" 
                      stroke="#3b82f6" 
                      strokeWidth="18" 
                      strokeDasharray={`${inProgressDash} ${circumference}`} 
                      strokeDashoffset={`-${toDoDash}`} 
                      fill="transparent" 
                    />
                  )}

                  {/* Review Segment */}
                  {reviewCount > 0 && (
                    <circle 
                      cx="88" 
                      cy="88" 
                      r="68" 
                      stroke="#8b5cf6" 
                      strokeWidth="18" 
                      strokeDasharray={`${reviewDash} ${circumference}`} 
                      strokeDashoffset={`-${toDoDash + inProgressDash}`} 
                      fill="transparent" 
                    />
                  )}

                  {/* Completed Segment */}
                  {completedCount > 0 && (
                    <circle 
                      cx="88" 
                      cy="88" 
                      r="68" 
                      stroke="#10b981" 
                      strokeWidth="18" 
                      strokeDasharray={`${completedDash} ${circumference}`} 
                      strokeDashoffset={`-${toDoDash + inProgressDash + reviewDash}`} 
                      fill="transparent" 
                    />
                  )}
                </svg>

                <div className="absolute text-center">
                  <span className="text-3xl font-black text-slate-900 font-['Outfit'] block leading-none">
                    {totalTasks}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
                    Live Tasks
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-slate-500 mt-2 font-medium">
                {totalTasks > 0 ? `${completedPct}% of deliverables delivered` : 'No tasks in system yet'}
              </span>
            </div>

            {/* Legend Breakdown (7 cols) - Directly reflects live task counts */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="font-bold text-xs text-amber-900">To Do</span>
                  </div>
                  <span className="text-xs font-black text-amber-700">{toDoCount} tasks</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {toDoPct}% of active agency backlog
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/60 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="font-bold text-xs text-blue-900">In Progress</span>
                  </div>
                  <span className="text-xs font-black text-blue-700">{inProgressCount} tasks</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {inProgressPct}% in active production
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200/60 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span className="font-bold text-xs text-purple-900">Review</span>
                  </div>
                  <span className="text-xs font-black text-purple-700">{reviewCount} tasks</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {reviewPct}% waiting client approval
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-bold text-xs text-emerald-900">Completed</span>
                  </div>
                  <span className="text-xs font-black text-emerald-700">{completedCount} tasks</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {completedPct}% verified & delivered
                </div>
              </div>

            </div>

          </div>
        )}


        {/* VIZ 3: Project Progress by Client (Computed dynamically from actual client tasks) */}
        {activeViz === 'progress' && (
          <div className="space-y-4 py-2">
            {clientProgressData.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No active client campaigns in database.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {clientProgressData.map((cp, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block leading-tight">{cp.clientName}</span>
                        <span className="text-[10px] text-slate-500">{cp.completed} of {cp.totalTasks} tasks completed</span>
                      </div>
                      <span className="text-sm font-black text-slate-900 font-['Outfit']">{cp.progress}%</span>
                    </div>
                    
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          cp.progress === 100 ? 'bg-emerald-500' : cp.progress > 50 ? 'bg-purple-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${cp.progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                      <span>Retainer: ₹{cp.retainer.toLocaleString()}</span>
                      <span className={`font-semibold ${cp.progress === 100 ? 'text-emerald-600' : 'text-purple-600'}`}>
                        {cp.progress === 100 ? 'All Completed' : 'Sprint Active'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* =========================================================================
          RECENT TASKS VIEW (Table & Card View from Real Database Records)
         ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
        
        {/* Controls: Title, Search, Filter Pills & View Mode */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div>
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest block">
              Operational Deliverables
            </span>
            <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
              Recent Tasks
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search task, client, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 text-[11px] font-semibold">
              {['ALL', 'To Do', 'In Progress', 'Review', 'Completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setActiveTabStatus(status)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    activeTabStatus === status
                      ? 'bg-white text-purple-700 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* View Mode Switcher: Table vs Cards */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-600">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white text-purple-700 shadow-sm' : 'hover:text-slate-900'}`}
                title="Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'cards' ? 'bg-white text-purple-700 shadow-sm' : 'hover:text-slate-900'}`}
                title="Card View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

        {/* --- VIEW 1: TABLE VIEW --- */}
        {viewMode === 'table' ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-bold">Task</th>
                  <th className="py-3.5 px-4 font-bold">Client</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Assigned To</th>
                  <th className="py-3.5 px-4 font-bold">Deadline</th>
                  <th className="py-3.5 px-4 font-bold text-center">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                          <span>Loading tasks from backend API...</span>
                        </div>
                      ) : (
                        'No matching tasks found. Click "+ New Task" to add a deliverable.'
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((t) => {
                    const taskId = t._id || t.id;
                    const title = t.taskTitle || t.title;
                    const client = t.clientName || t.client;
                    const category = t.service || t.category || 'General';
                    const assigned = t.assignedEmployeeName || t.assignedTo || 'Unassigned';
                    const deadline = formatDate(t.dueDate || t.deadline);
                    const avatarInitials = assigned.split(' ').map(n => n[0]).slice(0, 2).join('');

                    return (
                      <tr 
                        key={taskId}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        {/* Task Title */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block group-hover:text-purple-600 transition-colors">
                            {title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Priority: <span className="font-semibold text-slate-600">{t.priority || 'Medium'}</span>
                          </span>
                        </td>

                        {/* Client */}
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {client}
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                            {category}
                          </span>
                        </td>

                        {/* Assigned To */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                              {avatarInitials}
                            </div>
                            <span className="text-slate-800 font-medium">{assigned}</span>
                          </div>
                        </td>

                        {/* Deadline */}
                        <td className="py-3.5 px-4">
                          <span className="text-slate-800 font-medium block">{deadline}</span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${getStatusBadge(t.status)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(t.status)}`} />
                            <span>{t.status}</span>
                          </span>
                        </td>

                        {/* 1-Click Status Switcher */}
                        <td className="py-3.5 px-4 text-right">
                          <select
                            value={t.status}
                            onChange={(e) => handleUpdateStatus(taskId, e.target.value)}
                            className="text-[10px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer hover:bg-slate-50"
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Review">Review</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* --- VIEW 2: CARDS VIEW --- */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.length === 0 ? (
              <div className="col-span-full py-8 text-center text-slate-400">
                No matching tasks found. Click "+ New Task" to add a deliverable.
              </div>
            ) : (
              filteredTasks.map((t) => {
                const taskId = t._id || t.id;
                const title = t.taskTitle || t.title;
                const client = t.clientName || t.client;
                const category = t.service || t.category || 'General';
                const assigned = t.assignedEmployeeName || t.assignedTo || 'Unassigned';
                const deadline = formatDate(t.dueDate || t.deadline);
                const avatarInitials = assigned.split(' ').map(n => n[0]).slice(0, 2).join('');

                return (
                  <div 
                    key={taskId}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-300 hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                        {category}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(t.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(t.status)}`} />
                        {t.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">{title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{client}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold text-[9px] flex items-center justify-center">
                          {avatarInitials}
                        </div>
                        <span className="text-[11px] text-slate-700 font-medium truncate max-w-[110px]">{assigned}</span>
                      </div>

                      <span className="text-[10px] text-slate-500 font-medium">
                        Due: {deadline}
                      </span>
                    </div>

                    {/* Quick Status Select */}
                    <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Update:</span>
                      <select
                        value={t.status}
                        onChange={(e) => handleUpdateStatus(taskId, e.target.value)}
                        className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 text-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer"
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Review">Review</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Table Footer Navigation Link */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredTasks.length} of {tasks.length} live deliverables</span>
          <button
            onClick={() => onNavigate('tasks')}
            className="text-purple-600 hover:text-purple-700 font-bold flex items-center gap-1 hover:underline"
          >
            <span>Open Full Task Manager</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* =========================================================================
          SECTION 4: CREATE NEW TASK / DELIVERABLE MODAL (All 11 Required Fields)
         ========================================================================= */}
      {isQuickTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl border border-slate-200/90 my-8 space-y-6 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                  Section 4 · Creative Task Intake
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit'] tracking-tight">
                  Create New Deliverable
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assign team roles, schedule multichannel distribution, and configure creative briefs.
                </p>
              </div>
              <button
                onClick={() => setIsQuickTaskOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form: 11 Required Task Fields */}
            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              
              {/* Field 1: Task Title */}
              <div>
                <label className="block text-slate-800 font-bold mb-1.5">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Festive Product Catalog & 3D Render Banner"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs"
                />
              </div>

              {/* Grid Row 1: Client & Service Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Field 2: Client */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    Client Account <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newTask.client}
                    onChange={(e) => setNewTask({ ...newTask, client: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs cursor-pointer"
                  >
                    {clients.map(c => (
                      <option key={c._id || c.id || c.name} value={c.name}>{c.name}</option>
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

                {/* Field 3: Service */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    Service Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newTask.service}
                    onChange={(e) => setNewTask({ ...newTask, service: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs cursor-pointer"
                  >
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Website">Website</option>
                    <option value="ERP Development">ERP Development</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Branding">Branding</option>
                  </select>
                </div>

              </div>

              {/* Grid Row 2: Target Platform & Assigned Employee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Field 4: Platform */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    Target Platform <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newTask.platform}
                    onChange={(e) => setNewTask({ ...newTask, platform: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs cursor-pointer"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Website">Website</option>
                    <option value="Cross-Platform">Cross-Platform</option>
                  </select>
                </div>

                {/* Field 5: Assigned Employee */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    Assigned Employee <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs cursor-pointer"
                  >
                    <option value="Kavita Shah (Creative Lead)">Kavita Shah (Creative Lead)</option>
                    <option value="Aman Verma (Graphic Designer)">Aman Verma (Graphic Designer)</option>
                    <option value="Rohan Mehta (Developer)">Rohan Mehta (Developer)</option>
                    <option value="Pooja Patel (Marketing Strategist)">Pooja Patel (Marketing Strategist)</option>
                    <option value="Riya Shah (Lead Designer)">Riya Shah (Lead Designer)</option>
                  </select>
                </div>

              </div>

              {/* Grid Row 3: Priority & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Field 6: Priority */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    Priority Level <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs cursor-pointer"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent Priority (24h SLA)</option>
                  </select>
                </div>

                {/* Field 7: Status */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    Initial Workflow Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs cursor-pointer"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

              </div>

              {/* Grid Row 4: Start Date & Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Field 8: Start Date */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newTask.startDate}
                    onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs"
                  />
                </div>

                {/* Field 9: Due Date */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">
                    Due Date / Deadline <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs"
                  />
                </div>

              </div>

              {/* Field 10: Reference Link */}
              <div>
                <label className="block text-slate-800 font-bold mb-1.5">
                  Reference Asset Link (Google Drive / Figma / Frame.io)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/drive/folders/... or Figma file URL"
                  value={newTask.referenceLink}
                  onChange={(e) => setNewTask({ ...newTask, referenceLink: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs"
                />
              </div>

              {/* Field 11: Description / Creative Brief */}
              <div>
                <label className="block text-slate-800 font-bold mb-1.5">
                  Creative Brief & Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Detail creative instructions, visual mood, target audience, dimensions, copy angles..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs resize-none"
                />
              </div>

              {/* Form Footer Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuickTaskOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold transition-colors text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold shadow-md shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 text-xs"
                  >
                    {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isSubmitting ? 'Creating Deliverable...' : 'Create Deliverable'}</span>
                  </button>
                </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
