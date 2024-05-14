import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8000;

//connect mongodb
import { connectMongoDB } from "./src/config/mongoConfig.js";
connectMongoDB();

//Middlewares
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

//Routers
import userRouter from "./src/routers/userRouter.js";
app.use("/api/v1/users", userRouter);

//server status
app.get("*", (req, res, next) => {
  res.json({ message: "server is healthy" });
});

app.use("*", (req, res, next) => {
  const err = new Error("404 Not Found");
  err.status = 404;
  next(err);
});

//Global error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    status: "error",
    message: error.message,
  });
});

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`server connected at http://localhost:${PORT}`);
});
