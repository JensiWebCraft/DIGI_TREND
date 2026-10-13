import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Calendar,
  ChevronRight,
  X,
  Sparkles
} from 'lucide-react';
import api from '../services/api';

export default function TasksView({ onSelectTask, currentUser }) {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Instagram Post Design', client: 'Jagdamba Agro Polymers', service: 'Social Media', priority: 'High', status: 'In Progress', dueDate: '12 Oct', assignedTo: 'Riya Shah', description: 'Create a festive post for Navratri with brand colors and product focus.' },
    { id: 2, title: 'Website Development', client: 'ABC Corp', service: 'Website', priority: 'Urgent', status: 'To Do', dueDate: '15 Oct', assignedTo: 'Rahul Patel', description: 'Develop responsive B2B supplier landing page with interactive inquiry form.' },
    { id: 3, title: 'Video Editing', client: 'GreenLife', service: 'Video Editing', priority: 'Medium', status: 'Review', dueDate: '18 Oct', assignedTo: 'Neha Joshi', description: 'Cut 30-sec reels showcase from factory shoot with motion subtitles.' },
    { id: 4, title: 'Logo Design', client: 'Trendy Mart', service: 'Branding', priority: 'High', status: 'Completed', dueDate: '20 Oct', assignedTo: 'Karan Mehta', description: 'Design minimal geometric logo mark with brand guidelines.' },
    { id: 5, title: 'Social Media Strategy', client: 'SkyTech', service: 'Digital Marketing', priority: 'Medium', status: 'In Progress', dueDate: '22 Oct', assignedTo: 'Priya Desai', description: 'Q4 social calendar and meta ads campaign funnel.' },
    { id: 6, title: 'Banner Design', client: 'Fusion Foods', service: 'Graphic Design', priority: 'Medium', status: 'In Progress', dueDate: '24 Oct', assignedTo: 'Aman Verma', description: 'Display standee and hoarding design for trade expo.' },
    { id: 7, title: 'SEO Content', client: 'TechNova', service: 'Digital Marketing', priority: 'High', status: 'Review', dueDate: '26 Oct', assignedTo: 'Pooja Sharma', description: '5 technical pillar articles for organic reach.' }
  ]);

  const [clients, setClients] = useState([]);
  const [selectedTask, setSelectedTask] = useState(tasks[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [clientFilter, setClientFilter] = useState('ALL');
  const [roleFilterMode, setRoleFilterMode] = useState('all'); // 'all' | 'my'
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // Form state with all 11 required Section 4 fields
  const [formData, setFormData] = useState({
    title: '',
    client: 'Jagdamba Agro Polymers',
    service: 'Graphic Design',
    platform: 'Instagram',
    assignedTo: 'Kavita Shah (Creative Lead)',
    priority: 'High',
    status: 'To Do',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    description: '',
    referenceLink: ''
  });

  useEffect(() => {
    // Load live tasks and clients from Axios
    const loadData = async () => {
      try {
        const [tasksRes, clientsRes] = await Promise.allSettled([
          api.getTasks(),
          api.getClients()
        ]);
        if (tasksRes.status === 'fulfilled' && tasksRes.value?.data && tasksRes.value.data.length > 0) {
          setTasks(tasksRes.value.data);
          setSelectedTask(tasksRes.value.data[0]);
        }
        if (clientsRes.status === 'fulfilled' && clientsRes.value?.data && clientsRes.value.data.length > 0) {
          setClients(clientsRes.value.data);
        }
      } catch (err) {
        console.warn('Using initial tasks state:', err.message);
      }
    };
    loadData();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert('Task title is required');

    const newTask = {
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    try {
      await api.createTask(newTask);
    } catch (err) {
      console.warn('Axios error fallback:', err.message);
    }

    setTasks(prev => [newTask, ...prev]);
    setSelectedTask(newTask);
    setIsNewTaskModalOpen(false);
    setFormData({
      title: '',
      client: clients[0]?.name || 'Jagdamba Agro Polymers',
      service: 'Graphic Design',
      platform: 'Instagram',
      assignedTo: 'Kavita Shah (Creative Lead)',
      priority: 'High',
      status: 'To Do',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      description: '',
      referenceLink: ''
    });
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    client: 'Jagdamba Agro Polymers',
    service: 'Graphic Design',
    platform: 'Instagram',
    assignedTo: 'Kavita Shah (Creative Lead)',
    priority: 'High',
    status: 'To Do',
    startDate: '',
    dueDate: '',
    description: '',
    referenceLink: ''
  });

  const handleStartEdit = (task) => {
    setEditingTaskId(task.id || task._id);
    setEditFormData({
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
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editFormData.title.trim()) return alert('Task title is required');

    try {
      await api.updateTask(editingTaskId, editFormData);
    } catch (err) {
      console.warn('Axios error fallback:', err.message);
    }

    const updatedTasks = tasks.map(t => {
      if ((t.id && t.id === editingTaskId) || (t._id && t._id === editingTaskId)) {
        return { ...t, ...editFormData, updatedAt: new Date().toISOString() };
      }
      return t;
    });

    setTasks(updatedTasks);
    if (selectedTask && (selectedTask.id === editingTaskId || selectedTask._id === editingTaskId)) {
      setSelectedTask({ ...selectedTask, ...editFormData });
    }
    setIsEditModalOpen(false);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this deliverable?')) return;
    try {
      await api.deleteTask(taskId);
    } catch (err) {
      console.warn('Axios error fallback:', err.message);
    }

    const updatedTasks = tasks.filter(t => t.id !== taskId && t._id !== taskId);
    setTasks(updatedTasks);
    if (selectedTask && (selectedTask.id === taskId || selectedTask._id === taskId)) {
      setSelectedTask(updatedTasks[0] || null);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await api.updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.warn('Axios update status fallback:', err.message);
    }

    setTasks(prev => prev.map(t => {
      if (t.id === taskId || t._id === taskId) {
        return { ...t, status: newStatus };
      }
      return t;
    }));

    if (selectedTask && (selectedTask.id === taskId || selectedTask._id === taskId)) {
      setSelectedTask(prev => ({ ...prev, status: newStatus }));
    }
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'Urgent': return 'bg-rose-50 text-rose-600 border border-rose-200';
      case 'High': return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'Medium': return 'bg-slate-100 text-slate-600 border border-slate-200';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 'In Progress': return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'To Do': return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'Review': return 'bg-purple-50 text-purple-600 border border-purple-200';
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  // Role-based matching helper according to PDF core roles (Page 2 & Page 7)
  const isTaskAssignedToRole = (t, user) => {
    if (!user) return true;
    if (user.id === 'u0') return true; // Agency Owner / Manager has full agency oversight

    const assigned = (t.assignedTo || t.assignedEmployeeName || '').toLowerCase();
    const service = (t.service || t.category || '').toLowerCase();
    const firstName = (user.name || '').split(' ')[0].toLowerCase();
    const lastName = (user.name || '').split(' ')[1]?.toLowerCase() || '';

    // Direct name match
    if (assigned.includes(firstName) || (lastName && assigned.includes(lastName))) {
      return true;
    }

    // Role-specific assignment categories
    if (user.id === 'u1') { // Creative Team Member (Kavita Shah)
      return service.includes('graphic') || service.includes('social') || service.includes('video') || service.includes('branding') ||
             assigned.includes('kavita') || assigned.includes('aman') || assigned.includes('riya') || assigned.includes('neha') || assigned.includes('karan');
    }
    if (user.id === 'u3') { // Developer (Rohan Mehta)
      return service.includes('website') || service.includes('erp') || service.includes('tech') ||
             assigned.includes('rohan') || assigned.includes('rahul');
    }
    if (user.id === 'u4') { // Marketing Team Member (Pooja Patel)
      return service.includes('marketing') || service.includes('seo') || service.includes('social') ||
             assigned.includes('pooja') || assigned.includes('priya');
    }

    return false;
  };

  const myRoleTasksCount = tasks.filter(t => isTaskAssignedToRole(t, currentUser)).length;

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.client?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesClient = clientFilter === 'ALL' || t.client === clientFilter;
    const matchesRole = roleFilterMode === 'all' || isTaskAssignedToRole(t, currentUser);
    return matchesSearch && matchesStatus && matchesClient && matchesRole;
  });

  // Only select a task if it exists inside filteredTasks! If filteredTasks is empty, activeSelectedTask is null.
  const activeSelectedTask = filteredTasks.find(t => (t.id || t._id) === (selectedTask?.id || selectedTask?._id)) || (filteredTasks.length > 0 ? filteredTasks[0] : null);

  return (
    <div className="flex-1 bg-[#f8fafc] text-slate-800 min-h-screen p-6 lg:p-8 space-y-6">
      
      {/* Top Header Bar matching reference Page 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">Creative Tasks</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage agency assignments, due dates, and designer workloads.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Role Filter Mode Toggle */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setRoleFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                roleFilterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Agency Tasks ({tasks.length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilterMode('my')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                roleFilterMode === 'my'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>My Role Tasks</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                roleFilterMode === 'my' ? 'bg-purple-700/80 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {myRoleTasksCount}
              </span>
            </button>
          </div>

          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase shadow-md flex items-center gap-2 transition-colors w-fit"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Role Filter Active Notification Banner */}
      {roleFilterMode === 'my' && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
            <span className="font-semibold">Filtered for:</span>
            <span className="font-bold bg-white px-2 py-0.5 rounded border border-purple-200 text-purple-700 shadow-xs">
              {currentUser?.name || 'Active User'} · {currentUser?.role || 'Team Member'}
            </span>
            <span className="text-purple-600/80">({myRoleTasksCount} deliverables relevant to your department)</span>
          </div>
          <button
            onClick={() => setRoleFilterMode('all')}
            className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer"
          >
            Show All Agency Tasks
          </button>
        </div>
      )}

      {/* Filter and Search Bar matching Page 3 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-3 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Clients</option>
            <option value="Jagdamba Agro Polymers">Jagdamba Polymers</option>
            <option value="ABC Corp">ABC Corp</option>
            <option value="GreenLife">GreenLife</option>
            <option value="Trendy Mart">Trendy Mart</option>
            <option value="SkyTech">SkyTech</option>
            <option value="Fusion Foods">Fusion Foods</option>
            <option value="TechNova">TechNova</option>
          </select>
        </div>
      </div>

      {/* Tasks Table matching Page 3 */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] text-slate-500 font-semibold">
                <th className="py-3 px-4 font-medium">Task</th>
                <th className="py-3 px-4 font-medium">Client</th>
                <th className="py-3 px-4 font-medium">Service</th>
                <th className="py-3 px-4 font-medium">Priority</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Due Date</th>
                <th className="py-3 px-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-4 text-center">
                    <div className="max-w-md mx-auto space-y-2 text-slate-400">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                        <Clock className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">
                        No deliverables found for {currentUser?.role || 'this filter'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {roleFilterMode === 'my' 
                          ? `There are currently 0 tasks assigned to ${currentUser?.name} (${currentUser?.role}).`
                          : 'Try clearing your search query or status filter.'}
                      </p>
                      {roleFilterMode === 'my' && (
                        <div className="pt-2 flex items-center justify-center gap-2">
                          <button
                            onClick={() => setRoleFilterMode('all')}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                          >
                            View All Agency Tasks ({tasks.length})
                          </button>
                          <button
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                assignedTo: `${currentUser?.name} (${currentUser?.role})`,
                                service: currentUser?.id === 'u3' ? 'Website' : currentUser?.id === 'u4' ? 'Digital Marketing' : 'Graphic Design'
                              }));
                              setIsNewTaskModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            + New Task for {currentUser?.role?.split(' ')[0]}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((t) => {
                  const isSelected = activeSelectedTask && ((activeSelectedTask.id === t.id || activeSelectedTask._id === t._id) || (activeSelectedTask.id === t._id || activeSelectedTask._id === t.id));
                  const taskId = t.id || t._id;
                  return (
                    <tr 
                      key={taskId}
                      onClick={() => setSelectedTask(t)}
                      className={`transition-colors cursor-pointer ${
                        isSelected ? 'bg-purple-50/50' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-800">{t.title || t.taskTitle}</td>
                      <td className="py-3.5 px-4 text-slate-600">{t.client || t.clientName}</td>
                      <td className="py-3.5 px-4 text-slate-500">{t.service || t.category}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getPriorityBadge(t.priority)}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getStatusBadge(t.status)}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-500 font-medium">
                        {t.dueDate || t.deadline}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleStartEdit(t)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                            title="Edit deliverable"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(taskId)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete deliverable"
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

      {/* Bottom Panel: "Task Details" Card matching Page 3 (Only shown when activeSelectedTask exists!) */}
      {activeSelectedTask && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <h3 className="font-bold text-sm text-slate-900">Task Details</h3>
              <select
                value={activeSelectedTask.status}
                onChange={(e) => handleUpdateStatus(activeSelectedTask.id || activeSelectedTask._id, e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded-lg px-2.5 py-1 focus:outline-none focus:border-purple-500 cursor-pointer shadow-xs"
                title="Change workflow status"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStartEdit(activeSelectedTask)}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 text-slate-700 font-semibold text-xs flex items-center gap-1 shadow-sm transition-colors"
                title="Edit this task"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDeleteTask(activeSelectedTask.id || activeSelectedTask._id)}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 font-semibold text-xs flex items-center gap-1 shadow-sm transition-colors"
                title="Delete this task"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
              <button
                onClick={() => onSelectTask(activeSelectedTask)}
                className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Full Screen Detail View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Dynamic Service / Artwork Thumbnail */}
            <div className="md:col-span-2">
              <div 
                onClick={() => onSelectTask(activeSelectedTask)}
                className="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-800 via-indigo-900 to-slate-900 p-2 flex flex-col items-center justify-center text-center text-white shadow-md cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-1 text-sm">
                  {String(activeSelectedTask.service || activeSelectedTask.category || '').toLowerCase().includes('website') || String(activeSelectedTask.service || activeSelectedTask.category || '').toLowerCase().includes('erp') ? '💻' :
                   String(activeSelectedTask.service || activeSelectedTask.category || '').toLowerCase().includes('video') ? '🎬' :
                   String(activeSelectedTask.service || activeSelectedTask.category || '').toLowerCase().includes('marketing') ? '📈' : '🎨'}
                </div>
                <span className="text-[10px] font-black tracking-tight leading-tight line-clamp-1 px-1">
                  {activeSelectedTask.title || activeSelectedTask.taskTitle}
                </span>
                <span className="text-[8px] text-purple-200/80 mt-0.5">
                  {activeSelectedTask.service || activeSelectedTask.category || 'Deliverable'}
                </span>
              </div>
            </div>

            {/* Middle Metadata */}
            <div className="md:col-span-5 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Client:</span>
                <span className="font-bold text-slate-800">{activeSelectedTask.client || activeSelectedTask.clientName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Service:</span>
                <span className="font-bold text-slate-800">{activeSelectedTask.service || activeSelectedTask.category || 'Graphic Design'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Platform:</span>
                <span className="font-bold text-slate-800">{activeSelectedTask.platform || 'Instagram'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Assigned To:</span>
                <span className="font-bold text-purple-700">{activeSelectedTask.assignedTo || activeSelectedTask.assignedEmployeeName || 'Kavita Shah'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Priority:</span>
                <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${getPriorityBadge(activeSelectedTask.priority)}`}>
                  {activeSelectedTask.priority || 'Medium'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Status:</span>
                <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusBadge(activeSelectedTask.status)}`}>
                  {activeSelectedTask.status || 'To Do'}
                </span>
              </div>
            </div>

            {/* Right Meta Dates & Description */}
            <div className="md:col-span-5 space-y-2 text-xs border-l border-slate-100 pl-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Start Date:</span>
                <span className="font-semibold text-slate-700">
                  {activeSelectedTask.startDate ? String(activeSelectedTask.startDate).split('T')[0] : '10 Oct 2026'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Due Date:</span>
                <span className="font-bold text-slate-900">
                  {activeSelectedTask.dueDate ? String(activeSelectedTask.dueDate).split('T')[0] : (activeSelectedTask.deadline ? String(activeSelectedTask.deadline).split('T')[0] : '12 Oct 2026')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Description:</span>
                <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-2">
                  {activeSelectedTask.description || 'Deliverable brief and creative requirements.'}
                </p>
              </div>
              <div className="flex justify-between pt-1 text-[11px]">
                <span className="text-slate-400">Reference:</span>
                {activeSelectedTask.referenceLink ? (
                  <a 
                    href={activeSelectedTask.referenceLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-purple-600 hover:underline truncate max-w-[150px] font-mono flex items-center gap-1"
                  >
                    <span>{activeSelectedTask.referenceLink.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink className="w-2.5 h-2.5 inline shrink-0" />
                  </a>
                ) : (
                  <span className="text-slate-400 font-mono">None</span>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 4: CREATIVE TASK MANAGEMENT - CREATE NEW TASK MODAL (All 11 Fields)
         ========================================================================= */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl border border-slate-200/90 my-8 space-y-6 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                  Section 4 · Creative Task Management
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit'] tracking-tight">
                  Create New Deliverable
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assign team roles, schedule multichannel distribution, and configure creative briefs.
                </p>
              </div>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
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
                  placeholder="e.g. Diwali Festive Packaging Design & 3D Render"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
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
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
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
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
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
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
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
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
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
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
                  value={formData.referenceLink}
                  onChange={(e) => setFormData({ ...formData, referenceLink: e.target.value })}
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
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all font-medium text-xs resize-none"
                />
              </div>

              {/* Form Footer Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold transition-colors text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold shadow-md shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Deliverable</span>
                  </button>
                </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 4: EDIT TASK MODAL (All 11 Fields)
         ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl border border-slate-200/90 my-8 space-y-6 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                  Section 4 · Edit Deliverable
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit'] tracking-tight">
                  Edit Task Metadata
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Modify task specifications, assignee, timeline, and creative brief details.
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

            {/* Modal Form: 11 Required Fields */}
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
              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold transition-colors text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold shadow-md shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
