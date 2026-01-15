import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      maxLength: [50, "title length can be atmost 50 characters long"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      maxLength: [100, "description length can be atmost 100 characters long"],
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, "video is required"],
    },
    duration: {
      type: Number,
      default: 0,
    },
    isPreview: {
      type: Boolean,
      default: true,
    },
    publicId: {
      type: String,
      required: [true, "public id is required for management"],
    },
    order: {
      type: Number,
      required: [true, "order is required"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

lectureSchema.pre("save", function (next) {
  if (this.duration) {
    this.duration = Math.round(this.duration * 100) / 100;
  }
  return next();
});

export const Lecture = mongoose.model("Lecture", lectureSchema);
