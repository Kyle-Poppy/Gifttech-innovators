import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';

const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [user, setUser] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [progress, setProgress] = useState({ overallProgress: 0, courseProgress: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Mock notifications - in real app, this would come from API
  const notifications = [
    'New assignment posted in Python course',
    'Project deadline extended for HTML course',
    'New course "JavaScript Basics" is now available'
  ];

  const quickAccessItems = [
    {
      title: 'Assignments',
      description: 'View and submit your assignments.',
      color: 'blue',
      action: () => navigate('/assignments')
    },
    {
      title: 'Resources',
      description: 'Access learning materials.',
      color: 'green',
      action: () => navigate('/resources')
    },
    {
      title: 'Announcements',
      description: 'Stay updated with latest news.',
      color: 'yellow',
      action: () => navigate('/announcements')
    }
  ];

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch user profile
      const profileResponse = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch profile');
      }

      const profileData = await profileResponse.json();
      setUser(profileData.data.user);

      // Fetch all courses to show available ones
      const coursesResponse = await fetch('http://localhost:5000/api/courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        setAllCourses(coursesData.data.courses);
      }

      // Fetch user progress
      const progressResponse = await fetch(`http://localhost:5000/api/users/${profileData.data.user._id}/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        setProgress(progressData.data.progress);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePic(e.target.result);
        // In a real app, you'd upload this to the server
        updateProfilePicture(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfilePicture = async (avatarData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ avatar: avatarData })
      });

      if (response.ok) {
        // Update local user state
        setUser(prev => ({ ...prev, avatar: avatarData }));
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleCourseClick = async (course) => {
    if (course.isEnrolled) {
      // Navigate to course page
      navigate(`/course/${course.slug}`);
    } else {
      // Enroll in the course directly
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/courses/${course._id}/enroll`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          alert('Successfully enrolled in course!');
          // Refresh dashboard data
          fetchDashboardData();
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to enroll in course');
        }
      } catch (error) {
        console.error('Error enrolling in course:', error);
        alert('Failed to enroll in course. Please try again.');
      }
    }
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600 text-lg">{error}</p>
          <Button onClick={fetchDashboardData} size="lg">Try Again</Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-600 text-lg">Please log in to access your dashboard.</p>
          <Button onClick={() => navigate('/login')} size="lg">Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white text-gray-700 p-3 rounded-lg shadow-lg border"
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>

      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside className={`w-80 p-6 space-y-6 fixed md:relative z-40 md:z-auto shadow-xl border rounded-r-lg bg-white/95 backdrop-blur-sm ${isSidebarOpen ? 'block' : 'hidden'} md:block`} style={{ top: '0', left: '0' }}>
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 mx-auto border-4 border-blue-200">
                <AvatarImage src={profilePic || user.avatar} alt="Profile" />
                <AvatarFallback className="text-2xl bg-blue-600 text-white">
                  {getInitial(user.name)}
                </AvatarFallback>
              </Avatar>
              <button
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold hover:bg-blue-700 transition-colors"
                onClick={() => document.getElementById('file-input').click()}
                title="Add Profile Picture"
              >
                +
              </button>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <Badge variant="secondary" className="mt-2">Student</Badge>
            </div>
            <input
              type="file"
              id="file-input"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleProfilePicChange}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Quick Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{user.enrolledCourses?.length || 0}</div>
                  <div className="text-sm text-gray-600">Enrolled Courses</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{user.completedCourses?.length || 0}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:ml-0 pt-20 md:pt-0">
          <header className="w-full fixed top-0 left-0 bg-white/95 backdrop-blur-md shadow-md border-b z-50">
            <div className="px-6 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">GiftTech Innovators</h1>
              <Button
                onClick={handleLogout}
                variant="outline"
              >
                Logout
              </Button>
            </div>
          </header>

          <main className="p-6 space-y-8">
            {/* Welcome Section */}
            <div className="bg-blue-600 rounded-xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h2>
              <p className="text-blue-100 mb-4">Continue your learning journey and unlock new skills.</p>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{progress.overallProgress}%</span>
                  </div>
                  <Progress value={progress.overallProgress} className="h-3" />
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {user.enrolledCourses?.length || 0} Active Courses
                </Badge>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="courses">My Courses</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Quick Access */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600">Quick Access</CardTitle>
                    <CardDescription>Access your most used features</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {quickAccessItems.map((item, index) => (
                        <Card
                          key={index}
                          className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md bg-${item.color}-50 hover:bg-${item.color}-100`}
                          onClick={item.action}
                        >
                          <CardTitle className={`text-lg font-semibold text-${item.color}-600`}>
                            {item.title}
                          </CardTitle>
                          <CardDescription className="text-gray-600">
                            {item.description}
                          </CardDescription>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity & Notifications */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-blue-600">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Completed HTML Basics</p>
                            <p className="text-sm text-gray-600">2 days ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Started CSS Fundamentals</p>
                            <p className="text-sm text-gray-600">1 week ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-blue-600">Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {notifications.slice(0, 3).map((notification, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                            <p className="text-sm text-gray-700">{notification}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="courses" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl text-blue-600">Available Courses</CardTitle>
                    <CardDescription>
                      Browse and enroll in courses to expand your skills
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {allCourses.map((course) => (
                        <Card
                          key={course._id}
                          className={`p-6 rounded-lg shadow border cursor-pointer transition-all hover:shadow-lg ${
                            course.isEnrolled
                              ? 'bg-green-50 border-green-200'
                              : 'bg-white hover:bg-gray-50 border-gray-200'
                          }`}
                          onClick={() => handleCourseClick(course)}
                        >
                          <div className="text-center mb-4">
                            <span className="text-5xl">{course.emoji}</span>
                          </div>
                          <h3 className="text-xl font-semibold text-center mb-2">{course.title}</h3>
                          <p className="text-sm text-gray-600 text-center mb-4">{course.description}</p>
                          <div className="text-center">
                            <Button
                              className="w-full"
                              variant={course.isEnrolled ? "default" : "outline"}
                            >
                              {course.isEnrolled ? 'Continue Course' : 'Enroll Now'}
                            </Button>
                          </div>
                          {course.isEnrolled && (
                            <div className="mt-3 text-center">
                              <Badge variant="default" className="bg-green-600">✓ Enrolled</Badge>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl text-blue-600">Learning Progress</CardTitle>
                    <CardDescription>Track your advancement across all enrolled courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {progress.courseProgress?.map((courseProgress, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold">{courseProgress.courseName}</h4>
                            <Badge variant="outline">{courseProgress.progress}%</Badge>
                          </div>
                          <Progress value={courseProgress.progress} className="h-3" />
                          <p className="text-sm text-gray-600">
                            {courseProgress.completedLessons} of {courseProgress.totalLessons} lessons completed
                          </p>
                        </div>
                      )) || (
                        <p className="text-gray-600 text-center py-8">No progress data available yet.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white p-6 text-center">
        <p>&copy; 2025 GiftTech Innovators. Empowering the next generation of coders.</p>
      </footer>
    </div>
  );
};

export default StudentDashboard;