import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  emoji: {
    type: String,
    required: [true, 'Course emoji is required'],
    maxlength: [10, 'Emoji cannot exceed 10 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    enum: ['programming', 'web-development', 'game-development', 'robotics', 'ai', 'animation', 'design'],
    default: 'programming'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  duration: {
    type: Number, // in hours
    required: [true, 'Course duration is required'],
    min: [1, 'Duration must be at least 1 hour']
  },
  lessons: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    videoUrl: String,
    resources: [{
      title: String,
      url: String,
      type: {
        type: String,
        enum: ['document', 'video', 'link', 'code']
      }
    }],
    quiz: {
      questions: [{
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String
      }],
      passingScore: {
        type: Number,
        default: 70
      }
    }
  }],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  instructor: {
    type: String,
    required: [true, 'Instructor name is required']
  },
  thumbnail: {
    type: String,
    default: ''
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create slug from title if not provided
courseSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').trim('-');
  }
  next();
});

// Virtual for course completion rate
courseSchema.virtual('completionRate').get(function() {
  if (this.enrolledStudents.length === 0) return 0;
  // This would need to be calculated based on user progress
  return 0; // Placeholder
});

// Index for better query performance
courseSchema.index({ category: 1, difficulty: 1 });
courseSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Course', courseSchema);