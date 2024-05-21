import express from "express";
import {
  createNewUser,
  getUserByEmail,
} from "../models/user/UserSchema.js/UserModel.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { newUserValidation } from "../middlewares/joiValidation.js";
import { token } from "morgan";
import { signAccessJWT, signRefreshJWT } from "../utils/jwt.js";

const router = express.Router();
router.all("/", (req, res, next) => {
  console.log("from all");
  next();
});

router.get("/", (req, res, next) => {
  try {
    res.json({
      status: "success",
      message: "todo GET",
    });
  } catch (error) {
    next(error);
  }
});
router.post("/", newUserValidation, async (req, res, next) => {
  console.log(req.body);

  try {
    console.log(req.body);
    req.body.password = hashPassword(req.body.password);
    const user = await createNewUser(req.body);
    user?._id
      ? res.json({
          status: "success",
          message: "Your account has been created successfully",
        })
      : res.json({
          status: "error",
          message: "Unable to create an use try again later",
        });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key")) {
      error.message =
        "Another user already have this email, change your email and try again";
      error.status = 200;
    }
    next(error);
  }
});

///
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("email" + email);
    if (!email.includes("@") || !password) {
      throw new Error("Invalid login details");
    }
    //
    const user = await getUserByEmail(email);
    console.log("result " + user);
    if (user?._id) {
      const isPassMatched = comparePassword(password, user.password);
      if (isPassMatched) {
        return res.json({
          status: "success",
          message: "user authenticated",
          tokens: {
            accessJWT: signAccessJWT({ email }),
            refreshJWT: signRefreshJWT({ email }),
          },
        });
      }

      res.json({
        status: "error",
        message: "Invalid login details",
      });
    }

    res.json({
      status: "error",
      message: "Email not found",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
