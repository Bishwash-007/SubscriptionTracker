import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  getUserSubscriptions,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", authorize, getAllSubscriptions);

subscriptionRouter.get("/:id", authorize, getSubscriptionById);

subscriptionRouter.put("/:id", (req, res) =>
  res.send({
    title: "Update subscription....",
  })
);

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.delete("/:id", (req, res) =>
  res.send({
    title: "Delete a subscription....",
  })
);
subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);
subscriptionRouter.put("/:id/cancel", (req, res) =>
  res.send({
    title: "Cancel Subscriptions....",
  })
);
subscriptionRouter.get("/upcoming-renewals", (req, res) =>
  res.send({
    title: "Get upcoming renewals....",
  })
);

export default subscriptionRouter;
