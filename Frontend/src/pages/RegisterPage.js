import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Check for existing session
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    setPasswordChecks(checks);
    
    const strength = Object.values(checks).filter(Boolean).length;
    setPasswordStrength((strength / 5) * 100);
    
    return strength;
  };

  const getPasswordStrengthText = () => {
    const strength = Object.values(passwordChecks).filter(Boolean).length;
    if (strength <= 2) return { text: 'Weak', color: 'text-red-600' };
    if (strength <= 3) return { text: 'Fair', color: 'text-yellow-600' };
    if (strength <= 4) return { text: 'Good', color: 'text-blue-600' };
    return { text: 'Strong', color: 'text-green-600' };
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    // Enhanced validation
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', { message: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    const strength = checkPasswordStrength(data.password);
    if (strength < 4) {
      setError('Password does not meet security requirements. Please ensure it has at least 8 characters with uppercase, lowercase, numbers, and special characters.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.toLowerCase().trim(),
          password: data.password
        })
      });

      const responseData = await response.json();

      if (response.ok) {
        setSuccess('Registration successful! Please check your email to verify your account.');
        
        // Store token and redirect after a delay
        setTimeout(() => {
          localStorage.setItem('token', responseData.token);
          localStorage.setItem('user', JSON.stringify(responseData.user));
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(responseData.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 lg:flex">
      {/* Left Side - Content & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 py-24">
          <div className="max-w-md">
            <div className="mb-8">
              <img src="/logo192.png" alt="GiftTech Innovators" className="h-16 w-auto mb-4" />
              <h1 className="text-4xl font-bold mb-4 text-white">
                Start Your Coding Journey
              </h1>
              <p className="text-xl text-purple-100 mb-6">
                Join thousands of students learning to code with Kenya's leading tech education platform.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Structured Learning</h3>
                  <p className="text-purple-100 text-sm">Follow a clear path from basics to advanced</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🤝</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Community Support</h3>
                  <p className="text-purple-100 text-sm">Learn alongside peers and get help when needed</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏅</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Real Certificates</h3>
                  <p className="text-purple-100 text-sm">Earn certificates recognized by employers</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-purple-100 mb-2">Join our growing community</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">Free to Start</Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">No Credit Card</Badge>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-300/20 rounded-full blur-lg"></div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <div className="lg:hidden mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <CardTitle className="text-3xl font-bold text-green-600">
              Join GiftTech
            </CardTitle>
            <CardDescription className="text-gray-600">
              Create your account and start your coding journey today
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-center">
                {success}
              </div>
            )}

            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                rules={{
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormLabel className="text-gray-700 font-semibold">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="h-12"
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
                      <div className="space-y-3">
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a secure password"
                            className="h-12 pr-10"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              checkPasswordStrength(e.target.value);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? '🙈' : '👁️'}
                          </button>
                        </div>
                        
                        {field.value && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Progress value={passwordStrength} className="flex-1 h-2" />
                              <span className={`text-sm font-medium ${getPasswordStrengthText().color}`}>
                                {getPasswordStrengthText().text}
                              </span>
                            </div>
                            
                            <div className="text-xs space-y-1">
                              <div className={`flex items-center gap-2 ${passwordChecks.length ? 'text-green-600' : 'text-gray-400'}`}>
                                <span>{passwordChecks.length ? '✓' : '○'}</span>
                                At least 8 characters
                              </div>
                              <div className={`flex items-center gap-2 ${passwordChecks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                                <span>{passwordChecks.uppercase ? '✓' : '○'}</span>
                                One uppercase letter
                              </div>
                              <div className={`flex items-center gap-2 ${passwordChecks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                                <span>{passwordChecks.lowercase ? '✓' : '○'}</span>
                                One lowercase letter
                              </div>
                              <div className={`flex items-center gap-2 ${passwordChecks.number ? 'text-green-600' : 'text-gray-400'}`}>
                                <span>{passwordChecks.number ? '✓' : '○'}</span>
                                One number
                              </div>
                              <div className={`flex items-center gap-2 ${passwordChecks.special ? 'text-green-600' : 'text-gray-400'}`}>
                                <span>{passwordChecks.special ? '✓' : '○'}</span>
                                One special character
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                rules={{
                  required: 'Please confirm your password'
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="h-12 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? '🙈' : '👁️'}
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </Form>

            <div className="space-y-4">
              <Separator />
              
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                  >
                    Sign in here
                  </button>
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
                  onClick={() => navigate('/tutors-login')}
                  className="text-green-600 hover:text-green-700 text-sm hover:underline transition-colors"
                >
                  Tutors Portal →
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;