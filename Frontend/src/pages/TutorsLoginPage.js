import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';

const TutorsLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const verifyToken = useCallback(async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/tutor/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        navigate('/tutor-dashboard');
      } else {
        localStorage.removeItem('tutorToken');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('tutorToken');
    }
  }, [navigate]);

  // Security: Check for existing tutor session
  useEffect(() => {
    const token = localStorage.getItem('tutorToken');
    if (token) {
      verifyToken(token);
    }
  }, [verifyToken]);

  // Security: Handle account lockout
  useEffect(() => {
    const lockoutEndTime = localStorage.getItem('tutorLockoutEndTime');
    if (lockoutEndTime) {
      const now = new Date().getTime();
      const lockTime = parseInt(lockoutEndTime);
      
      if (now < lockTime) {
        setIsLocked(true);
        setLockoutTime(lockTime);
        
        const timer = setInterval(() => {
          const currentTime = new Date().getTime();
          if (currentTime >= lockTime) {
            setIsLocked(false);
            setLockoutTime(null);
            localStorage.removeItem('tutorLockoutEndTime');
            setLoginAttempts(0);
            clearInterval(timer);
          }
        }, 1000);
        
        return () => clearInterval(timer);
      } else {
        localStorage.removeItem('tutorLockoutEndTime');
      }
    }
  }, []);

  const handleFailedLogin = () => {
    const attempts = loginAttempts + 1;
    setLoginAttempts(attempts);
    
    if (attempts >= 5) {
      const lockoutDuration = 30 * 60 * 1000; // 30 minutes for tutors
      const lockoutEnd = new Date().getTime() + lockoutDuration;
      localStorage.setItem('tutorLockoutEndTime', lockoutEnd.toString());
      setIsLocked(true);
      setLockoutTime(lockoutEnd);
      setError('Account temporarily locked due to multiple failed login attempts. Please try again in 30 minutes.');
    } else {
      setError(`Invalid credentials. ${5 - attempts} attempts remaining before account lockout.`);
    }
  };

  const getRemainingLockoutTime = () => {
    if (!lockoutTime) return '';
    const now = new Date().getTime();
    const remaining = Math.max(0, lockoutTime - now);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const onSubmit = async (data) => {
    if (isLocked) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/tutor/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email.toLowerCase().trim(),
          password: data.password
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        // Reset login attempts on successful login
        setLoginAttempts(0);
        localStorage.removeItem('tutorLockoutEndTime');
        
        // Store tutor token securely
        localStorage.setItem('tutorToken', responseData.token);
        localStorage.setItem('tutor', JSON.stringify(responseData.tutor));
        
        // Navigate to tutor dashboard
        navigate('/tutor-dashboard');
      } else {
        handleFailedLogin();
      }
    } catch (err) {
      console.error('Tutor login error:', err);
      handleFailedLogin();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 lg:flex">
      {/* Left Side - Content & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-green-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 py-24">
          <div className="max-w-md">
            <div className="mb-8">
              <img src="/logo192.png" alt="GiftTech Innovators" className="h-16 w-auto mb-4" />
              <h1 className="text-4xl font-bold mb-4 text-white">
                Welcome Back, Educator
              </h1>
              <p className="text-xl text-green-100 mb-6">
                Access your teaching tools and manage your students' learning journey with our comprehensive platform.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Course Management</h3>
                  <p className="text-green-100 text-sm">Create and manage comprehensive curricula</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Student Analytics</h3>
                  <p className="text-green-100 text-sm">Track student progress and performance</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Assignment Grading</h3>
                  <p className="text-green-100 text-sm">Streamlined grading and feedback system</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-green-100 mb-2">Empowering educators nationwide</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">200+ Tutors</Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">Trusted Platform</Badge>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-300/20 rounded-full blur-lg"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <div className="lg:hidden mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <CardTitle className="text-3xl font-bold text-green-600">
              Tutors Portal
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to access your teaching dashboard and manage courses
            </CardDescription>
            
            {isLocked && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                <p className="font-semibold">Account Temporarily Locked</p>
                <p className="text-sm">Time remaining: {getRemainingLockoutTime()}</p>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {error && !isLocked && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">Tutor Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your tutor email"
                          className="h-12"
                          disabled={isLocked}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="h-12 pr-10"
                            disabled={isLocked}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            disabled={isLocked}
                          >
                            {showPassword ? '🙈' : '👁️'}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700"
                  disabled={isLoading || isLocked}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Access Tutor Portal'
                  )}
                </Button>
              </form>
            </Form>

            <div className="space-y-4">
              <Separator />
              
              <div className="text-center">
                <Link
                  to="/tutor-forgot-password"
                  className="text-green-600 hover:text-green-700 text-sm hover:underline transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Not a tutor yet?{' '}
                  <Link
                    to="/tutor-application"
                    className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors"
                  >
                    Apply to join our team
                  </Link>
                </p>
              </div>

              <Separator />
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-500 hover:text-gray-700 text-sm hover:underline transition-colors"
                >
                  ← Back to Home
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-700 text-sm hover:underline transition-colors"
                >
                  Student Login →
                </button>
              </div>
            </div>

            {loginAttempts > 0 && loginAttempts < 5 && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-lg text-center text-sm">
                Security Notice: {loginAttempts}/5 failed attempts
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TutorsLoginPage;