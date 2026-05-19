const StatsCard = ({ icon: Icon, label, value, color = 'purple', delay = 0 }) => {
  const colorMap = {
    purple: {
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
      border: 'hover:border-purple-500/20',
      glow: 'hover:shadow-[0_0_30px_rgba(124,58,237,0.1)]',
    },
    blue: {
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      border: 'hover:border-blue-500/20',
      glow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]',
    },
    green: {
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
      border: 'hover:border-emerald-500/20',
      glow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]',
    },
    red: {
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-400',
      border: 'hover:border-red-500/20',
      glow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]',
    },
    amber: {
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
      border: 'hover:border-amber-500/20',
      glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]',
    },
    cyan: {
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400',
      border: 'hover:border-cyan-500/20',
      glow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]',
    },
  };

  const c = colorMap[color] || colorMap.purple;

  return (
    <div
      className={`glass-card p-5 animate-fade-in-up ${c.border} ${c.glow} transition-all duration-300 cursor-default`}
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${c.iconBg} flex items-center justify-center`}>
          <Icon className={`text-2xl ${c.iconColor}`} />
        </div>
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
