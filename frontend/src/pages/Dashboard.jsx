import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import ReviewTabs from '../components/ReviewTabs';
import StatsCard from '../components/StatsCard';
import { Sparkles, Code2, Target, FileText, Bug, Lightbulb, Activity, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { reviewAPI } from '../api/axios';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('python');
  const [mode, setMode] = useState('beginner');
  const [code, setCode] = useState(`def two_sum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []`);
  
  const [recentReviews, setRecentReviews] = useState([]);
  const [activeReview, setActiveReview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Dashboard stats state
  const [stats, setStats] = useState({
    total: 0,
    bugsFound: 0,
    suggestions: 0,
    avgScore: 0,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await reviewAPI.getAll();
      const reviews = res.data.reviews || [];
      setRecentReviews(reviews);
      
      // Calculate stats
      let totalBugs = 0;
      let totalSuggestions = 0;
      let totalScore = 0;
      
      reviews.forEach(r => {
        if (r.aiResponse) {
          totalBugs += r.aiResponse.bugs?.length || 0;
          totalSuggestions += r.aiResponse.suggestions?.length || 0;
          totalScore += calculateScore(r.aiResponse);
        }
      });
      
      setStats({
        total: reviews.length,
        bugsFound: totalBugs,
        suggestions: totalSuggestions,
        avgScore: reviews.length > 0 ? Math.round(totalScore / reviews.length) : 0
      });
      
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
      fetchReviews();
      
      // Scroll to results
      document.getElementById('review-results')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to review code', { id: toastId });
    } finally {
      setLoading(false);
    }
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

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          icon={FileText} 
          label="Total Reviews" 
          value={stats.total} 
          trend={12} 
          trendLabel="vs last month" 
          delay={100} 
        />
        <StatsCard 
          icon={Bug} 
          label="Bugs Found" 
          value={stats.bugsFound} 
          trend={-5} 
          trendLabel="vs last month" 
          delay={200} 
        />
        <StatsCard 
          icon={Lightbulb} 
          label="Suggestions" 
          value={stats.suggestions} 
          trend={8} 
          trendLabel="vs last month" 
          delay={300} 
        />
        <StatsCard 
          icon={Activity} 
          label="Average Score" 
          value={`${stats.avgScore}/100`} 
          trend={stats.avgScore > 0 ? 2 : 0} 
          trendLabel="vs last month" 
          delay={400} 
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Workspace (Span 2) */}
        <div className="lg:col-span-2 space-y-8">
          
          <Card animate>
            <CardHeader>
              <CardTitle>Review Workspace</CardTitle>
              <CardDescription>Paste your code below to get instant AI feedback</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Language</label>
                  <div className="relative">
                    <Code2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="flex h-10 w-full appearance-none rounded-md border border-border bg-background pl-10 pr-4 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Review Mode</label>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                      className="flex h-10 w-full appearance-none rounded-md border border-border bg-background pl-10 pr-4 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    >
                      <option value="interview">Advanced / Strict</option>
                      <option value="beginner">Beginner / Educational</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-text-primary">Source Code</label>
                  <span className="text-xs text-text-secondary">{code.split('\n').length} lines</span>
                </div>
                <div className="rounded-md border border-border bg-[#1E1E1E] overflow-hidden">
                  <CodeEditor value={code} onChange={setCode} language={language} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleReview} 
                  isLoading={loading} 
                  size="lg" 
                  className="gap-2 w-full sm:w-auto"
                >
                  <Sparkles className="h-4 w-4" />
                  {loading ? 'Analyzing Code...' : 'Analyze Code'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card animate>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>Your latest code analyses</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => navigate('/my-reviews')} title="View All">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-4">
                {recentReviews.length === 0 ? (
                  <div className="text-center text-sm text-text-secondary py-8">
                    No reviews yet. Submit your first code snippet!
                  </div>
                ) : (
                  recentReviews.slice(0, 5).map((rev) => {
                    const score = calculateScore(rev.aiResponse);
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={rev._id}
                        onClick={() => {
                          setActiveReview(rev.aiResponse);
                          document.getElementById('review-results')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="group flex items-center justify-between rounded-lg border border-border bg-surface p-3 transition-colors hover:bg-surface/80 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-background border border-border text-xs font-bold uppercase text-primary group-hover:border-primary/30 transition-colors">
                            {rev.language.slice(0, 2)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold capitalize text-text-primary">
                              {rev.language} Review
                            </span>
                            <span className="text-xs text-text-secondary capitalize">
                              {rev.mode === 'interview' ? 'Advanced' : rev.mode}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                            {score}
                          </span>
                          <span className="text-[10px] text-text-secondary">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar (Span 1) */}
        <div className="space-y-8 lg:col-span-1">
          {/* Review Results */}
          <div id="review-results">
            {activeReview && (
              <Card animate className="border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ReviewTabs review={activeReview} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
