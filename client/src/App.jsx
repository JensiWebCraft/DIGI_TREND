import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import DashboardView from './components/DashboardView';
import TasksView from './components/TasksView';
import TaskDetailView from './components/TaskDetailView';
import ContentPlannerView from './components/ContentPlannerView';
import ClientsView from './components/ClientsView';
import AIAssistantView from './components/AIAssistantView';
import api from './services/api';

export const TEAM_ROLES = [
  { id: 'u0', name: 'Mahek Kureshi', role: 'Agency Owner / Manager', initials: 'MK', dept: 'Executive & Ops', color: 'from-purple-500 to-indigo-500' },
  { id: 'u1', name: 'Kavita Shah', role: 'Creative Team Member', initials: 'KS', dept: 'Design & Visuals', color: 'from-pink-500 to-rose-500' },
  { id: 'u3', name: 'Rohan Mehta', role: 'Developer', initials: 'RM', dept: 'Web & ERP Tech', color: 'from-blue-500 to-cyan-500' },
  { id: 'u4', name: 'Pooja Patel', role: 'Marketing Team Member', initials: 'PP', dept: 'Performance Marketing', color: 'from-amber-500 to-orange-500' }
];

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'app'
  const [activePage, setActivePage] = useState('dashboard'); // 'dashboard' | 'tasks' | 'content' | 'clients' | 'ai' | 'task-detail'
  const [currentUser, setCurrentUser] = useState(TEAM_ROLES[0]);
  
  // Selected task state for Page 7 (Task Detail View)
  const [selectedTask, setSelectedTask] = useState({
    id: 1,
    title: 'Instagram Post Design',
    client: 'Jagdamba Agro Polymers',
    service: 'Social Media',
    priority: 'High',
    status: 'In Progress',
    dueDate: '12 Oct 2026',
    assignedTo: 'Riya Shah',
    description: 'Create a festive post for Navratri with brand colors and product focus.'
  });

  const handleLaunchApp = (page = 'dashboard') => {
    setActivePage(page);
    setCurrentView('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setActivePage('task-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.warn('API update task status fallback:', err.message);
    }
    setSelectedTask(prev => ({ ...prev, status: newStatus }));
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const res = await api.updateTask(taskId, updatedData);
      if (res?.data) {
        setSelectedTask(res.data);
      } else {
        setSelectedTask(prev => ({ ...prev, ...updatedData }));
      }
    } catch (err) {
      console.warn('API update task fallback:', err.message);
      setSelectedTask(prev => ({ ...prev, ...updatedData }));
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.deleteTask(taskId);
    } catch (err) {
      console.warn('API delete task fallback:', err.message);
    }
    setActivePage('tasks');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-['Plus_Jakarta_Sans']">
      
      {currentView === 'landing' ? (
        <LandingPage onLaunchApp={handleLaunchApp} />
      ) : (
        <div className="flex min-h-screen pb-16 md:pb-0">
          
          {/* Reusable Sidebar (Desktop) matching reference pages 2 to 6 */}
          <Sidebar
            activePage={activePage}
            setActivePage={setActivePage}
            currentUser={currentUser}
            onSwitchRole={setCurrentUser}
            roles={TEAM_ROLES}
            onGoHome={() => {
              setCurrentView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Main Workspace Area (Renders corresponding page 2 to 7) */}
          <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
            {/* Mobile Header with Quick Role Cycler (Only visible on screens < 768px) */}
            <header className="md:hidden flex items-center justify-between px-4 py-2.5 bg-[#0b0f1a] text-white border-b border-slate-800 sticky top-0 z-40 shrink-0">
              <div 
                onClick={() => {
                  setCurrentView('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px]">
                  <div className="w-full h-full bg-[#0b0f1a] rounded-[5px] flex items-center justify-center font-black text-[9px]">
                    D
                  </div>
                </div>
                <span className="font-extrabold text-xs tracking-tight font-['Outfit']">DiGi Trend</span>
              </div>

              {/* Mobile Role Switcher Pill */}
              <button
                onClick={() => {
                  const currIdx = TEAM_ROLES.findIndex(r => r.id === currentUser.id);
                  const nextRole = TEAM_ROLES[(currIdx + 1) % TEAM_ROLES.length];
                  setCurrentUser(nextRole);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-[10px] text-purple-300 active:scale-95 transition-transform"
                title="Tap to cycle team role"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span className="font-semibold">{currentUser.name.split(' ')[0]}</span>
                <span className="text-[9px] text-slate-400">({currentUser.role.split(' ')[0]})</span>
              </button>
            </header>

            <main className="flex-1 overflow-x-hidden">
            {activePage === 'dashboard' && (
              <DashboardView 
                currentUser={currentUser}
                onNavigate={(target) => setActivePage(target)} 
              />
            )}

            {activePage === 'tasks' && (
              <TasksView 
                currentUser={currentUser}
                onSelectTask={handleSelectTask} 
              />
            )}

            {activePage === 'task-detail' && (
              <TaskDetailView 
                task={selectedTask}
                onBack={() => setActivePage('tasks')}
                onUpdateStatus={handleUpdateTaskStatus}
                onUpdateTask={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            )}

            {activePage === 'content' && (
              <ContentPlannerView />
            )}

            {activePage === 'clients' && (
              <ClientsView />
            )}

            {activePage === 'ai' && (
              <AIAssistantView currentUser={currentUser} />
            )}
          </main>
        </div>

          {/* Mobile Bottom Navigation Bar matching reference Page 9 */}
          <MobileNav
            activePage={activePage}
            setActivePage={setActivePage}
          />

        </div>
      )}

    </div>
  );
}
