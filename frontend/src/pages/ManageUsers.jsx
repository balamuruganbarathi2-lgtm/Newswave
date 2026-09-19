import React, { useState, useEffect } from 'react';
import { getAdminUsersApi, updateUserRoleApi, deleteUserApi } from '../services/api';
import { Users, Shield, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminUsersApi();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (id, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      const { data } = await updateUserRoleApi(id, newRole);
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
        );
        setMsg(`Role updated to ${newRole}`);
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user account?')) return;
    try {
      const { data } = await deleteUserApi(id);
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        setMsg('User account deleted');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting user');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Admin Authorization</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage user accounts and grant administrator access roles.</p>
        </div>

        <div className="bg-indigo-50 text-indigo-700 font-mono text-xs font-bold px-3 py-1.5 rounded-xl border border-indigo-200">
          {users.length} Users
        </div>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">User</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Current Role</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">Loading user accounts...</td>
                </tr>
              ) : (
                users.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-200 font-bold flex items-center justify-center text-[11px] text-slate-700">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{item.name}</span>
                    </td>
                    <td className="p-4 text-slate-600">{item.email}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleRoleToggle(item._id, item.role)}
                        disabled={item._id === currentUser?.id}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border transition-colors ${
                          item.role === 'ADMIN'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        } ${item._id === currentUser?.id ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                        title="Click to toggle role"
                      >
                        {item.role}
                      </button>
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      {item._id !== currentUser?.id && (
                        <button
                          onClick={() => handleDeleteUser(item._id)}
                          className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ManageUsers;
