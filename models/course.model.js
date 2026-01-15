import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      maxLength: [50, "title can be atmost 50 characters long"],
      trim: true,
    },
    subtitle: {
      type: String,
      maxLength: [100, "sub-title can be atmost 100 characters long"],
      required: [true, "description is required"],
      trim: true,
    },
    description: {
      type: String,
      maxLength: [200, "description can be atmost 200 characters long"],
      required: [true, "description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "category is required"],
      trim: true,
    },
    level: {
      type: String,
      enum: {
        values: ["beginner", "intermediate", "advance"],
        message: "a course level is required",
      },
      default: "beginner",
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "price must be non-negative"],
    },
    thumbnail: {
      type: String,
      required: [true, "thumbnail is required"],
    },
    enrolledStudents: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
    ],
    lectures: [
      {
        lecture: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lecture",
        },
      },
    ],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "course instructor is required"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    totalLectures: {
      type: Number,
      default: 0,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseSchema.pre("save", function (next) {
  if (this.lectures) {
    this.totalLectures = this.lectures.length;
  }
  return next();
});

courseSchema.virtual("averageRating").get(function () {
  const ratedStudents = this.enrolledStudents.filter(
    (student) => student.rating
  );

  if (ratedStudents.length === 0) return 0;

  const totalRating = ratedStudents.reduce(
    (sum, student) => sum + student.rating,
    0
  );
  return Math.round((totalRating / ratedStudents.length) * 10) / 10;
});

export const Course = mongoose.model("Course", courseSchema);
