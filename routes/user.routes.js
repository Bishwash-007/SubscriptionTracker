import { Router } from "express";
import { getUsers, getUser } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", authorize, getUser);
userRouter.put("/:id", (req, res) => {
  res.send({
    title: "Update user...",
  });
});
userRouter.post("/", (req, res) => {
  res.send({
    title: "Create New User...",
  });
});
userRouter.delete("/:id", (req, res) => {
  res.send({
    title: "Delete a user...",
  });
});

export default userRouter;
