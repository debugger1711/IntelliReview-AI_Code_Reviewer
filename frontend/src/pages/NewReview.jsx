import { useState } from 'react';
import { reviewAPI } from '../api/axios';
import CodeEditor from '../components/CodeEditor';
import ReviewSummaryCard from '../components/ReviewSummaryCard';
import ReviewTabs from '../components/ReviewTabs';
import toast from 'react-hot-toast';
import { HiOutlineLightningBolt, HiOutlinePlay } from 'react-icons/hi';

const languages = [
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
];

const modes = [
  { value: 'beginner', label: '🎓 Beginner Mode', description: 'Simple explanations, beginner-friendly feedback' },
  { value: 'interview', label: '💼 Advanced Mode', description: 'DSA focus, edge cases, optimization' },
];

const NewReview = () => {
  const [language, setLanguage] = useState('javascript');
  const [mode, setMode] = useState('beginner');
  const [code, setCode] = useState('');
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) { toast.error('Please enter some code to review'); return; }
    if (code.length > 10000) { toast.error('Code is too long. Maximum 10,000 characters.'); return; }
    setLoading(true);
    setReview(null);
    try {
      const res = await reviewAPI.create({ language, mode, code });
      setReview(res.data.review);
      toast.success('Review completed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Programming Language</label>
          <select id="language-select" value={language} onChange={(e) => setLanguage(e.target.value)} className="select-field">
            {languages.map((l) => (<option key={l.value} value={l.value}>{l.label}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Review Mode</label>
          <select id="mode-select" value={mode} onChange={(e) => setMode(e.target.value)} className="select-field">
            {modes.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
          </select>
          <p className="text-xs text-slate-500 mt-1.5">{modes.find(m => m.value === mode)?.description}</p>
        </div>
      </div>

      <div className="animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
        <label className="block text-sm font-medium text-slate-300 mb-2">Your Code</label>
        <CodeEditor value={code} onChange={setCode} language={language} />
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-slate-500">{code.length} / 10,000 characters</p>
          <button id="submit-review" onClick={handleSubmit} disabled={loading || !code.trim()} className="btn-gradient flex items-center gap-2">
            {loading ? (<><div className="loader !w-4 !h-4 !border-2"></div> Analyzing...</>) : (<><HiOutlinePlay className="text-lg" /> Run Review</>)}
          </button>
        </div>
      </div>

      {loading && (
        <div className="glass-card p-12 text-center animate-fade-in">
          <div className="loader mx-auto mb-4"></div>
          <p className="text-slate-300 font-medium">AI is analyzing your code...</p>
          <p className="text-slate-500 text-sm mt-1">This may take a few seconds</p>
        </div>
      )}

      {review && !loading && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 animate-fade-in-up">
            <HiOutlineLightningBolt className="text-purple-400 text-xl" />
            <h2 className="text-xl font-bold text-white">Review Results</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1"><ReviewSummaryCard review={review} /></div>
            <div className="lg:col-span-2"><ReviewTabs review={review} /></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewReview;
