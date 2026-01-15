import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema({
  lecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
    required: [true, "lecture is required"],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  watchTime: {
    type: Number,
    default: 0,
  },
  lastWatched: {
    type: Date,
    default: Date.now,
  },
});

const courseProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "course is required"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lectureProgress: [lectureProgressSchema],
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseProgressSchema.pre("save", function (next) {
  if (this.lectureProgress) {
    this.completionPercentage =
      Math.round(
        this.lectureProgress.filter((lecture) => lecture.isCompleted).length /
          this.lectureProgress.length
      ) * 100;

    this.isCompleted = this.completionPercentage === 100;
  }

  return next();
});

courseProgressSchema.methods.updateLastAccessed = function () {
  this.lastAccessed = Date.now();
  return this.save({ validateBeforeSave: false });
};

export const CourseProgress = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);
