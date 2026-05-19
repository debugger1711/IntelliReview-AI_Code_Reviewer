import {
  HiOutlineExclamationCircle,
  HiOutlineLightBulb,
  HiOutlineBookOpen,
  HiOutlineChartBar,
  HiOutlineShare
} from 'react-icons/hi';

const ReviewSummaryCard = ({ review }) => {
  const bugs = review?.bugs || [];
  const suggestions = review?.suggestions || [];
  const readability = review?.readability || [];
  const optimization = review?.optimization || [];
  
  const totalIssues = bugs.length + suggestions.length + readability.length + optimization.length;
  let score = review ? Math.max(0, 100 - (totalIssues * 5)) : 100;
  
  const percentage = score;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getScoreColor = () => {
    if (!review) return '#374151'; // Gray when empty
    if (percentage >= 80) return '#10b981'; // Green
    if (percentage >= 50) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getScoreText = () => {
    if (!review) return { title: 'Waiting for Code', desc: 'Submit your code on the left to get a review score.' };
    if (percentage >= 80) return { title: 'Excellent! 🎉', desc: 'Your code is clean and highly optimized.' };
    if (percentage >= 60) return { title: 'Good Work! 🎉', desc: 'Your code is good but can be optimized further.' };
    return { title: 'Needs Work 🛠️', desc: 'There are several bugs and optimizations needed.' };
  };

  const scoreText = getScoreText();

  const stats = [
    { label: 'Bugs', count: bugs.length, icon: HiOutlineExclamationCircle, colorClass: 'text-red-500', badgeClass: 'bg-red-500/10 text-red-500' },
    { label: 'Suggestions', count: suggestions.length, icon: HiOutlineLightBulb, colorClass: 'text-yellow-500', badgeClass: 'bg-yellow-500/10 text-yellow-500' },
    { label: 'Readability', count: readability.length, icon: HiOutlineBookOpen, colorClass: 'text-blue-500', badgeClass: 'bg-blue-500/10 text-blue-500' },
    { label: 'Optimization', count: optimization.length, icon: HiOutlineChartBar, colorClass: 'text-green-500', badgeClass: 'bg-green-500/10 text-green-500' },
  ];

  const formatComplexity = (text) => {
    if (!text || text === 'N/A') return 'N/A';
    // Match common dash characters used by AI to separate the description
    return text.split(/[-—–]/)[0].trim();
  };

  return (
    <div className="flat-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Review Summary</h2>
        <button className="text-xs bg-[#1f2937] hover:bg-[#374151] text-gray-300 px-3 py-1.5 rounded-lg transition-colors">
          View Details
        </button>
      </div>

      {/* Score Section */}
      <div className="flex items-center gap-5 mb-8">
        <div className="relative flex-shrink-0">
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r={radius} fill="none" stroke="#1f2937" strokeWidth="6" />
            <circle
              cx="45" cy="45" r={radius} fill="none"
              stroke={getScoreColor()} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={offset}
              className="progress-ring-circle"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{score}</span>
            <span className="text-[10px] text-gray-500 mt-[-2px]">/100</span>
          </div>
        </div>
        <div>
          <h3 className="text-white font-bold mb-1">{scoreText.title}</h3>
          <p className="text-xs text-gray-400 leading-relaxed">{scoreText.desc}</p>
        </div>
      </div>

      {/* Issue Breakdown List */}
      <div className="space-y-4 flex-1 px-1">
        {stats.map((s, idx) => (
          <div key={idx} className="flex items-center justify-between border-b border-[#1f2937] pb-3 last:border-0 last:pb-0 px-1">
            <div className="flex items-center gap-3">
              <s.icon className={`text-lg ${s.colorClass}`} />
              <span className="text-sm text-gray-300">{s.label}</span>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${s.badgeClass}`}>
              {s.count}
            </span>
          </div>
        ))}
      </div>

      {/* Complexity Footer */}
      <div className="mt-6 pt-4 border-t border-[#1f2937] px-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HiOutlineShare className="text-purple-500 text-lg flex-shrink-0" />
          <span className="text-sm text-gray-300">Complexity</span>
        </div>
        <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20">
          {!review ? "N/A | N/A" : `${formatComplexity(review.timeComplexity)} | ${formatComplexity(review.spaceComplexity)}`}
        </span>
      </div>
    </div>
  );
};

export default ReviewSummaryCard;
