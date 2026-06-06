import React, { useState, useEffect } from 'react';
import { adminService as adminApi } from '../../services/admin/admin.service';
import type { components } from '../../api/schema';
import { Users, DollarSign, PlusCircle, Pencil, Trash2, Loader2, Calendar } from 'lucide-react';

type AdminCreate = components['schemas']['AdminCreate'];
type UserSalary = components['schemas']['UserSalary'];
type Role = components['schemas']['Role'];

export const UsersAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'salaries'>('users');
  const [isLoading, setIsLoading] = useState(true);

  // Data states
  const [users, setUsers] = useState<AdminCreate[]>([]);
  const [salaries, setSalaries] = useState<UserSalary[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);

  // Form states
  const [selectedUser, setSelectedUser] = useState<AdminCreate | null>(null);
  const [userForm, setUserForm] = useState({ first_name: '', last_name: '', phone: '', password: '', role_id: '' });

  const [selectedSalary, setSelectedSalary] = useState<UserSalary | null>(null);
  const [salaryForm, setSalaryForm] = useState({ user_id: '', amount: '', month: '' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'users') {
        const [usersRes, rolesRes] = await Promise.all([
          adminApi.getUsers(),
          adminApi.getRoles()
        ]);
        setUsers(usersRes.data || []);
        setRoles(rolesRes.data || []);
      } else {
        const [salariesRes, usersRes] = await Promise.all([
          adminApi.getUserSalaries(),
          adminApi.getUsers()
        ]);
        setSalaries(salariesRes.data || []);
        setUsers(usersRes.data || []);
      }
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.first_name || !userForm.last_name || !userForm.phone || !userForm.role_id) return;
    try {
      const data: any = {
        first_name: userForm.first_name,
        last_name: userForm.last_name,
        phone: userForm.phone,
        role_id: Number(userForm.role_id),
      };
      if (userForm.password) {
        data.password = userForm.password;
      }
      
      if (selectedUser) {
        await adminApi.updateUser(selectedUser.id, data);
      } else {
        await adminApi.createUser(data);
      }
      setIsUserModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error saving user", err);
      alert("Xatolik yuz berdi");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Haqiqatan ham ushbu xodimni o'chirmoqchimisiz?")) return;
    try {
      await adminApi.deleteUser(id);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Xatolik");
    }
  };

  const handleSalarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salaryForm.user_id || !salaryForm.amount || !salaryForm.month) return;
    try {
      const data: any = {
        user_id: Number(salaryForm.user_id),
        amount: salaryForm.amount,
        month: salaryForm.month,
      };

      if (selectedSalary) {
        await adminApi.updateUserSalary(selectedSalary.id, data);
      } else {
        await adminApi.createUserSalary(data);
      }
      setIsSalaryModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error saving salary", err);
      alert("Xatolik");
    }
  };

  const handleDeleteSalary = async (id: number) => {
    if (!confirm("Oylikni o'chirmoqchimisiz?")) return;
    try {
      await adminApi.deleteUserSalary(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col bg-brand-dark overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-emerald to-teal-400">
          Xodimlar va Maoshlar
        </h1>
        <div className="flex bg-brand-surface p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${
              activeTab === 'users' ? 'bg-brand-emerald text-brand-dark shadow-md shadow-brand-emerald/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Xodimlar
          </button>
          <button
            onClick={() => setActiveTab('salaries')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${
              activeTab === 'salaries' ? 'bg-brand-emerald text-brand-dark shadow-md shadow-brand-emerald/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Maoshlar
          </button>
        </div>
      </div>

      <div className="bg-brand-surface/65 backdrop-blur-md border border-brand-border/60 rounded-2xl flex-1 p-6 overflow-hidden flex flex-col shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-200">
            {activeTab === 'users' ? 'Xodimlar Ro\'yxati' : 'Oylik Maoshlar Ro\'yxati'}
          </h2>
          <button
            onClick={() => {
              if (activeTab === 'users') {
                setSelectedUser(null);
                setUserForm({ first_name: '', last_name: '', phone: '', password: '', role_id: '' });
                setIsUserModalOpen(true);
              } else {
                setSelectedSalary(null);
                setSalaryForm({ user_id: '', amount: '', month: new Date().toISOString().slice(0, 10) });
                setIsSalaryModalOpen(true);
              }
            }}
            className="flex items-center gap-2 bg-brand-emerald hover:bg-emerald-400 text-brand-dark font-extrabold px-4 py-2 rounded-xl text-xs uppercase tracking-wide transition-transform hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            Qo'shish
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <Loader2 className="w-10 h-10 text-brand-emerald animate-spin" />
          </div>
        ) : activeTab === 'users' ? (
          <div className="overflow-auto border border-brand-border/40 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-brand-dark/50 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">Ism Familiya</th>
                  <th className="p-4 font-semibold">Telefon</th>
                  <th className="p-4 font-semibold">Rol (Lavozim)</th>
                  <th className="p-4 font-semibold text-right">Harakatlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-brand-dark/30 transition-colors">
                    <td className="p-4 text-slate-200 font-medium">{u.first_name} {u.last_name}</td>
                    <td className="p-4 text-slate-400">{u.phone}</td>
                    <td className="p-4 text-brand-emerald font-semibold">{u.role?.name || '-'}</td>
                    <td className="p-4 flex justify-end gap-2">
                      <button onClick={() => { setSelectedUser(u); setUserForm({ first_name: u.first_name, last_name: u.last_name, phone: u.phone, password: '', role_id: String(u.role_id) }); setIsUserModalOpen(true); }} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"><Pencil className="w-4 h-4"/></button>
                      <button onClick={() => handleDeleteUser(u.id)} className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-auto border border-brand-border/40 rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-brand-dark/50 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">Xodim</th>
                  <th className="p-4 font-semibold">Oy/Sana</th>
                  <th className="p-4 font-semibold">Miqdor (UZS)</th>
                  <th className="p-4 font-semibold text-right">Harakatlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40">
                {salaries.map(s => (
                  <tr key={s.id} className="hover:bg-brand-dark/30 transition-colors">
                    <td className="p-4 text-slate-200 font-medium">
                      {s.user ? `${s.user.first_name} ${s.user.last_name}` : s.user_id}
                    </td>
                    <td className="p-4 text-slate-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-emerald"/>
                      {s.month}
                    </td>
                    <td className="p-4 text-brand-emerald font-bold">{Number(s.amount).toLocaleString()}</td>
                    <td className="p-4 flex justify-end gap-2">
                      <button onClick={() => { setSelectedSalary(s); setSalaryForm({ user_id: String(s.user_id), amount: s.amount, month: s.month || '' }); setIsSalaryModalOpen(true); }} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"><Pencil className="w-4 h-4"/></button>
                      <button onClick={() => handleDeleteSalary(s.id)} className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-brand-surface border border-brand-border p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-slate-200 mb-4">{selectedUser ? 'Xodimni tahrirlash' : 'Yangi xodim qo\'shish'}</h2>
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Ism</label>
                  <input required value={userForm.first_name} onChange={e => setUserForm({...userForm, first_name: e.target.value})} className="w-full bg-brand-dark border border-brand-border text-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-emerald outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Familiya</label>
                  <input required value={userForm.last_name} onChange={e => setUserForm({...userForm, last_name: e.target.value})} className="w-full bg-brand-dark border border-brand-border text-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-emerald outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Telefon</label>
                <input required value={userForm.phone} onChange={e => setUserForm({...userForm, phone: e.target.value})} className="w-full bg-brand-dark border border-brand-border text-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-emerald outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Rol</label>
                <select required value={userForm.role_id} onChange={e => setUserForm({...userForm, role_id: e.target.value})} className="w-full bg-brand-dark border border-brand-border text-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-emerald outline-none">
                  <option value="">Tanlang...</option>
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Parol {selectedUser && '(o\'zgartirish uchun)'}</label>
                <input type="password" required={!selectedUser} value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="w-full bg-brand-dark border border-brand-border text-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-emerald outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-slate-400 hover:text-slate-200">Bekor qilish</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm font-bold bg-brand-emerald text-brand-dark hover:bg-emerald-400 shadow-lg">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Salary Modal */}
      {isSalaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-brand-surface border border-brand-border p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-slate-200 mb-4">{selectedSalary ? 'Maoshni tahrirlash' : 'Maosh berish'}</h2>
            <form onSubmit={handleSalarySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Xodim</label>
                <select required value={salaryForm.user_id} onChange={e => setSalaryForm({...salaryForm, user_id: e.target.value})} className="w-full bg-brand-dark border border-brand-border text-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-emerald outline-none">
                  <option value="">Tanlang...</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.first_name} {u.last_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Miqdor (UZS)</label>
                <input type="number" required value={salaryForm.amount} onChange={e => setSalaryForm({...salaryForm, amount: e.target.value})} className="w-full bg-brand-dark border border-brand-border text-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-emerald outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Oy (Sana)</label>
                <input type="date" required value={salaryForm.month} onChange={e => setSalaryForm({...salaryForm, month: e.target.value})} className="w-full bg-brand-dark border border-brand-border text-slate-200 rounded-lg px-3 py-2 text-sm focus:border-brand-emerald outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsSalaryModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-slate-400 hover:text-slate-200">Bekor qilish</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm font-bold bg-brand-emerald text-brand-dark hover:bg-emerald-400 shadow-lg">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
