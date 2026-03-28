import dayjs from 'dayjs';
import { emailTemplates } from './email-template.js';
import { EMAIL_USER } from '../config/env.js';
import { transporter } from '../config/nodemailer';

export const sendReminderEmail = async ({ to, type, subscription }) => {
  if (!to || !type || !subscription) {
    throw new Error('Missing required fields');
  }
  const template = emailTemplates.find((t) => t.label === type);

  if (!template) throw new Error('Invalid email template');

  const mailInfo = {
    userName: subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format('YYYY-MM-DD'),
    planName: subscription.name,
    price: `${subscription.currency} ${subscription.price} ${subscription.frequency}`,
    paymentMethod: subscription.paymentMethod,
  };

  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  const mailOptions = {
    from: EMAIL_USER,
    to,
    subject: subject,
    html: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) throw new Error('Error sending email');
    console.log('Email Sent', info);
  });
};
