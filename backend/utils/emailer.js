import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Function to send an email
export async function sendEmail(to, subject, otp) {
  try {
    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // HTML email template for OTP
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Your OTP Code</h2>
        <p style="font-size: 16px; color: #555; text-align: center;">
          Use the OTP below to proceed with password reset request. This OTP is valid for the next 10 minutes.
        </p>
        <div style="font-size: 24px; font-weight: bold; color: #2d89ff; text-align: center; padding: 10px; background: #f1f4f8; border-radius: 5px;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">
          If you didn’t request this, you can safely ignore this email.
        </p>
        <p style="font-size: 14px; text-align: center; color: #555; margin-top: 10px;">
          <strong>Thank you!</strong> <br> Ghodawat Pharma, Kolhapur
        </p>
      </div>
    `;

    // Email options
    const mailOptions = {
      from: `"e-Pharmacy" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlTemplate,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.response}`);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email" };
  }
}
