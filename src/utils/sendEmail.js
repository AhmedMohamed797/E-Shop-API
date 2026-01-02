import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

export const sendEmail = async (options) => {
  const mailOptions = {
    from: `E-Shop ${process.env.EMAIL}`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  await transporter.sendMail(mailOptions);
};
