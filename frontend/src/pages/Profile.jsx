import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { reviewAPI } from '../api/axios';
import { User, Mail, Calendar, FileText, Activity, ShieldCheck } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { motion } from 'framer-motion';

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

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in pb-8">
      
      {/* Hero Card */}
      <Card animate>
        <CardContent className="p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar 
              fallback={getInitials(user?.name)} 
              className="h-24 w-24 text-2xl font-bold bg-primary text-primary-foreground border-4 border-background shadow-xl"
            />
            <div className="text-center sm:text-left space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-text-primary">{user?.name || 'Developer'}</h1>
                <ShieldCheck className="h-5 w-5 text-success" title="Verified Account" />
              </div>
              <p className="text-text-secondary">{user?.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 pt-2">
                <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                  <Activity className="h-4 w-4" />
                  <span>Pro Plan Active</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {joinedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <Card animate style={{ transitionDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
            <CardDescription>Your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-surface">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase">Full Name</p>
                <p className="font-medium text-text-primary">{user?.name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-surface">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-warning/10 text-warning">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase">Email Address</p>
                <p className="font-medium text-text-primary">{user?.email || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card animate style={{ transitionDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="text-lg">Activity Statistics</CardTitle>
            <CardDescription>Your usage metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-surface">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-success/10 text-success">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase">Code Reviews</p>
                <p className="font-medium text-text-primary">{loading ? '...' : reviewCount} total analyses</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-surface">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase">Member Since</p>
                <p className="font-medium text-text-primary">{joinedDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Profile;
