import Subscription from '../models/subscription.model.js';

export const createSubscription = async (subscriptionData, userId) => {
  const subscription = await Subscription.create({
    ...subscriptionData,
    user: userId,
  });

  return subscription;
};

export const getUserSubscriptions = async (userId, requestedUserId) => {
  if (userId !== requestedUserId) {
    const error = new Error('Unauthorized');
    error.statusCode = 401;
    throw error;
  }

  const subscriptions = await Subscription.find({ user: requestedUserId });
  return subscriptions;
};

export const getAllSubscriptions = async () => {
  const subscriptions = await Subscription.find();
  return subscriptions;
};

export const getSubscriptionById = async (id) => {
  const subscription = await Subscription.findById(id);
  if (!subscription) {
    const error = new Error(`Subscription not found with id: ${id}`);
    error.statusCode = 404;
    throw error;
  }
  return subscription;
};

export const updateSubscription = async (id, updateData, userId) => {
  const subscription = await Subscription.findOne({ _id: id, user: userId });

  if (!subscription) {
    const error = new Error('Subscription not found or unauthorized');
    error.statusCode = 404;
    throw error;
  }

  const updatedSubscription = await Subscription.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  return updatedSubscription;
};

export const deleteSubscription = async (id, userId) => {
  const subscription = await Subscription.findOne({ _id: id, user: userId });

  if (!subscription) {
    const error = new Error('Subscription not found or unauthorized');
    error.statusCode = 404;
    throw error;
  }

  await Subscription.findByIdAndDelete(id);
  return { success: true };
};

export const cancelSubscription = async (id, userId) => {
  const subscription = await Subscription.findOne({ _id: id, user: userId });

  if (!subscription) {
    const error = new Error('Subscription not found or unauthorized');
    error.statusCode = 404;
    throw error;
  }

  const cancelledSubscription = await Subscription.findByIdAndUpdate(
    id,
    { $set: { status: 'cancelled' } },
    { new: true }
  );

  return cancelledSubscription;
};

export const getUpcomingRenewals = async (days = 7) => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);

  const subscriptions = await Subscription.find({
    status: 'active',
    renewalDate: {
      $gte: today,
      $lte: futureDate,
    },
  }).populate('user', 'name email');

  return subscriptions;
};
