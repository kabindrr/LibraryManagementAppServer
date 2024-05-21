import JWT from "jsonwebtoken";
import { insertToken } from "../models/user/session/SessionSchema.js";
import { token } from "morgan";
import { updateUser } from "../models/user/UserSchema.js/UserModel.js";

//create access jwt
export const signAccessJWT = (payload) => {
  const token = JWT.sign(payload, process.env.ACCESS_JWT_SECRET, {
    expiresIn: "15m",
  });

  insertToken({ token });
  return token;
};

//vertify access jwt

//create refresh jwt

export const signRefreshJWT = (email) => {
  const refreshJWT = JWT.sign({ email }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: "30d",
  });

  updateUser({ email }, { refreshJWT });
  return refreshJWT;
};

//vertify refresh jwt
