import React from 'react';
import { LayoutDashboard, CheckSquare, Calendar, Users, Bot } from 'lucide-react';

export default function MobileNav({ activePage, setActivePage }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'content', label: 'Content', icon: Calendar },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'ai', label: 'AI', icon: Bot },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0b0f1a] border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl backdrop-blur-md">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activePage === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActivePage(tab.id)}
            className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
              isActive ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
