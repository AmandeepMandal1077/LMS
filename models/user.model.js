import bcrypt from "bcryptjs";
import crypto from "crypto";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
      maxLength: [50, "name can be atmost 50 character long"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minLength: [8, "Password must be atleast 8 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["student", "instructor", "admin"],
        message: "Please select a valid role",
      },
      default: "student",
    },
    avatar: {
      type: String,
      default: "default.png",
    },
    bio: {
      type: String,
      maxLength: [200, "bio can be atmost 200 characters long"],
    },
    enrolledCourses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
      },
    ],
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    createdCourses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
      },
    ],

    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpiry: {
      type: Date,
    },
    lastActive: {
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getResetPasswordToken = async function () {
  const token = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.resetPasswordTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10min
  this.save({ validateBeforeSave: false });
  return this.resetPasswordToken;
};

userSchema.methods.updateLastActive = async function () {
  this.lastActive = Date.now();
  return this.save({ validateBeforeSave: false });
};

userSchema.virtual("totalEnrolledCourses").get(function () {
  return this.enrolledCourses.length;
});
export const User = mongoose.model("User", userSchema);
