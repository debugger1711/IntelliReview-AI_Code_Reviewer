import React, { useState } from 'react';
import { reviewAPI } from '../api/axios';
import CodeEditor from '../components/CodeEditor';
import ReviewTabs from '../components/ReviewTabs';
import toast from 'react-hot-toast';
import { Sparkles, Code2, Target, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

const NewReview = () => {
  const [language, setLanguage] = useState('javascript');
  const [mode, setMode] = useState('beginner');
  const [code, setCode] = useState('');
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) { 
      toast.error('Please enter some code to review'); 
      return; 
    }
    if (code.length > 10000) { 
      toast.error('Code is too long. Maximum 10,000 characters.'); 
      return; 
    }
    setLoading(true);
    setReview(null);
    try {
      const res = await reviewAPI.create({ language, mode, code });
      setReview(res.data.review);
      toast.success('Review completed!');
      document.getElementById('review-results')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed. Please try again.');
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">New Code Review</h2>
        <p className="text-sm text-text-secondary">Submit your code for an AI-powered analysis.</p>
      </div>

      <Card animate>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Programming Language</label>
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
                  <option value="beginner">Beginner Mode (Educational)</option>
                  <option value="interview">Advanced Mode (Strict)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text-primary">Source Code</label>
              <span className="text-xs text-text-secondary">{code.length} / 10,000 characters</span>
            </div>
            <div className="rounded-md border border-border bg-[#1E1E1E] overflow-hidden shadow-sm">
              <CodeEditor value={code} onChange={setCode} language={language} />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button 
              onClick={handleSubmit} 
              disabled={!code.trim()}
              isLoading={loading}
              size="lg"
              className="gap-2 w-full sm:w-auto"
            >
              <Zap className="h-4 w-4" />
              {loading ? 'Analyzing Code...' : 'Run Analysis'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div id="review-results">
        {review && !loading && (
          <Card animate className="border-primary/20 shadow-lg shadow-primary/5 mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewTabs review={review} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NewReview;
