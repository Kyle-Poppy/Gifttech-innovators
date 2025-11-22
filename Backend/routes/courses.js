import express from 'express';
import { body, validationResult } from 'express-validator';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      difficulty,
      search,
      limit = 10,
      page = 1,
      sort = '-createdAt'
    } = req.query;

    // Build query
    let query = { isActive: true };

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get courses
    const courses = await Course.find(query)
      .populate('enrolledStudents', 'name')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await Course.countDocuments(query);

    // Add enrollment status for authenticated users
    let coursesWithStatus = courses;
    if (req.user) {
      coursesWithStatus = courses.map(course => {
        const courseObj = course.toObject();
        courseObj.isEnrolled = course.enrolledStudents.some(
          student => student._id.toString() === req.user._id.toString()
        );
        return courseObj;
      });
    }

    res.json({
      success: true,
      data: {
        courses: coursesWithStatus,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting courses'
    });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('enrolledStudents', 'name')
      .populate('prerequisites', 'title slug');

    if (!course || !course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Add enrollment status for authenticated users
    let courseWithStatus = course;
    if (req.user) {
      courseWithStatus = course.toObject();
      courseWithStatus.isEnrolled = course.enrolledStudents.some(
        student => student._id.toString() === req.user._id.toString()
      );
    }

    res.json({
      success: true,
      data: {
        course: courseWithStatus
      }
    });
  } catch (error) {
    console.error('Get course error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error getting course'
    });
  }
});

// @route   GET /api/courses/slug/:slug
// @desc    Get single course by slug
// @access  Public
router.get('/slug/:slug', optionalAuth, async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug, isActive: true })
      .populate('enrolledStudents', 'name')
      .populate('prerequisites', 'title slug');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Add enrollment status for authenticated users
    let courseWithStatus = course;
    if (req.user) {
      courseWithStatus = course.toObject();
      courseWithStatus.isEnrolled = course.enrolledStudents.some(
        student => student._id.toString() === req.user._id.toString()
      );
    }

    res.json({
      success: true,
      data: {
        course: courseWithStatus
      }
    });
  } catch (error) {
    console.error('Get course by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting course'
    });
  }
});

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private (Admin only)
router.post('/', [
  authenticate,
  authorize('admin'),
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title is required and must be less than 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('emoji')
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('Emoji is required'),
  body('category')
    .isIn(['programming', 'web-development', 'game-development', 'robotics', 'ai', 'animation', 'design'])
    .withMessage('Invalid category'),
  body('difficulty')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid difficulty level'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),
  body('instructor')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Instructor name is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const courseData = { ...req.body };
    courseData.slug = courseData.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').trim('-');

    // Check if slug already exists
    const existingCourse = await Course.findOne({ slug: courseData.slug });
    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: 'A course with this title already exists'
      });
    }

    const course = await Course.create(courseData);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: {
        course
      }
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating course'
    });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private (Admin only)
router.put('/:id', [
  authenticate,
  authorize('admin'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be less than 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('category')
    .optional()
    .isIn(['programming', 'web-development', 'game-development', 'robotics', 'ai', 'animation', 'design'])
    .withMessage('Invalid category'),
  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid difficulty level'),
  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: {
        course
      }
    });
  } catch (error) {
    console.error('Update course error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating course'
    });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private (Admin only)
router.delete('/:id', [authenticate, authorize('admin')], async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Soft delete by setting isActive to false
    course.isActive = false;
    await course.save();

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error deleting course'
    });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/:id/enroll', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course || !course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is already enrolled
    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Check prerequisites
    if (course.prerequisites && course.prerequisites.length > 0) {
      const user = await User.findById(req.user._id);
      const completedCourseIds = user.completedCourses.map(id => id.toString());
      const hasPrerequisites = course.prerequisites.every(prereq =>
        completedCourseIds.includes(prereq._id.toString())
      );

      if (!hasPrerequisites) {
        return res.status(400).json({
          success: false,
          message: 'Prerequisites not met for this course'
        });
      }
    }

    // Enroll user
    course.enrolledStudents.push(req.user._id);
    await course.save();

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(req.user._id, {
      $push: { enrolledCourses: course._id }
    });

    res.json({
      success: true,
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    console.error('Enroll course error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error enrolling in course'
    });
  }
});

// @route   POST /api/courses/:id/unenroll
// @desc    Unenroll from a course
// @access  Private
router.post('/:id/unenroll', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled
    if (!course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    // Unenroll user
    course.enrolledStudents = course.enrolledStudents.filter(
      studentId => studentId.toString() !== req.user._id.toString()
    );
    await course.save();

    // Remove course from user's enrolled courses
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { enrolledCourses: course._id }
    });

    res.json({
      success: true,
      message: 'Successfully unenrolled from course'
    });
  } catch (error) {
    console.error('Unenroll course error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error unenrolling from course'
    });
  }
});

export default router;