import { useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const tabs = [
  { id: 'bugs', label: 'Bugs', colorClass: 'text-red-500', borderClass: 'border-red-500', badgeClass: 'bg-red-500/10 text-red-500 border-red-500/20' },
  { id: 'suggestions', label: 'Suggestions', colorClass: 'text-yellow-500', borderClass: 'border-yellow-500', badgeClass: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  { id: 'readability', label: 'Readability', colorClass: 'text-blue-500', borderClass: 'border-blue-500', badgeClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { id: 'optimization', label: 'Optimization', colorClass: 'text-green-500', borderClass: 'border-green-500', badgeClass: 'bg-green-500/10 text-green-500 border-green-500/20' },
  { id: 'complexity', label: 'Complexity', colorClass: 'text-purple-500', borderClass: 'border-purple-500', badgeClass: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
];

const ReviewTabs = ({ review }) => {
  const [activeTab, setActiveTab] = useState('bugs');
  const getSeverityBadge = (severity) => {
    switch(severity) {
      case 'High': return 'severity-high';
      case 'Medium': return 'severity-medium';
      case 'Low': return 'severity-low';
      default: return 'severity-medium';
    }
  };

  const renderContent = () => {
    const activeData = tabs.find(t => t.id === activeTab);
    
    if (!review) {
      return (
        <div className="py-12 text-center text-gray-500 text-sm">
          Submit some code above to see your AI review results.
        </div>
      );
    }

    const items = review[activeTab] || [];

    if (activeTab === 'complexity') {
      return (
        <div className="mt-4 flex flex-col gap-4">
          <div className="issue-card flex flex-col items-start gap-2">
            <h4 className="text-sm font-bold text-white">Time Complexity</h4>
            <div className="text-sm font-mono text-gray-400 bg-black/20 p-3 rounded-lg border border-[#1f2937] w-full break-words leading-relaxed">
              {review.timeComplexity || 'N/A'}
            </div>
          </div>
          <div className="issue-card flex flex-col items-start gap-2">
            <h4 className="text-sm font-bold text-white">Space Complexity</h4>
            <div className="text-sm font-mono text-gray-400 bg-black/20 p-3 rounded-lg border border-[#1f2937] w-full break-words leading-relaxed">
              {review.spaceComplexity || 'N/A'}
            </div>
          </div>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="py-12 text-center text-gray-500 text-sm">
          No issues found in this category.
        </div>
      );
    }

    return (
      <div className="mt-4 flex flex-col">
        {items.map((item, i) => {
          // If real data, it's just a string, so we mock a title and severity
          const title = typeof item === 'string' ? "Issue Detected" : item.title;
          const desc = typeof item === 'string' ? item : item.desc;
          const severity = typeof item === 'string' ? "Medium" : item.severity;

          return (
            <div key={i} className="issue-card flex items-start gap-4">
              <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#1f2937]`}>
                <HiOutlineExclamationCircle className={activeData.colorClass} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
              </div>
              <div className={`badge-severity ${getSeverityBadge(severity)}`}>
                {severity}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flat-card p-6 h-full flex flex-col">
      <h2 className="text-lg font-bold text-white mb-6">AI Review Results</h2>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-[#1f2937]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                isActive 
                  ? `${tab.colorClass} ${tab.borderClass}` 
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {renderContent()}
      </div>
    </div>
  );
};

export default ReviewTabs;
