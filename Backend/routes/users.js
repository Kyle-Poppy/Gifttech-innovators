import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Course from '../models/Course.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/', [authenticate, authorize('admin')], async (req, res) => {
  try {
    const {
      role,
      limit = 10,
      page = 1,
      sort = '-createdAt'
    } = req.query;

    // Build query
    let query = {};
    if (role) query.role = role;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get users
    const users = await User.find(query)
      .select('-password')
      .populate('enrolledCourses', 'title slug')
      .populate('completedCourses', 'title slug')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting users'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Admin or own profile)
router.get('/:id', authenticate, async (req, res) => {
  try {
    // Allow admin to view any user, or users to view their own profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this user'
      });
    }

    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('enrolledCourses', 'title description emoji slug category difficulty')
      .populate('completedCourses', 'title description emoji slug category difficulty');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error getting user'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin or own profile)
router.put('/:id', [
  authenticate,
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['student', 'admin'])
    .withMessage('Role must be either student or admin')
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

    // Allow admin to update any user, or users to update their own profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }

    // Prevent non-admin users from changing their role
    if (req.user.role !== 'admin' && req.body.role) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to change role'
      });
    }

    const { name, email, role, avatar } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken'
        });
      }
      updateData.email = email;
    }
    if (role && req.user.role === 'admin') updateData.role = role;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating user'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', [authenticate, authorize('admin')], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error deleting user'
    });
  }
});

// @route   GET /api/users/:id/progress
// @desc    Get user progress in courses
// @access  Private (Admin or own profile)
router.get('/:id/progress', authenticate, async (req, res) => {
  try {
    // Allow admin to view any user's progress, or users to view their own progress
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this user progress'
      });
    }

    const user = await User.findById(req.params.id)
      .populate('enrolledCourses', 'title slug lessons')
      .populate('completedCourses', 'title slug')
      .populate('progress.courseId', 'title slug lessons');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate progress statistics
    const progressStats = {
      totalEnrolled: user.enrolledCourses.length,
      totalCompleted: user.completedCourses.length,
      overallProgress: 0,
      courseProgress: []
    };

    if (user.enrolledCourses.length > 0) {
      let totalProgress = 0;

      user.enrolledCourses.forEach(course => {
        const courseProgress = user.progress.find(
          p => p.courseId._id.toString() === course._id.toString()
        );

        const completedLessons = courseProgress ? courseProgress.completedLessons.length : 0;
        const totalLessons = course.lessons ? course.lessons.length : 0;
        const courseCompletion = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

        progressStats.courseProgress.push({
          courseId: course._id,
          courseTitle: course.title,
          courseSlug: course.slug,
          completedLessons,
          totalLessons,
          completionPercentage: Math.round(courseCompletion)
        });

        totalProgress += courseCompletion;
      });

      progressStats.overallProgress = Math.round(totalProgress / user.enrolledCourses.length);
    }

    res.json({
      success: true,
      data: {
        progress: progressStats,
        detailedProgress: user.progress
      }
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error getting user progress'
    });
  }
});

// @route   POST /api/users/:id/progress/:courseId
// @desc    Update user progress in a course
// @access  Private (Admin or own profile)
router.post('/:id/progress/:courseId', [
  authenticate,
  body('lessonId')
    .optional()
    .isString()
    .withMessage('Lesson ID must be a string'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean')
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

    // Allow admin to update any user's progress, or users to update their own progress
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user progress'
      });
    }

    const { lessonId, completed } = req.body;

    // Verify course exists and user is enrolled
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({
        success: false,
        message: 'User is not enrolled in this course'
      });
    }

    // Find or create progress entry for this course
    let courseProgress = user.progress.find(
      p => p.courseId.toString() === req.params.courseId
    );

    if (!courseProgress) {
      courseProgress = {
        courseId: req.params.courseId,
        completedLessons: [],
        quizScores: []
      };
      user.progress.push(courseProgress);
    }

    // Update lesson completion
    if (lessonId) {
      if (completed && !courseProgress.completedLessons.includes(lessonId)) {
        courseProgress.completedLessons.push(lessonId);
      } else if (!completed) {
        courseProgress.completedLessons = courseProgress.completedLessons.filter(
          id => id !== lessonId
        );
      }
    }

    // Check if course is completed
    const totalLessons = course.lessons ? course.lessons.length : 0;
    const isCompleted = courseProgress.completedLessons.length === totalLessons;

    if (isCompleted && !user.completedCourses.includes(course._id)) {
      user.completedCourses.push(course._id);
    } else if (!isCompleted && user.completedCourses.includes(course._id)) {
      user.completedCourses = user.completedCourses.filter(
        id => id.toString() !== course._id.toString()
      );
    }

    await user.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        courseProgress,
        isCompleted
      }
    });
  } catch (error) {
    console.error('Update progress error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID or course ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating progress'
    });
  }
});

export default router;