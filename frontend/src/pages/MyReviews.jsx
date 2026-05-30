import React, { useState, useEffect } from 'react';
import { reviewAPI } from '../api/axios';
import ReviewTabs from '../components/ReviewTabs';
import toast from 'react-hot-toast';
import { Trash2, ChevronDown, ChevronRight, FolderSearch, Search } from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedReview, setExpandedReview] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const res = await reviewAPI.getAll();
      setReviews(res.data.reviews || []);
    } catch { 
      toast.error('Failed to load reviews'); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleExpand = async (id) => {
    if (expandedId === id) { 
      setExpandedId(null); 
      setExpandedReview(null); 
      return; 
    }
    setExpandedId(id);
    setLoadingDetail(true);
    try {
      const res = await reviewAPI.getById(id);
      setExpandedReview(res.data.review);
    } catch { 
      toast.error('Failed to load review details'); 
    } finally { 
      setLoadingDetail(false); 
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewAPI.delete(id);
      setReviews(prev => prev.filter(r => r._id !== id));
      if (expandedId === id) { 
        setExpandedId(null); 
        setExpandedReview(null); 
      }
      toast.success('Review deleted');
    } catch { 
      toast.error('Failed to delete review'); 
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

  const filteredReviews = reviews.filter(r => 
    r.language.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r._id.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">Review History</h2>
          <p className="text-sm text-text-secondary">Manage and view all your past code analyses.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <Input 
            placeholder="Search reviews..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <FolderSearch className="h-12 w-12 text-border mb-4" />
              <h3 className="text-lg font-medium text-text-primary">No reviews found</h3>
              <p className="text-sm text-text-secondary mt-1">You haven't submitted any code for review yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((r) => {
                  const score = calculateScore(r.aiResponse);
                  const isExpanded = expandedId === r._id;
                  
                  return (
                    <React.Fragment key={r._id}>
                      <TableRow 
                        className="cursor-pointer group"
                        onClick={() => handleExpand(r._id)}
                      >
                        <TableCell className="font-mono text-xs text-text-secondary">
                          {r._id.slice(-6)}
                        </TableCell>
                        <TableCell className="font-medium capitalize">
                          {r.language}
                        </TableCell>
                        <TableCell>
                          <Badge variant={r.mode === 'interview' ? 'secondary' : 'default'} className="capitalize">
                            {r.mode === 'interview' ? 'Advanced' : r.mode}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`font-bold ${getScoreColor(score)}`}>{score}/100</span>
                        </TableCell>
                        <TableCell className="text-text-secondary text-sm">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => handleDelete(r._id, e)}
                              className="text-text-secondary hover:text-error hover:bg-error/10 h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <TableRow className="bg-surface/30 hover:bg-surface/30 border-b-0">
                            <TableCell colSpan={6} className="p-0 border-b-0">
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-6 border-b border-border">
                                  {loadingDetail ? (
                                    <div className="flex justify-center py-8">
                                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                                    </div>
                                  ) : expandedReview ? (
                                    <div className="space-y-6">
                                      <div>
                                        <h4 className="text-sm font-semibold text-text-primary mb-2">Original Code</h4>
                                        <div className="rounded-md border border-border bg-[#1E1E1E] p-4 max-h-64 overflow-y-auto custom-scrollbar">
                                          <pre className="text-xs text-[#D4D4D4] font-mono whitespace-pre">{expandedReview.code}</pre>
                                        </div>
                                      </div>
                                      <div>
                                        <ReviewTabs review={expandedReview.aiResponse} />
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              </motion.div>
                            </TableCell>
                          </TableRow>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyReviews;
