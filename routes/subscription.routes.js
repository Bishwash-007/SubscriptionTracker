import { Router } from "express";

const subscriptionRouter = Router();


subscriptionRouter.get('/', (req,res)=> res.send({
    title: 'Get all subscriptions....',
}));

subscriptionRouter.get('/:id', (req,res)=> res.send({
    title: 'Get subscription details....',
}));

subscriptionRouter.put('/:id', (req,res)=> res.send({
    title: 'Update subscription....',
}));

subscriptionRouter.post('/', (req,res)=> res.send({
    title: 'Create new subscription....',
}));

subscriptionRouter.delete('/:id', (req,res)=> res.send({
    title: 'Delete a subscription....',
}));
subscriptionRouter.get('/user/:id', (req,res)=> res.send({
    title: 'Get all users subscriptions....',
}));
subscriptionRouter.put('/:id/cancel', (req,res)=> res.send({
    title: 'Cancel Subscriptions....',
}));
subscriptionRouter.get('/upcoming-renewals', (req,res)=> res.send({
    title: 'Get upcoming renewals....',
}));

export default subscriptionRouter;