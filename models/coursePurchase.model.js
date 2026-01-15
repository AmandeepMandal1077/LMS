import mongoose from "mongoose";

const coursePurchaseSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "course reference is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user reference is required"],
    },
    amount: {
      type: Number,
      required: [true, "course purchase amount is required"],
      min: [0, "amount must be non-negative"],
    },
    currency: {
      type: String,
      required: [true, "currency of amount required"],
      uppercase: true,
      default: "RUPEES",
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "refunded", "completed", "failed"],
        message: "please select a valid transaction status",
      },
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: [true, "payment method is required"],
    },
    paymentId: {
      type: String,
      required: [true, "payment id is required"],
    },
    refundId: {
      type: String,
    },
    refundAmount: {
      type: Number,
      min: [0, "amount must be non-negative"],
    },
    refundReason: {
      type: String,
    },
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

coursePurchaseSchema.index({ user: 1, course: 1 });
coursePurchaseSchema.index({ createdAt: -1 });
coursePurchaseSchema.index({ status: 1 });

coursePurchaseSchema.methods.isRefundable = function () {
  if (this.status !== "completed") return false;

  return this.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days
};

coursePurchaseSchema.methods.processRefund = function (amount, reason) {
  this.status = "refunded";
  this.refundAmount = amount || this.amount;
  this.refundReason = reason;
  return this.save();
};

export const CoursePurchase = mongoose.model(
  "CoursePurchase",
  coursePurchaseSchema
);
