import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import ReviewSummaryCard from '../components/ReviewSummaryCard';
import ReviewTabs from '../components/ReviewTabs';
import { HiOutlineSparkles, HiCode } from 'react-icons/hi';
import { BiTargetLock } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { reviewAPI } from '../api/axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('python');
  const [mode, setMode] = useState('beginner');
  const [code, setCode] = useState(`def two_sum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []`);
  
  const [recentReviews, setRecentReviews] = useState([]);
  const [activeReview, setActiveReview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await reviewAPI.getAll();
      setRecentReviews(res.data.reviews || []);
    } catch (err) {
      console.error("Failed to fetch reviews");
    }
  };

  const handleReview = async () => {
    if (!code.trim()) return toast.error('Please paste some code first');
    
    setLoading(true);
    const toastId = toast.loading('AI is analyzing your code...');
    
    try {
      const res = await reviewAPI.create({ language, mode, code });
      toast.success('Analysis complete!', { id: toastId });
      setActiveReview(res.data.review);
      fetchReviews(); // Refresh history
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to review code', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const getLanguageLabel = (lang) => {
    const labels = { javascript: 'JS', python: 'PY', cpp: 'C++', java: 'JAVA' };
    return labels[lang] || lang.toUpperCase();
  };

  const getLanguageColor = (lang) => {
    const colors = {
      javascript: 'bg-yellow-500/20 text-yellow-400',
      python: 'bg-blue-500/20 text-blue-400',
      cpp: 'bg-purple-500/20 text-purple-400',
      java: 'bg-orange-500/20 text-orange-400',
    };
    return colors[lang] || 'bg-gray-500/20 text-gray-400';
  };

  const calculateScore = (aiResponse) => {
    if (!aiResponse) return 100;
    const totalIssues = 
      (aiResponse.bugs?.length || 0) + 
      (aiResponse.suggestions?.length || 0) + 
      (aiResponse.readability?.length || 0) + 
      (aiResponse.optimization?.length || 0);
    return Math.max(0, 100 - (totalIssues * 5));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
      {/* LEFT COLUMN (Span 2) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* NEW CODE REVIEW CARD */}
        <div className="flat-card p-6 flex flex-col">
          <h2 className="text-lg font-bold text-white mb-6">New Code Review</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Programming Language</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <HiCode className="text-yellow-400 text-lg" />
                </div>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="select-field bg-[#111827] pl-10 h-[42px]"
                >
                  <option value="javascript">JavaScript (Node.js)</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
               </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Review Mode</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <BiTargetLock className="text-purple-500 text-lg" />
                </div>
                <select 
                  value={mode} 
                  onChange={(e) => setMode(e.target.value)}
                  className="select-field bg-[#111827] pl-10 h-[42px]"
                >
                  <option value="interview">Advanced Mode</option>
                  <option value="beginner">Beginner Mode</option>
               </select>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-xs font-medium text-gray-400 mb-2">Paste Your Code</label>
            <CodeEditor value={code} onChange={setCode} language={language} />
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-4 px-1">
            <span>Supports: C++, Java, Python, JavaScript</span>
            <span>{code.split('\n').length} lines</span>
          </div>

          <div className="flex justify-end">
            <button onClick={handleReview} disabled={loading} className="btn-primary gap-2">
              {loading ? <div className="loader !w-4 !h-4 !border-2"></div> : <HiOutlineSparkles className="text-lg" />}
              {loading ? 'Analyzing...' : 'Review Code \u2192'}
            </button>
          </div>
        </div>

        {/* AI REVIEW RESULTS CARD */}
        <div className="flex-1">
          <ReviewTabs review={activeReview} />
        </div>
      </div>

      {/* RIGHT COLUMN (Span 1) */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        
        {/* REVIEW SUMMARY CARD */}
        <div>
          <ReviewSummaryCard review={activeReview} />
        </div>

        {/* RECENT REVIEWS CARD */}
        <div className="flat-card p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Recent Reviews</h2>
            <button 
              onClick={() => navigate('/my-reviews')}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              View All
            </button>
          </div>

          <div className="space-y-0">
            {recentReviews.length === 0 ? (
              <div className="py-8 text-center text-gray-500 text-sm">
                No reviews yet. Submit some code!
              </div>
            ) : (
              recentReviews.slice(0, 5).map((rev) => (
                <div
                  key={rev._id}
                  onClick={() => setActiveReview(rev.aiResponse)}
                  className="flex items-center justify-between py-3 border-b border-[#1f2937] cursor-pointer hover:bg-[#1f2937]/30 transition-colors px-3 -mx-2 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[10px] ${getLanguageColor(rev.language)}`}>
                      {getLanguageLabel(rev.language)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white capitalize">{rev.language} Review</h4>
                      <p className="text-[10px] text-gray-500 capitalize">{rev.mode === 'interview' ? 'Advanced' : rev.mode} Mode</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold block ${calculateScore(rev.aiResponse) >= 80 ? 'text-green-500' : calculateScore(rev.aiResponse) >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                      {calculateScore(rev.aiResponse)}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
