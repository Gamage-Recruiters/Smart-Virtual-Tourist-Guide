import ContactForm from '../models/ContactForm.js';
import nodemailer from 'nodemailer';

export const submitContactForm = async (req, res, next) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    // 1. Save to database
    const contactForm = new ContactForm({
      fullName,
      email,
      phone,
      subject,
      message
    });
    await contactForm.save();

    // 2. Send Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'smart.virtual.tourist.guide@gmail.com',
      subject: 'contact_form',
      text: `New Contact Form Submission:

Name: ${fullName}
Email: ${email}
Phone: ${phone || 'N/A'}
Subject: ${subject}

Message:
${message}`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    next(error);
  }
};
