import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardDescription, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const courses = [
    {
      id: 'html',
      title: 'HTML',
      description: 'Learn to make websites',
      emoji: '🌐',
      details: 'HTML is the foundation of web pages. Learn to structure content and build websites.',
      level: 'Beginner',
      duration: '4 weeks'
    },
    {
      id: 'css',
      title: 'CSS',
      description: 'Explore web design',
      emoji: '🎨',
      details: 'CSS lets you style websites beautifully. Explore layouts, colors, and animations.',
      level: 'Beginner',
      duration: '6 weeks'
    },
    {
      id: 'ai',
      title: 'A.I',
      description: 'Learn and interact with A.I',
      emoji: '🤖',
      details: 'Learn A.I to build the next big thing in A.I.',
      level: 'Intermediate',
      duration: '8 weeks'
    },
    {
      id: 'robotics',
      title: 'Robotics',
      description: 'Design and build robots',
      emoji: '⚙️',
      details: 'Learn to program hardware and build intelligent robots.',
      level: 'Advanced',
      duration: '12 weeks'
    },
    {
      id: 'scratch',
      title: 'Scratch Dev',
      description: 'Intro to programming',
      emoji: '🎯',
      details: 'Visual programming for beginners using drag-and-drop blocks.',
      level: 'Beginner',
      duration: '3 weeks'
    },
    {
      id: 'python',
      title: 'Python',
      description: 'Learn Python basics',
      emoji: '🐍',
      details: 'Start coding with Python — simple, powerful, and fun.',
      level: 'Beginner',
      duration: '8 weeks'
    },
    {
      id: 'javascript',
      title: 'JavaScript',
      description: 'Learn JavaScript programming',
      emoji: '⚡',
      details: 'Make websites interactive with JavaScript — the language of the web.',
      level: 'Intermediate',
      duration: '10 weeks'
    },
    {
      id: 'gamedev',
      title: 'Game Dev',
      description: 'Build your own games',
      emoji: '🎮',
      details: 'Create games using engines like Unity or Scratch.',
      level: 'Intermediate',
      duration: '12 weeks'
    },
    {
      id: 'android',
      title: 'Android Dev',
      description: 'Build your own android games',
      emoji: '📱',
      details: 'Build your own android games and applications.',
      level: 'Advanced',
      duration: '16 weeks'
    }
  ];

  const handleStudentLogin = () => {
    navigate('/login');
  };

  const handleStudentRegister = () => {
    navigate('/register');
  };

  const handleTutorsLogin = () => {
    navigate('/tutors-login');
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'default';
      case 'Intermediate': return 'secondary';
      case 'Advanced': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 text-gray-800">
      {/* Top Contact Bar */}
      <div className="bg-blue-600 text-white text-sm py-3 px-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-2">
          <span>📞</span>
          <span>+254 734 86 05 32</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>📧</span>
          <span>info@giftechinnovators.com</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50 border-b">
        <div className="w-full px-4 py-4 flex justify-between items-center">
          {/* Company Logo */}
          <div className="flex items-center space-x-3">
            <img src="/logo192.png" alt="GiftTech Innovators Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-gray-900">GiftTech Innovators</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#courses" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200">Courses</a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200">About</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200">Contact</a>
            <Button variant="outline">School Section</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">Student Section</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Student Portal</DialogTitle>
                  <DialogDescription>
                    Access your learning dashboard or create a new account.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <Button onClick={handleStudentLogin} className="w-full">
                    Login to Dashboard
                  </Button>
                  <Button variant="outline" onClick={handleStudentRegister} className="w-full">
                    Create New Account
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col justify-between w-8 h-6 focus:outline-none"
          >
            <span className="block w-full h-1 bg-gray-700 rounded"></span>
            <span className="block w-full h-1 bg-gray-700 rounded"></span>
            <span className="block w-full h-1 bg-gray-700 rounded"></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-4 border-t">
            <a href="#courses" className="block text-gray-700 hover:text-blue-600 font-medium py-2">Courses</a>
            <a href="#about" className="block text-gray-700 hover:text-blue-600 font-medium py-2">About</a>
            <a href="#contact" className="block text-gray-700 hover:text-blue-600 font-medium py-2">Contact</a>
            <Separator />
            <Button variant="outline" className="w-full mb-2">School Section</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="w-full">Student Section</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Student Portal</DialogTitle>
                  <DialogDescription>
                    Access your learning dashboard or create a new account.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <Button onClick={handleStudentLogin} className="w-full">
                    Login to Dashboard
                  </Button>
                  <Button variant="outline" onClick={handleStudentRegister} className="w-full">
                    Create New Account
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="text-center py-24 px-4 bg-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <h1 className="text-6xl font-bold mb-6 text-white">
            Coding in Kenyan Schools
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            We empower schools to teach Computer Science and prepare the next generation of innovators
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => document.getElementById('courses').scrollIntoView()}>
              Explore Courses
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-white border-white hover:bg-white hover:text-blue-600"
              onClick={handleTutorsLogin}
            >
              Tutors Login
            </Button>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Courses</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our comprehensive curriculum designed to take you from beginner to expert
            </p>
          </div>

          <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {courses.map((course) => (
              <Dialog key={course.id}>
                <DialogTrigger asChild>
                  <Card className="group relative bg-white border-2 border-gray-100 hover:border-blue-200 rounded-xl p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden">
                    <div className="absolute inset-x-0 top-0 flex justify-center">
                      <div className="w-24 h-24 bg-blue-200 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    </div>
                    <div className="space-y-4 relative text-center">
                      <div className="text-6xl mb-4">{course.emoji}</div>
                      <CardTitle className="text-2xl font-bold text-gray-900">{course.title}</CardTitle>
                      <CardDescription className="text-gray-600 text-base">{course.description}</CardDescription>
                      <div className="flex justify-center gap-2 mt-4">
                        <Badge variant={getLevelColor(course.level)}>{course.level}</Badge>
                        <Badge variant="outline">{course.duration}</Badge>
                      </div>
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{course.emoji}</span>
                      <DialogTitle className="text-2xl">{course.title}</DialogTitle>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <Badge variant={getLevelColor(course.level)}>{course.level}</Badge>
                      <Badge variant="outline">{course.duration}</Badge>
                    </div>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-gray-700">{course.details}</p>
                    <Separator />
                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={handleStudentLogin}>
                        Enroll Now
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-normal text-blue-400 mb-6">GiftTech Innovators</h1>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Have further questions?</h2>
          <p className="text-lg text-gray-700 mb-8">We are here to help you start your coding journey!</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button variant="default" size="lg" className="flex items-center gap-2">
              <span>📞</span>
              +254 734 86 05 32
            </Button>
            <Button variant="default" size="lg" className="flex items-center gap-2">
              <span>📧</span>
              info@gifttechinnovators.com
            </Button>
          </div>

          <Separator className="my-8" />

          <div className="mt-6">
            <a href="/tutors-login" className="text-blue-600 font-semibold text-lg hover:underline transition-colors">
              Tutors Login
            </a>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Follow Us On:</h3>
            <div className="flex justify-center space-x-8">
              {[
                { name: 'Facebook', icon: 'facebook.png', url: 'https://facebook.com/gifttechinnovators' },
                { name: 'X', icon: 'x.png', url: 'https://twitter.com/gifttechinnovators' },
                { name: 'Instagram', icon: 'instagram.png', url: 'https://instagram.com/gifttechinnovators' },
                { name: 'LinkedIn', icon: 'linkedin.png', url: 'https://linkedin.com/company/gifttechinnovators' },
                { name: 'TikTok', icon: 'tiktok.png', url: 'https://tiktok.com/@gifttechinnovators' },
                { name: 'YouTube', icon: 'youtube.png', url: 'https://youtube.com/@gifttechinnovators' }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <img
                    src={`/assets/social-tags/${social.icon}`}
                    alt={social.name}
                    className="w-8 h-8 hover:scale-110 transition-transform group-hover:brightness-75"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-lg font-semibold">GiftTech Innovators</p>
              <p className="text-gray-400">Empowering the next generation of coders</p>
            </div>
            <div className="text-sm text-gray-400">
              &copy; 2025 GiftTech Innovators. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;