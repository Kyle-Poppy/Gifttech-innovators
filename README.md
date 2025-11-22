# GiftTech Innovators - MERN Stack Conversion

This project has been converted from a vanilla HTML/JavaScript application to a modern MERN stack (MongoDB, Express.js, React, Node.js) with Shadcn UI components.

## 🚀 Project Overview

GiftTech Innovators is an educational platform that provides coding courses for students in Kenyan schools. The platform offers courses in various programming languages and technologies including Python, HTML, CSS, JavaScript, Scratch programming, Robotics, Game Development, and AI.

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Shadcn UI** - Modern UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client

## 📁 Project Structure

```
Gifttech-innovators/
├── assets/
│   ├── logo/              # Logo images
│   └── social-tags/       # Social media icons
├── Backend/
│   ├── models/
│   │   ├── User.js          # User model
│   │   └── Course.js        # Course model
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── courses.js       # Course management routes
│   │   └── users.js         # User management routes
│   ├── middleware/
│   │   └── auth.js          # Authentication middleware
│   ├── server.js            # Main server file
│   ├── seed.js              # Database seeding script
│   ├── package.json         # Backend dependencies
│   └── .env                 # Environment variables
├── Frontend/
│   ├── public/
│   │   ├── assets/          # Static assets (copied from root)
│   │   │   ├── logo/
│   │   │   └── social-tags/
│   │   ├── index.html       # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/          # Shadcn UI components
│   │   │       ├── button.js
│   │   │       ├── card.js
│   │   │       └── input.js
│   │   ├── pages/
│   │   │   ├── LandingPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── StudentDashboard.js
│   │   │   └── CoursePage.js
│   │   ├── utils/
│   │   │   └── cn.js        # Utility functions
│   │   ├── App.js           # Main React app
│   │   ├── App.css          # App styles
│   │   ├── index.js         # React entry point
│   │   └── index.css        # Global styles
│   ├── package.json         # Frontend dependencies
│   ├── tailwind.config.js   # Tailwind configuration
│   └── postcss.config.js    # PostCSS configuration
├── .env                     # Root environment variables
├── index.html               # Original landing page (kept for reference)
├── student-dashboard.html   # Original dashboard (kept for reference)
├── main.js                  # Original JavaScript (kept for reference)
└── README.md                # This file
```

## 🗄️ Database Models

### User Model
- **name**: String (required)
- **email**: String (required, unique)
- **password**: String (required, hashed)
- **role**: String (student/admin, default: student)
- **enrolledCourses**: Array of Course references
- **completedCourses**: Array of Course references
- **progress**: Course progress tracking

### Course Model
- **title**: String (required)
- **description**: String (required)
- **emoji**: String (required)
- **slug**: String (required, unique)
- **category**: String (programming, web-development, etc.)
- **difficulty**: String (beginner, intermediate, advanced)
- **duration**: Number (hours)
- **lessons**: Array of lesson objects
- **enrolledStudents**: Array of User references

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/update-profile` - Update user profile
- `POST /api/auth/logout` - User logout

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `GET /api/courses/slug/:slug` - Get course by slug
- `POST /api/courses` - Create course (admin only)
- `PUT /api/courses/:id` - Update course (admin only)
- `DELETE /api/courses/:id` - Delete course (admin only)
- `POST /api/courses/:id/enroll` - Enroll in course
- `POST /api/courses/:id/unenroll` - Unenroll from course

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)
- `GET /api/users/:id/progress` - Get user progress
- `POST /api/users/:id/progress/:courseId` - Update user progress

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Gifttech-innovators
   ```

2. **Set up environment variables**
   Edit the `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gifttech_innovators?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   JWT_EXPIRE=30d
   PORT=5000
   NODE_ENV=development
   ```

3. **Install backend dependencies**
   ```bash
   cd Backend
   npm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../Frontend
   npm install
   ```

5. **Seed the database (optional)**
   ```bash
   cd ../Backend
   npm run seed
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd Backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd Frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## 🔧 Development Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🎨 UI Components

The application uses Shadcn UI components built on top of Radix UI and styled with Tailwind CSS:

- **Button** - Customizable button component
- **Card** - Content container with header, content, and footer
- **Input** - Form input field
- **Dialog** - Modal dialogs
- **Navigation** - Menu and navigation components

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. Users register/login through the API
2. JWT tokens are stored in localStorage
3. Protected routes check for valid tokens
4. Tokens expire after 30 days (configurable)

## 📱 Features

### Landing Page
- Course showcase with interactive cards
- Student login modal
- Responsive design
- Social media links

### Student Dashboard
- Personalized welcome section
- Progress tracking
- Quick access navigation
- Enrolled courses display
- Profile picture upload
- Mobile-responsive sidebar

### Authentication
- User registration and login
- Password hashing with bcrypt
- JWT-based session management
- Protected routes

### Course Management
- Course enrollment/unenrollment
- Progress tracking per course
- Lesson completion status
- Admin course management (future feature)

## 🔄 Migration from HTML/JavaScript

The original HTML/JavaScript files have been preserved for reference:

- `index.html` - Original landing page
- `student-dashboard.html` - Original dashboard
- `main.js` - Original JavaScript functionality

Key conversions made:
1. **Static HTML** → **React Components**
2. **Vanilla JavaScript** → **React Hooks and State**
3. **Inline CSS** → **Tailwind CSS + Shadcn UI**
4. **Local Storage** → **MongoDB Database**
5. **No Authentication** → **JWT Authentication**
6. **Static Content** → **Dynamic API-driven Content**

## 🚧 Future Enhancements

- [ ] Admin dashboard for course management
- [ ] Real-time notifications
- [ ] File upload for assignments
- [ ] Video lesson integration
- [ ] Quiz system
- [ ] Progress analytics
- [ ] Mobile app development
- [ ] Multi-language support

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: info@giftechinnovators.com
- Phone: +254 734 86 05 32

---

**Built with ❤️ for Kenyan students learning to code**
