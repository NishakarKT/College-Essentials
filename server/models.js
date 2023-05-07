import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  contact: String,
  date: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

userSchema.index({ location: "2dsphere" });

export const User = mongoose.model("user", userSchema);
