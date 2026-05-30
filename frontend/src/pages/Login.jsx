import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Code2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { motion } from 'framer-motion';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Side: Branding & Features (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-surface border-r border-border p-12 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Code2 className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-text-primary">IntelliReview</span>
        </div>

        <div className="relative z-10 max-w-lg mt-auto mb-auto">
          <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-6">
            Elevate your code quality with AI.
          </h1>
          <p className="text-lg text-text-secondary mb-10 leading-relaxed">
            Catch bugs, improve readability, and optimize your codebase instantly with our advanced AI reviewer tailored for modern engineering teams.
          </p>

          <div className="space-y-4">
            {['Automated PR reviews in seconds', 'Deep context understanding', 'Actionable inline suggestions'].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-text-primary font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-sm text-text-secondary">
          © {new Date().getFullYear()} IntelliReview Inc. All rights reserved.
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex flex-1 flex-col justify-center items-center p-8 sm:p-12">
        {/* Mobile Logo */}
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Code2 className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-text-primary">IntelliReview</span>
        </div>

        <Card animate className="w-full max-w-[420px] shadow-lg border-border/50">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl mb-2">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary" htmlFor="email">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-text-primary" htmlFor="password">Password</label>
                  <a href="#" className="text-xs font-medium text-primary hover:text-primary-hover">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                isLoading={loading}
                className="w-full mt-2 gap-2"
                size="lg"
              >
                Sign in <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-primary hover:text-primary-hover transition-colors">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
