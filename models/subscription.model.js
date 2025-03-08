import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required!"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required!"],
      min: [0, "Price must be greater than 0"],
      max: 1000,
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP"],
      default: "USD",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      enum: ["basic", "standard", "premium"],
      required: [true, "Subscription category is required!"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required!"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(),
        message: "Start date must be in the past",
      },
    },
    renewalDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date must be after the start date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// auto calucate renewal date if missing
subscriptionSchema.pre("save", function (next) {
  if (!this.isNew) {
    const renewalPeriod = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriod[this.frequency]
    );
  }
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }
  next();
});


const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
