import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Columns, 
  LayoutDashboard, 
  Smartphone, 
  Wallet, 
  Hammer,
  Users,
  Package,
  LogOut,
  UserCog
} from 'lucide-react';
import { useStore } from '../store/useStore';

export const Sidebar: React.FC = () => {
  const { logout } = useStore();
  const menuItems = [
    { to: '/orders', label: 'CRM & Orders', icon: <Users className="w-4 h-4" /> },
    { to: '/inventory', label: 'Inventory & BOM', icon: <Package className="w-4 h-4" /> },
    { to: '/', label: 'Kanban Board', icon: <Columns className="w-4 h-4" /> },
    { to: '/dashboard', label: 'Manager Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/tablet', label: 'Worker Tablet', icon: <Smartphone className="w-4 h-4" /> },
    { to: '/finance', label: 'Finance Ledger', icon: <Wallet className="w-4 h-4" /> },
    { to: '/admin/users', label: 'Xodimlar & Maosh', icon: <UserCog className="w-4 h-4" /> }
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
      <div className="p-4 border-t border-brand-border flex flex-col gap-2">
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/30 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Tizimdan chiqish</span>
        </button>
        <div className="text-[10px] text-slate-500 font-mono text-center">
          v1.0.0 • Complete ERP Edition
        </div>
      </div>
    </aside>
  );
};
