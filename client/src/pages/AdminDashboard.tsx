import { useEffect, useState } from 'react';
import { adminAPI } from '../services/api.services';

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
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold">Admin Control Center</h2>
        <p className="text-gray-400 text-sm">System statistics, user logs and moderation</p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card glass p-6 space-y-2 border-white/5">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Gamers</div>
          <div className="text-3xl font-extrabold text-purple-primary">
            {loading ? '...' : analytics?.totalUsers || 0}
          </div>
        </div>
        <div className="card glass p-6 space-y-2 border-white/5">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Posts Published</div>
          <div className="text-3xl font-extrabold text-cyan-accent">
            {loading ? '...' : analytics?.totalPosts || 0}
          </div>
        </div>
        <div className="card glass p-6 space-y-2 border-white/5">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Clans Formed</div>
          <div className="text-3xl font-extrabold text-magenta-accent">
            {loading ? '...' : analytics?.totalClans || 0}
          </div>
        </div>
        <div className="card glass p-6 space-y-2 border-white/5">
          <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Championships</div>
          <div className="text-3xl font-extrabold text-yellow-400">
            {loading ? '...' : analytics?.totalTournaments || 0}
          </div>
        </div>
      </div>

      {/* Moderation Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Moderation */}
        <div className="lg:col-span-2 card glass p-6 space-y-4 border-white/5">
          <h3 className="text-lg font-bold text-gray-200">Registered Gamer Accounts</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs text-gray-400 uppercase">
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-white/5 text-gray-300">
                  <td className="py-3 px-4">Shroud</td>
                  <td className="py-3 px-4">shroud@gmail.com</td>
                  <td className="py-3 px-4"><span className="inline-block px-2 py-0.5 rounded bg-purple-primary/25 border border-purple-primary/30 text-purple-primary text-xs">MODERATOR</span></td>
                  <td className="py-3 px-4"><button className="text-red-400 hover:text-red-300 text-xs font-bold">Ban</button></td>
                </tr>
                <tr className="border-b border-white/5 text-gray-300">
                  <td className="py-3 px-4">Ninja</td>
                  <td className="py-3 px-4">ninja@gmail.com</td>
                  <td className="py-3 px-4"><span className="inline-block px-2 py-0.5 rounded bg-cyan-accent/25 border border-cyan-accent/30 text-cyan-accent text-xs">USER</span></td>
                  <td className="py-3 px-4"><button className="text-red-400 hover:text-red-300 text-xs font-bold">Ban</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Content reports */}
        <div className="card glass p-6 space-y-4 border-white/5">
          <h3 className="text-lg font-bold text-gray-200">Pending Reports</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-white/5 border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-magenta-accent">Reason: Toxic Chat</span>
                <span className="text-gray-400">10m ago</span>
              </div>
              <p className="text-gray-300">User Ninja reported for foul language in tournament chat lobby.</p>
              <div className="flex gap-2 justify-end pt-1">
                <button className="text-cyan-accent font-bold">Approve</button>
                <button className="text-red-400 font-bold">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
