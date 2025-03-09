import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.log(`Error in createSubscription: ${error}`);
    next(error);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });
    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    console.log(`Error in getSubscriptions: ${error}`);
    next(error);
  }
};

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    console.log(`Error in getAllSubscriptions: ${error}`);
    next(error);
  }
}

export const getSubscriptionById = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error(`Subscription not found with id: ${req.params.id}`);
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.log(`Error in getSubscriptionById: ${error}`);
    next(error);
  }
}
