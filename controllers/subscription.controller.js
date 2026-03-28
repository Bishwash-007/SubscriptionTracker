import * as subscriptionService from '../services/subscription.service.js';
import { SERVER_URL } from '../config/env.js';
import { workflowClient } from '../config/upstash.js';

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await subscriptionService.createSubscription(
      req.body,
      req.user._id
    );

    await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription._id,
      },
      headers: {
        'content-type': 'application/json',
      },
      retries: 0,
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
    const subscriptions = await subscriptionService.getUserSubscriptions(
      req.user.id,
      req.params.id
    );

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
    const subscriptions = await subscriptionService.getAllSubscriptions();

    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    console.log(`Error in getAllSubscriptions: ${error}`);
    next(error);
  }
};

export const getSubscriptionById = async (req, res, next) => {
  try {
    const subscription = await subscriptionService.getSubscriptionById(
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.log(`Error in getSubscriptionById: ${error}`);
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = await subscriptionService.updateSubscription(
      req.params.id,
      req.body,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      data: subscription,
    });
  } catch (error) {
    console.log(`Error in updateSubscription: ${error}`);
    next(error);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    await subscriptionService.deleteSubscription(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Subscription deleted successfully',
    });
  } catch (error) {
    console.log(`Error in deleteSubscription: ${error}`);
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await subscriptionService.cancelSubscription(
      req.params.id,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: subscription,
    });
  } catch (error) {
    console.log(`Error in cancelSubscription: ${error}`);
    next(error);
  }
};

export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const subscriptions = await subscriptionService.getUpcomingRenewals(days);

    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    console.log(`Error in getUpcomingRenewals: ${error}`);
    next(error);
  }
};
