// utils/sendOtp.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
// console.log(process.env.EMAIL_HOST, "jkhlkjhkhkj");

async function sendOtpEmail(email, otp) {
console.log(process.env.EMAIL_HOST, "jkhlkjhkhkj");

    let transporter = nodemailer.createTransport({
        // service: 'Gmail',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: 'kamesh@technogenesis.in', // your email
            pass: '' // your email password
        }
    });

    let mailOptions = {
        from: 'kamesh@technogenesis.in',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendOtpEmail;
