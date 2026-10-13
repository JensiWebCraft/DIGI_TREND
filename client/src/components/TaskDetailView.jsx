import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Send, 
  Calendar, 
  User, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Share2,
  Sparkles,
  X,
  AlertTriangle,
  Plus
} from 'lucide-react';
import api from '../services/api';

export default function TaskDetailView({ task, onBack, onUpdateStatus, onUpdateTask, onDelete }) {
  const [currentTask, setCurrentTask] = useState(task);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    setCurrentTask(task);
  }, [task]);

  // Form state for editing
  const [editFormData, setEditFormData] = useState({
    title: task.title || task.taskTitle || '',
    client: task.client || task.clientName || 'Jagdamba Agro Polymers',
    service: task.service || task.category || 'Graphic Design',
    platform: task.platform || 'Instagram',
    assignedTo: task.assignedTo || task.assignedEmployeeName || 'Kavita Shah (Creative Lead)',
    priority: task.priority || 'Medium',
    status: task.status || 'In Progress',
    startDate: task.startDate ? (String(task.startDate).includes('T') ? String(task.startDate).split('T')[0] : String(task.startDate)) : '',
    dueDate: task.dueDate ? (String(task.dueDate).includes('T') ? String(task.dueDate).split('T')[0] : String(task.dueDate)) : (task.deadline ? (String(task.deadline).includes('T') ? String(task.deadline).split('T')[0] : String(task.deadline)) : ''),
    referenceLink: task.referenceLink || '',
    description: task.description || ''
  });

  const handleOpenEdit = () => {
    setEditFormData({
      title: currentTask.title || currentTask.taskTitle || '',
      client: currentTask.client || currentTask.clientName || 'Jagdamba Agro Polymers',
      service: currentTask.service || currentTask.category || 'Graphic Design',
      platform: currentTask.platform || 'Instagram',
      assignedTo: currentTask.assignedTo || currentTask.assignedEmployeeName || 'Kavita Shah (Creative Lead)',
      priority: currentTask.priority || 'Medium',
      status: currentTask.status || 'In Progress',
      startDate: currentTask.startDate ? (String(currentTask.startDate).includes('T') ? String(currentTask.startDate).split('T')[0] : String(currentTask.startDate)) : '',
      dueDate: currentTask.dueDate ? (String(currentTask.dueDate).includes('T') ? String(currentTask.dueDate).split('T')[0] : String(currentTask.dueDate)) : (currentTask.deadline ? (String(currentTask.deadline).includes('T') ? String(currentTask.deadline).split('T')[0] : String(currentTask.deadline)) : ''),
      referenceLink: currentTask.referenceLink || '',
      description: currentTask.description || ''
    });
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    api.getClients().then(res => {
      if (res?.data && res.data.length > 0) setClients(res.data);
    }).catch(() => {});
  }, []);

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editFormData.title.trim()) return alert('Task title is required');

    setIsSaving(true);
    const taskId = currentTask.id || currentTask._id;
    const updated = {
      ...currentTask,
      ...editFormData,
      taskTitle: editFormData.title,
      clientName: editFormData.client,
      assignedEmployeeName: editFormData.assignedTo,
      category: editFormData.service,
      deadline: editFormData.dueDate
    };

    // Instant local state update so changed data appears immediately
    setCurrentTask(updated);

    try {
      if (onUpdateTask) {
        await onUpdateTask(taskId, updated);
      }
      await api.updateTask(taskId, editFormData);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Failed to update task:', err);
      setIsEditModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    const taskId = currentTask.id || currentTask._id;
    const updated = { ...currentTask, status: newStatus };
    setCurrentTask(updated);
    if (onUpdateStatus) {
      onUpdateStatus(taskId, newStatus);
    }
    try {
      await api.updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.warn('API update status error:', err.message);
    }
  };

  const handleConfirmDelete = async () => {
    const taskId = currentTask.id || currentTask._id;
    setIsDeleteModalOpen(false);
    if (onDelete) {
      await onDelete(taskId);
    }
  };

  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Riya Shah',
      role: 'Graphic Designer',
      avatar: 'RS',
      text: 'First draft is ready for review with 3 aspect ratio variations.',
      time: '11 Oct 2026, 03:15 PM'
    },
    {
      id: 2,
      author: 'Mahek Kureshi',
      role: 'Creative Ops Admin',
      avatar: 'MK',
      text: 'Looks great! Please ensure the Jagdamba polymer logo contrast is preserved on dark background.',
      time: '11 Oct 2026, 05:40 PM'
    }
  ]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments([
      ...comments,
      {
        id: Date.now(),
        author: 'Mahek Kureshi',
        role: 'Creative Ops Admin',
        avatar: 'MK',
        text: newComment,
        time: 'Just now'
      }
    ]);
    setNewComment('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'To Do': return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'Review': return 'bg-purple-50 text-purple-600 border border-purple-200';
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      default: return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  return (
    <div className="flex-1 bg-[#f8fafc] text-slate-800 min-h-screen p-6 lg:p-8 space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tasks</span>
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleOpenEdit}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Task Header Title + Status */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-black text-slate-900 font-['Outfit']">
            {currentTask.title || currentTask.taskTitle || 'Deliverable'}
          </h2>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(currentTask.status || 'In Progress')}`}>
            {currentTask.status || 'In Progress'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Update Status:</span>
          <select
            value={currentTask.status || 'In Progress'}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 font-semibold text-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer shadow-sm"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* 3-Column Layout Matching Reference Page 7 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: 1:1 Festive Image Artwork Showcase (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
          
          {/* Authentic 1:1 Festive Graphic Poster Preview */}
          <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-[#800020] via-[#5c0017] to-[#2b000b] relative overflow-hidden flex flex-col justify-between p-5 text-amber-100 shadow-md">
            
            {/* Top decorative mandala aura */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-widest uppercase font-bold text-amber-300 truncate max-w-[200px]">
                {currentTask.client || currentTask.clientName || 'JAGDAMBA AGRO POLYMERS'}
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </div>

            {/* Center: Dandiya Festive Artwork Illustration */}
            <div className="text-center space-y-1 my-auto">
              <div className="w-20 h-20 mx-auto rounded-full border-2 border-amber-300/40 p-1 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-amber-300">
                  <path d="M50 15 C35 30, 20 45, 50 85 C80 45, 65 30, 50 15 Z" fill="#f59e0b" opacity="0.8" />
                  <circle cx="50" cy="40" r="10" fill="#fbbf24" />
                  <line x1="30" y1="50" x2="70" y2="30" stroke="#fef3c7" strokeWidth="3" />
                  <line x1="30" y1="30" x2="70" y2="50" stroke="#fef3c7" strokeWidth="3" />
                </svg>
              </div>
              <h4 className="text-lg font-black font-['Outfit'] text-amber-200 tracking-wider truncate max-w-[220px] mx-auto">
                {currentTask.title || currentTask.taskTitle || 'Creative Concept'}
              </h4>
              <p className="text-[10px] text-amber-100/80 max-w-[200px] mx-auto leading-relaxed line-clamp-2">
                {currentTask.description || '9 Nights of Devotion, Strength & Polymer Precision'}
              </p>
            </div>

            {/* Bottom branding footer */}
            <div className="flex items-center justify-between text-[9px] text-amber-300/80 pt-2 border-t border-amber-400/20">
              <span className="truncate max-w-[120px]">{currentTask.platform || 'Instagram'}</span>
              <span className="font-mono">v1.2 Approved</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>{currentTask.service || 'Creative'} Asset</span>
            {currentTask.referenceLink ? (
              <a 
                href={currentTask.referenceLink} 
                target="_blank" 
                rel="noreferrer" 
                className="text-purple-600 font-semibold hover:underline flex items-center gap-1"
              >
                <span>View Master Asset</span>
                <ExternalLink className="w-3 h-3 inline" />
              </a>
            ) : (
              <span className="text-slate-400">Master Asset</span>
            )}
          </div>
        </div>

        {/* Center: Task Metadata Details (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Task Specifications
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Client</span>
              <span className="font-bold text-slate-800">{currentTask.client || currentTask.clientName || 'General Client'}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Service / Category</span>
              <span className="font-bold text-slate-800">{currentTask.service || currentTask.category || 'Graphic Design'}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Platform</span>
              <span className="font-bold text-slate-800">{currentTask.platform || 'Instagram'}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Assigned Specialist</span>
              <span className="font-bold text-purple-700">{currentTask.assignedTo || currentTask.assignedEmployeeName || 'Unassigned'}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Priority</span>
              <span className="font-bold text-amber-600">{currentTask.priority || 'Medium'}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 block text-[11px]">Start Date</span>
                <span className="font-semibold text-slate-700">
                  {currentTask.startDate ? (String(currentTask.startDate).includes('T') ? String(currentTask.startDate).split('T')[0] : String(currentTask.startDate)) : 'Not set'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Due Date</span>
                <span className="font-bold text-slate-800">
                  {currentTask.dueDate ? (String(currentTask.dueDate).includes('T') ? String(currentTask.dueDate).split('T')[0] : String(currentTask.dueDate)) : (currentTask.deadline ? (String(currentTask.deadline).includes('T') ? String(currentTask.deadline).split('T')[0] : String(currentTask.deadline)) : 'Not set')}
                </span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Reference Asset</span>
              {currentTask.referenceLink ? (
                <a 
                  href={currentTask.referenceLink} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-purple-600 hover:underline flex items-center gap-1 font-mono text-[11px] truncate max-w-full"
                >
                  <span className="truncate">{currentTask.referenceLink.replace(/^https?:\/\//, '')}</span>
                  <ExternalLink className="w-3 h-3 inline shrink-0" />
                </a>
              ) : (
                <span className="text-slate-400 font-mono text-[11px]">None attached</span>
              )}
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Creative Description</span>
              <p className="text-slate-600 leading-relaxed mt-0.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px]">
                {currentTask.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Activity & Comments Thread (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Comments & Feedback
          </h3>

          {/* Comments List */}
          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {comments.map((c) => (
              <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                      {c.avatar}
                    </div>
                    <span className="font-bold text-slate-800">{c.author}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{c.time}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px] pl-7">
                  {c.text}
                </p>
              </div>
            ))}
          </div>

          {/* Add Comment Input Form */}
          <form onSubmit={handleAddComment} className="pt-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors"
              >
                Post
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* =========================================================================
          EDIT DELIVERABLE MODAL (All 11 Section 4 Fields)
         ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl border border-slate-200/90 my-8 space-y-6 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                  Section 4 · Edit Creative Deliverable
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit'] tracking-tight">
                  Edit Task Metadata
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Modify specifications, assignees, deadlines, and creative brief details.
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form: 11 Fields */}
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              
              {/* Field 1: Task Title */}
              <div>
                <label className="block text-slate-800 font-bold mb-1.5">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Festive Packaging Design"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
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
                    value={editFormData.client}
                    onChange={(e) => setEditFormData({ ...editFormData, client: e.target.value })}
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
                    value={editFormData.service}
                    onChange={(e) => setEditFormData({ ...editFormData, service: e.target.value })}
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
                    value={editFormData.platform}
                    onChange={(e) => setEditFormData({ ...editFormData, platform: e.target.value })}
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
                    value={editFormData.assignedTo}
                    onChange={(e) => setEditFormData({ ...editFormData, assignedTo: e.target.value })}
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
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
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
                    Workflow Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
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
                    value={editFormData.startDate}
                    onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
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
                    value={editFormData.dueDate}
                    onChange={(e) => setEditFormData({ ...editFormData, dueDate: e.target.value })}
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
                  value={editFormData.referenceLink}
                  onChange={(e) => setEditFormData({ ...editFormData, referenceLink: e.target.value })}
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
                  placeholder="Detail creative instructions, visual mood, dimensions..."
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs resize-none"
                />
              </div>

              {/* Form Footer Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Updates live database record directly</span>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold transition-colors text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold shadow-md shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 text-xs disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Saving Changes...' : 'Save Deliverable'}</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          DELETE CONFIRMATION MODAL
         ========================================================================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl border border-slate-200/90 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                  Delete Deliverable?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Are you sure you want to permanently delete this task?
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-700">
              <span className="font-bold text-slate-900 block truncate">
                {task.title || task.taskTitle}
              </span>
              <span className="text-[11px] text-slate-500">
                Client: {task.client || task.clientName} · Status: {task.status}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              This action cannot be undone and will delete the record from active pipelines.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
