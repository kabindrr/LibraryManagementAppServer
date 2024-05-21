import UserSchema from "./UserSchema.js";

export const createNewUser = (userObj) => {
  return UserSchema(userObj).save();
};

export const getUserByEmail = (email) => {
  console.log(email);
  return UserSchema.findOne({ email });
};

export const updateUser = async ({ filter, obj }) => {
  return UserSchema.findOneAndUpdate({ filter, obj });
};
