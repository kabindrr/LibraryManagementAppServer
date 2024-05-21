import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    associate: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const SessionSchema = mongoose.model("Session", sessionSchema);

//Just to show that we can write both schema and model in the same file
//Querires

export const insertToken = (obj) => {
  return SessionSchema(obj).save();
};
