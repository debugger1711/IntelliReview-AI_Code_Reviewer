import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';
import { Badge } from './ui/Badge';
import { AlertCircle, Lightbulb, Type, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const ReviewTabs = ({ review }) => {
  if (!review) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
        <Activity className="mb-4 h-12 w-12 text-text-secondary" />
        <p className="text-sm text-text-secondary max-w-[200px]">
          Submit some code above to see your AI review results here.
        </p>
      </div>
    );
  }

  const IssueList = ({ items, icon: Icon, colorClass }) => {
    if (!items || items.length === 0) {
      return (
        <div className="py-8 text-center text-sm text-text-secondary">
          No issues found in this category. Great job!
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map((item, i) => {
          const title = typeof item === 'string' ? "Issue Detected" : (item.title || "Observation");
          const desc = typeof item === 'string' ? item : item.desc;
          const severity = typeof item === 'string' ? "Medium" : (item.severity || "Medium");

          const getSeverityVariant = (sev) => {
            if (sev === 'High') return 'error';
            if (sev === 'Medium') return 'warning';
            return 'success';
          };

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 rounded-lg border border-border bg-surface p-4"
            >
              <div className={`mt-0.5 flex shrink-0 items-start ${colorClass}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
                  <Badge variant={getSeverityVariant(severity)} className="shrink-0">{severity}</Badge>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
                
                {/* Simulated code snippet accordion could go here for real SaaS feel */}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <Tabs defaultValue="bugs" className="w-full">
      <div className="overflow-x-auto pb-2 custom-scrollbar">
        <TabsList>
          <TabsTrigger value="bugs" className="gap-2">
            <AlertCircle className="h-4 w-4 text-error" /> Bugs
            {review.bugs?.length > 0 && <span className="ml-1 rounded-full bg-error/10 px-1.5 py-0.5 text-[10px] font-bold text-error">{review.bugs.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="gap-2">
            <Lightbulb className="h-4 w-4 text-warning" /> Suggestions
            {review.suggestions?.length > 0 && <span className="ml-1 rounded-full bg-warning/10 px-1.5 py-0.5 text-[10px] font-bold text-warning">{review.suggestions.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="readability" className="gap-2">
            <Type className="h-4 w-4 text-primary" /> Readability
          </TabsTrigger>
          <TabsTrigger value="optimization" className="gap-2">
            <Zap className="h-4 w-4 text-success" /> Optimization
          </TabsTrigger>
          <TabsTrigger value="complexity" className="gap-2">
            <Activity className="h-4 w-4 text-text-secondary" /> Complexity
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="mt-6">
        <TabsContent value="bugs">
          <IssueList items={review.bugs} icon={AlertCircle} colorClass="text-error" />
        </TabsContent>
        <TabsContent value="suggestions">
          <IssueList items={review.suggestions} icon={Lightbulb} colorClass="text-warning" />
        </TabsContent>
        <TabsContent value="readability">
          <IssueList items={review.readability} icon={Type} colorClass="text-primary" />
        </TabsContent>
        <TabsContent value="optimization">
          <IssueList items={review.optimization} icon={Zap} colorClass="text-success" />
        </TabsContent>
        <TabsContent value="complexity">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-surface p-4">
              <h4 className="text-sm font-semibold text-text-primary mb-2">Time Complexity</h4>
              <div className="rounded border border-border bg-background p-3 font-mono text-sm text-text-secondary">
                {review.timeComplexity || 'O(N)'}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <h4 className="text-sm font-semibold text-text-primary mb-2">Space Complexity</h4>
              <div className="rounded border border-border bg-background p-3 font-mono text-sm text-text-secondary">
                {review.spaceComplexity || 'O(1)'}
              </div>
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ReviewTabs;
