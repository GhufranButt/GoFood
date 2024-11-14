// import otpGenerator from "otp-generator";
// import dotenv from "dotenv";
// import nodemailer from "nodemailer";

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   service: "gmail",
//   auth: {
//     user: process.env.SENDER_EMAIL,
//     pass: process.env.APP_PASSWORD,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });
// // console.log("Email:", process.env.SENDER_EMAIL); // Debug line, remove in production
// // console.log("App Password:", process.env.APP_PASSWORD); // Debug line, remove in production

// export const generateOtp = async (email) => {
//   // Generate OTP
//   const otp = otpGenerator.generate(6, {
//     upperCaseAlphabets: false,
//     specialChars: false,
//     lowerCaseAlphabets: false,
//   });

//   // Calculate OTP expiration date (e.g., 5 minutes from now)
//   const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);

//   const senderEmail = process.env.SENDER_EMAIL;

//   if (!senderEmail) {
//     throw new Error("Sender email is not defined in environment variables.");
//   }

//   const mailOptions = {
//     from: `"GoFood Support" <${senderEmail}>`, // Display name and sender's email address
//     to: email, // Recipient's email address
//     subject: "Your One-Time Password (OTP) for GoFood Account Verification", // Subject line of the email
//     text: `Dear user,

// Your One-Time Password (OTP) is ${otp}. This code is valid for the next 5 minutes and can be used to verify your account or complete your current action.

// If you did not request this code, please ignore this email.

// Best regards,
// The GoFood Team`, // Plain text body for fallback
//     html: `
//       <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//         <h2 style="color: #0056b3;">Dear User,</h2>
//         <p>Thank you for using GoFood! To proceed with your account verification or current action, please use the following One-Time Password (OTP):</p>
//         <p style="font-size: 1.2em; font-weight: bold; color: #ff6f00;">${otp}</p>
//         <p>This code is valid for the next <strong>5 minutes</strong>. Please do not share this OTP with anyone.</p>
//         <p>If you did not request this code, please disregard this email. Your account security is important to us.</p>
//         <p>Best regards,<br>The GoFood Team</p>
//         <hr>
//         <p style="font-size: 0.9em; color: #777;">If you have any questions, please contact our support team at <a href="mailto:support@gofood.com">support@gofood.com</a>.</p>
//       </div>
//     `, // HTML body for better formatting
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`OTP sent to ${email}`);

//     // Save OTP and expiration to the database
//     // await otp.create({ user: userId, OTP: otp, otpExpiration });
//   } catch (error) {
//     console.error("Error sending OTP email:", error);
//     throw new Error("Failed to send OTP. Please try again.");
//   }

//   return { otp, otpExpiration };
// };
