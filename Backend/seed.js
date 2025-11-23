import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';

dotenv.config();

// Course data based on the existing HTML
const coursesData = [
  {
    title: 'Python',
    description: 'Learn Python basics and build projects.',
    emoji: '🐍',
    category: 'programming',
    difficulty: 'beginner',
    duration: 20,
    instructor: 'GiftTech Team',
    lessons: [
      {
        title: 'Introduction to Python',
        content: 'Learn the basics of Python programming language.',
        order: 1
      },
      {
        title: 'Variables and Data Types',
        content: 'Understanding variables, strings, numbers, and booleans.',
        order: 2
      },
      {
        title: 'Control Structures',
        content: 'Learn about if statements, loops, and conditional logic.',
        order: 3
      },
      {
        title: 'Functions',
        content: 'Creating and using functions in Python.',
        order: 4
      },
      {
        title: 'Lists and Dictionaries',
        content: 'Working with data structures in Python.',
        order: 5
      }
    ]
  },
  {
    title: 'Scratch Animation',
    description: 'Create animations with Scratch.',
    emoji: '🎨',
    category: 'animation',
    difficulty: 'beginner',
    duration: 15,
    instructor: 'GiftTech Team',
    lessons: [
      {
        title: 'Getting Started with Scratch',
        content: 'Introduction to the Scratch interface and basic concepts.',
        order: 1
      },
      {
        title: 'Creating Your First Sprite',
        content: 'Learn how to add and customize sprites in Scratch.',
        order: 2
      },
      {
        title: 'Basic Animation Techniques',
        content: 'Moving sprites and creating simple animations.',
        order: 3
      },
      {
        title: 'Adding Sound and Effects',
        content: 'Enhance your animations with sound and visual effects.',
        order: 4
      }
    ]
  },
  {
    title: 'Scratch Games',
    description: 'Build games with Scratch.',
    emoji: '🎮',
    category: 'game-development',
    difficulty: 'beginner',
    duration: 25,
    instructor: 'GiftTech Team',
    lessons: [
      {
        title: 'Game Design Basics',
        content: 'Understanding the fundamentals of game design.',
        order: 1
      },
      {
        title: 'Creating Game Sprites',
        content: 'Designing and importing game characters and objects.',
        order: 2
      },
      {
        title: 'Movement and Controls',
        content: 'Making sprites move with keyboard controls.',
        order: 3
      },
      {
        title: 'Collision Detection',
        content: 'Detecting when sprites interact with each other.',
        order: 4
      },
      {
        title: 'Scoring and Game States',
        content: 'Adding scorekeeping and win/lose conditions.',
        order: 5
      }
    ]
  },
  {
    title: 'CSS',
    description: 'Style websites with CSS.',
    emoji: '🎨',
    category: 'web-development',
    difficulty: 'beginner',
    duration: 18,
    instructor: 'GiftTech Team',
    lessons: [
      {
        title: 'Introduction to CSS',
        content: 'What is CSS and how it works with HTML.',
        order: 1
      },
      {
        title: 'Selectors and Properties',
        content: 'Targeting HTML elements and applying styles.',
        order: 2
      },
      {
        title: 'Colors and Typography',
        content: 'Working with colors, fonts, and text styling.',
        order: 3
      },
      {
        title: 'Box Model and Layout',
        content: 'Understanding margins, padding, borders, and positioning.',
        order: 4
      },
      {
        title: 'Responsive Design',
        content: 'Making websites work on different screen sizes.',
        order: 5
      }
    ]
  },
  {
    title: 'HTML',
    description: 'Build web structures with HTML.',
    emoji: '🌐',
    category: 'web-development',
    difficulty: 'beginner',
    duration: 12,
    instructor: 'GiftTech Team',
    lessons: [
      {
        title: 'HTML Document Structure',
        content: 'Understanding the basic structure of an HTML document.',
        order: 1
      },
      {
        title: 'Headings and Paragraphs',
        content: 'Creating headings, paragraphs, and basic text elements.',
        order: 2
      },
      {
        title: 'Links and Images',
        content: 'Adding hyperlinks and images to your web pages.',
        order: 3
      },
      {
        title: 'Lists and Tables',
        content: 'Creating ordered lists, unordered lists, and data tables.',
        order: 4
      },
      {
        title: 'Forms and Input',
        content: 'Building forms for user input and interaction.',
        order: 5
      }
    ]
  },
  {
    title: 'Robotics',
    description: 'Design and build robots.',
    emoji: '⚙️',
    category: 'robotics',
    difficulty: 'intermediate',
    duration: 30,
    instructor: 'GiftTech Team',
    lessons: [
      {
        title: 'Introduction to Robotics',
        content: 'Understanding what robots are and their components.',
        order: 1
      },
      {
        title: 'Basic Electronics',
        content: 'Learning about circuits, sensors, and motors.',
        order: 2
      },
      {
        title: 'Building Your First Robot',
        content: 'Assembling a simple robot from components.',
        order: 3
      },
      {
        title: 'Programming Robot Behavior',
        content: 'Writing code to control robot actions.',
        order: 4
      },
      {
        title: 'Advanced Robotics Projects',
        content: 'Building more complex robots with multiple functions.',
        order: 5
      }
    ]
  },
  {
    title: 'Game Development',
    description: 'Create your own games.',
    emoji: '🎯',
    category: 'game-development',
    difficulty: 'intermediate',
    duration: 35,
    instructor: 'GiftTech Team',
    lessons: [
      {
        title: 'Game Development Fundamentals',
        content: 'Understanding the game development process.',
        order: 1
      },
      {
        title: 'Game Engines and Tools',
        content: 'Introduction to popular game development tools.',
        order: 2
      },
      {
        title: '2D Graphics and Animation',
        content: 'Creating sprites, backgrounds, and animations.',
        order: 3
      },
      {
        title: 'Game Physics',
        content: 'Implementing movement, collision, and physics.',
        order: 4
      },
      {
        title: 'Sound and Music',
        content: 'Adding audio elements to games.',
        order: 5
      },
      {
        title: 'Publishing Your Game',
        content: 'Preparing and distributing your finished game.',
        order: 6
      }
    ]
  },
  {
    title: 'A.I.',
    description: 'Learn and interact with A.I.',
    emoji: '🤖',
    category: 'ai',
    difficulty: 'intermediate',
    duration: 28,
    instructor: 'GiftTech Team',
    lessons: [
      {
        title: 'What is Artificial Intelligence?',
        content: 'Understanding the basics of AI and machine learning.',
        order: 1
      },
      {
        title: 'Machine Learning Concepts',
        content: 'Learning about supervised and unsupervised learning.',
        order: 2
      },
      {
        title: 'Neural Networks',
        content: 'Understanding how neural networks work.',
        order: 3
      },
      {
        title: 'AI in Practice',
        content: 'Building simple AI applications.',
        order: 4
      },
      {
        title: 'Ethics in AI',
        content: 'Discussing responsible AI development and usage.',
        order: 5
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Existing courses cleared');

    // Insert new courses
    const courses = await Course.insertMany(coursesData);
    console.log(`Seeded ${courses.length} courses successfully`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();