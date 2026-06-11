import { useEffect, useState } from 'react';
import { adminAPI } from '../services/api.services';
import { FiUsers, FiFileText, FiShield, FiTrophy, FiAlertTriangle, FiCheck, FiX } from 'react-icons/fi';

interface Analytics {
  totalUsers: number;
  totalPosts: number;
  totalClans: number;
  totalTournaments: number;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await adminAPI.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load admin analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">System statistics, user management, and moderation</p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-primary to-purple-dark flex items-center justify-center">
              <FiUsers size={24} className="text-white" />
            </div>
            <div>
              <div className="text-gray-400 text-sm font-semibold">Total Gamers</div>
              <div className="text-3xl font-bold text-white">
                {loading ? '...' : analytics?.totalUsers || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-accent to-blue-500 flex items-center justify-center">
              <FiFileText size={24} className="text-white" />
            </div>
            <div>
              <div className="text-gray-400 text-sm font-semibold">Posts Published</div>
              <div className="text-3xl font-bold text-white">
                {loading ? '...' : analytics?.totalPosts || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-magenta-accent to-purple-primary flex items-center justify-center">
              <FiShield size={24} className="text-white" />
            </div>
            <div>
              <div className="text-gray-400 text-sm font-semibold">Clans Formed</div>
              <div className="text-3xl font-bold text-white">
                {loading ? '...' : analytics?.totalClans || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <FiTrophy size={24} className="text-white" />
            </div>
            <div>
              <div className="text-gray-400 text-sm font-semibold">Championships</div>
              <div className="text-3xl font-bold text-white">
                {loading ? '...' : analytics?.totalTournaments || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Moderation Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Moderation */}
        <div className="lg:col-span-2 card p-6 space-y-6">
          <div className="flex items-center gap-2">
            <FiUsers size={20} className="text-purple-primary" />
            <h3 className="text-xl font-bold">Registered Gamer Accounts</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-white/5 hover:bg-white/5 transition-all">
                  <td className="py-4 px-4 font-semibold">Shroud</td>
                  <td className="py-4 px-4 text-gray-400">shroud@gmail.com</td>
                  <td className="py-4 px-4">
                    <span className="badge badge-purple">MODERATOR</span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-red-500 hover:text-red-400 font-semibold text-sm">Ban</button>
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-all">
                  <td className="py-4 px-4 font-semibold">Ninja</td>
                  <td className="py-4 px-4 text-gray-400">ninja@gmail.com</td>
                  <td className="py-4 px-4">
                    <span className="badge badge-cyan">USER</span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-red-500 hover:text-red-400 font-semibold text-sm">Ban</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Content reports */}
        <div className="card p-6 space-y-6">
          <div className="flex items-center gap-2">
            <FiAlertTriangle size={20} className="text-yellow-500" />
            <h3 className="text-xl font-bold">Pending Reports</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
              <div className="flex justify-between items-start">
                <span className="badge badge-magenta">Toxic Chat</span>
                <span className="text-xs text-gray-500">10m ago</span>
              </div>
              <p className="text-sm text-gray-300">User Ninja reported for foul language in tournament chat lobby.</p>
              <div className="flex gap-2 pt-2">
                <button className="btn-secondary py-2 px-4 text-xs flex items-center gap-1">
                  <FiCheck size={14} />
                  Approve
                </button>
                <button className="text-red-500 hover:text-red-400 font-semibold text-xs flex items-center gap-1">
                  <FiX size={14} />
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
