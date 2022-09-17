const nodemailer = require("nodemailer");

// Email Configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_HOST_PASSWORD,
  },
});

module.exports = transporter;