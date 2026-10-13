import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Users, 
  Bot, 
  Home,
  ChevronUp,
  Check,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, onGoHome, currentUser, onSwitchRole, roles = [] }) {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'content', label: 'Content Planner', icon: Calendar },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'ai', label: 'AI Assistant', icon: Bot },
  ];

  const user = currentUser || {
    name: 'Mahek Kureshi',
    role: 'Agency Owner / Manager',
    initials: 'MK',
    color: 'from-purple-500 to-indigo-500'
  };
  return (
    <aside className="hidden md:flex w-56 bg-[#0b0f1a] text-slate-300 border-r border-slate-800/80 flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-30">
      
      {/* Brand Logo Header & Nav Items */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 flex items-center gap-3 border-b border-slate-800/60">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-md shadow-purple-500/20">
            <div className="w-full h-full bg-[#0b0f1a] rounded-[10px] flex items-center justify-center font-black text-xs text-white">
              D
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-white font-['Outfit']">
              DiGi Trend
            </h1>
            <p className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">Branding Solutions</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800/60 my-2">
            <button
              onClick={onGoHome}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 text-cyan-400" />
              <span>Landing Page</span>
            </button>
          </div>
        </nav>
      </div>

      {/* User Profile at Bottom with Role Switcher Popover */}
      <div className="p-3 border-t border-slate-800/60 relative">
        
        {/* Role Selection Popover */}
        {isRoleMenuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#121829] border border-slate-700/80 rounded-2xl p-2 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50">
            <div className="px-2.5 py-1.5 border-b border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                Switch Team Role
              </span>
              <span className="text-[9px] text-purple-400 font-mono">PDF Roles</span>
            </div>

            <div className="space-y-1 pt-1 max-h-56 overflow-y-auto">
              {roles.map((r) => {
                const isCurrent = user.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      if (onSwitchRole) onSwitchRole(r);
                      setIsRoleMenuOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer ${
                      isCurrent 
                        ? 'bg-purple-600/20 border border-purple-500/40 text-white' 
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${r.color || 'from-purple-500 to-indigo-500'} flex items-center justify-center font-bold text-[10px] text-white shrink-0`}>
                      {r.initials}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <span className="text-xs font-bold block truncate leading-tight">
                        {r.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {r.role}
                      </span>
                    </div>
                    {isCurrent && (
                      <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Trigger Button */}
        <button
          onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
          className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800/70 hover:border-purple-500/40 transition-all cursor-pointer group text-left"
          title="Click to switch team role"
        >
          <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${user.color || 'from-purple-500 to-indigo-500'} flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs`}>
            {user.initials || 'MK'}
          </div>
          <div className="overflow-hidden flex-1 text-left">
            <span className="font-bold text-xs text-white block truncate leading-tight group-hover:text-purple-300 transition-colors">
              {user.name}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              {user.role}
            </span>
          </div>
          <ChevronUp className={`w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition-transform ${isRoleMenuOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

    </aside>
  );
}
