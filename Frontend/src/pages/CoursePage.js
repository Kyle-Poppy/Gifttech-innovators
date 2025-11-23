import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const CoursePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Mock course data - in real app, this would come from API
  const courseData = {
    python: {
      title: 'Python',
      emoji: '🐍',
      description: 'Learn Python basics and build projects.',
      lessons: [
        {
          id: 1,
          title: 'Introduction to Python',
          content: 'Learn the basics of Python programming language.',
          completed: true
        },
        {
          id: 2,
          title: 'Variables and Data Types',
          content: 'Understanding variables, strings, numbers, and booleans.',
          completed: false
        },
        {
          id: 3,
          title: 'Control Structures',
          content: 'Learn about if statements, loops, and conditional logic.',
          completed: false
        }
      ]
    },
    html: {
      title: 'HTML',
      emoji: '🌐',
      description: 'Build web structures with HTML.',
      lessons: [
        {
          id: 1,
          title: 'HTML Document Structure',
          content: 'Understanding the basic structure of an HTML document.',
          completed: true
        },
        {
          id: 2,
          title: 'Headings and Paragraphs',
          content: 'Creating headings, paragraphs, and basic text elements.',
          completed: false
        }
      ]
    }
  };

  const course = courseData[slug];

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Course Not Found</CardTitle>
            <CardDescription>
              The course you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-blue-700"
            >
              ← Back to Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{course.emoji}</span>
              <h1 className="text-xl font-bold">{course.title}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
          <p className="text-gray-600">{course.description}</p>
        </div>

        {/* Lessons */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Course Lessons</h3>
          {course.lessons.map((lesson) => (
            <Card key={lesson.id} className="cursor-pointer hover:shadow-md transition">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      lesson.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300'
                    }`}>
                      {lesson.completed && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                      <p className="text-sm text-gray-600">{lesson.content}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {lesson.completed ? 'Review' : 'Start'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CoursePage;