import { useState, useEffect } from 'react';
import { reviewAPI } from '../api/axios';
import ReviewSummaryCard from '../components/ReviewSummaryCard';
import ReviewTabs from '../components/ReviewTabs';
import toast from 'react-hot-toast';
import { HiOutlineTrash, HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineCode } from 'react-icons/hi';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedReview, setExpandedReview] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const res = await reviewAPI.getAll();
      setReviews(res.data.reviews || []);
    } catch { toast.error('Failed to load reviews'); }
    finally { setLoading(false); }
  };

  const handleExpand = async (id) => {
    if (expandedId === id) { setExpandedId(null); setExpandedReview(null); return; }
    setExpandedId(id);
    setLoadingDetail(true);
    try {
      const res = await reviewAPI.getById(id);
      setExpandedReview(res.data.review);
    } catch { toast.error('Failed to load review details'); }
    finally { setLoadingDetail(false); }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this review?')) return;
    try {
      await reviewAPI.delete(id);
      setReviews(prev => prev.filter(r => r._id !== id));
      if (expandedId === id) { setExpandedId(null); setExpandedReview(null); }
      toast.success('Review deleted');
    } catch { toast.error('Failed to delete review'); }
  };

  const langLabel = { cpp: 'C++', java: 'Java', python: 'Python', javascript: 'JavaScript' };
  const langColor = { cpp: 'badge-purple', java: 'badge-red', python: 'badge-green', javascript: 'badge-amber' };
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

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
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center py-20"><div className="loader"></div></div>
      ) : reviews.length === 0 ? (
        <div className="glass-card p-16 text-center animate-fade-in">
          <HiOutlineCode className="text-5xl text-slate-600 mx-auto mb-4" />
          <p className="text-xl text-slate-400 font-medium">No reviews yet</p>
          <p className="text-slate-500 text-sm mt-2">Your reviewed code will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r, i) => {
            const score = calculateScore(r.aiResponse);
            const isExpanded = expandedId === r._id;

            return (
              <div key={r._id} className="glass-card overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}>
                <div onClick={() => handleExpand(r._id)} className="flex items-center justify-between py-4 pl-5 pr-2 cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-all">
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <HiOutlineCode className="text-purple-400 text-lg" />
                    </div>
                    <div className="flex-1 grid grid-cols-12 gap-2 items-center">
                      {/* Left Side: Language & Date */}
                      <div className="col-span-4 flex flex-col items-start">
                        <span className={`badge ${langColor[r.language]} text-[10px]`}>{langLabel[r.language]}</span>
                        <p className="text-[10px] text-slate-500 mt-1 truncate w-full">{formatDate(r.createdAt)}</p>
                      </div>

                      {/* Middle-Left: Mode */}
                      <div className="col-span-4 flex justify-center lg:justify-start lg:pl-4">
                        <span className="badge badge-purple text-[10px]">{r.mode === 'beginner' ? '🎓 Beginner' : '💼 Advanced'}</span>
                      </div>

                      {/* Middle-Right: Score */}
                      <div className="col-span-4 flex justify-center lg:justify-center lg:pl-4">
                        <span className={`text-sm font-bold ${score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{score}/100</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => handleDelete(r._id, e)} className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><HiOutlineTrash /></button>
                    {isExpanded ? <HiOutlineChevronUp className="text-slate-400" /> : <HiOutlineChevronDown className="text-slate-400" />}
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-[rgba(255,255,255,0.06)] p-5 space-y-5 animate-fade-in">
                    {loadingDetail ? (
                      <div className="flex justify-center py-8"><div className="loader"></div></div>
                    ) : expandedReview ? (
                      <>
                        <div className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)] bg-[#04060e]">
                          <div className="px-4 py-2 bg-[#080b16] border-b border-[rgba(255,255,255,0.06)] text-xs text-slate-500">Submitted Code</div>
                          <pre className="p-4 text-sm text-slate-300 overflow-x-auto" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{expandedReview.code}</pre>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                          <div className="lg:col-span-1"><ReviewSummaryCard review={expandedReview.aiResponse} /></div>
                          <div className="lg:col-span-2"><ReviewTabs review={expandedReview.aiResponse} /></div>
                        </div>
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
