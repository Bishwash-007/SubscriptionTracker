import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send({
    title: "Fetch all Users...",
  });
});
userRouter.get("/:id", (req, res) => {
  res.send({
    title: "Get User Details...",
  });
});
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
