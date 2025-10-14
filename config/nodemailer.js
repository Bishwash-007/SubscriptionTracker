import { createTransport } from 'nodemailer'
import { EMAIL_PASS, EMAIL_USER } from './env.js'

const transporter = createTransport({
  host: 'smtp.ethereal.email',
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
})

export default transporter
