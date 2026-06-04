import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Columns, 
  LayoutDashboard, 
  Smartphone, 
  Wallet, 
  Hammer 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const menuItems = [
    { to: '/', label: 'Kanban Board', icon: <Columns className="w-4 h-4" /> },
    { to: '/dashboard', label: 'Manager Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/tablet', label: 'Worker Tablet', icon: <Smartphone className="w-4 h-4" /> },
    { to: '/finance', label: 'Finance Ledger', icon: <Wallet className="w-4 h-4" /> }
  ];

  return (
    <aside className="w-64 bg-brand-surface border-r border-brand-border flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-brand-border">
        <div className="p-1.5 bg-brand-emerald/10 text-brand-emerald rounded-lg">
          <Hammer className="w-5 h-5" />
        </div>
        <div>
          <span className="font-extrabold text-slate-100 tracking-wider text-sm">WOODFLOW</span>
          <span className="text-[10px] text-brand-emerald font-bold tracking-widest block -mt-1">ERP SYSTEM</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1.5">
        {menuItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                isActive 
                  ? 'bg-brand-emerald/10 border-l-2 border-brand-emerald text-brand-emerald' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-brand-border text-[10px] text-slate-500 font-mono text-center">
        v1.0.0-beta • Agent 3 Edition
      </div>
    </aside>
  );
};
