import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { reviewAPI } from '../api/axios';
import { HiOutlineUser, HiOutlineMail, HiOutlineCalendar, HiOutlineCollection } from 'react-icons/hi';

const Profile = () => {
  const { user } = useAuth();
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await reviewAPI.getAll();
        setReviewCount(res.data.reviews?.length || 0);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    fetchCount();
  }, []);

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'N/A';

  const stats = [
    { icon: HiOutlineUser, label: 'Username', value: user?.name || 'N/A', color: 'purple' },
    { icon: HiOutlineMail, label: 'Email', value: user?.email || 'N/A', color: 'blue' },
    { icon: HiOutlineCalendar, label: 'Joined', value: joinedDate, color: 'cyan' },
    { icon: HiOutlineCollection, label: 'Total Reviews', value: loading ? '...' : reviewCount, color: 'green' },
  ];

  const colorMap = {
    purple: { iconBg: 'bg-purple-500/10', iconColor: 'text-purple-400' },
    blue: { iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
    cyan: { iconBg: 'bg-cyan-500/10', iconColor: 'text-cyan-400' },
    green: { iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' },
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto w-full pt-4">
      <div className="glass-card p-8 flex flex-col items-center justify-center text-center animate-fade-in-up" style={{ opacity: 0 }}>
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20 text-4xl font-bold text-white">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <h2 className="text-2xl font-bold text-white mt-4">{user?.name || 'User'}</h2>
        <p className="text-slate-400 text-sm mt-1">{user?.email || ''}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((s, i) => {
          const c = colorMap[s.color];
          return (
            <div key={s.label} className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: `${(i+1)*80}ms`, opacity: 0 }}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${c.iconBg} flex items-center justify-center`}>
                  <s.icon className={`text-2xl ${c.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{s.label}</p>
                  <p className="text-white font-semibold mt-0.5 truncate">{s.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
