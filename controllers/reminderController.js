const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const Reminder = require('../models/Reminder');

// Validate input data for creating a new reminder
const validateCreateReminderData = (data) => {
    const { medicationName, dosage, frequency, time, email, phone } = data;
    const errors = [];
  
    if (!medicationName || typeof medicationName !== 'string') {
      errors.push('Medication name is required and must be a string.');
    }
  
    if (!dosage || typeof dosage !== 'string') {
      errors.push('Dosage is required and must be a string.');
    }
    if (!frequency || typeof frequency !== 'string') {
        errors.push('Medication name is required and must be a string.');
    }
    
    if (!email || typeof email !== 'string') {
        errors.push('Dosage is required and must be a string.');
    }
    if (!time || typeof time !== 'string') {
        errors.push('Medication name is required and must be a string.');
    }
    
    if (!phone || typeof phone !== 'string') {
        errors.push('Dosage is required and must be a string.');
      }
    
    
  
    return errors;
  };
  
  // Validate input data for updating a reminder
  const validateUpdateReminderData = (data) => {
    const { reminderId, customNotificationTime } = data;
    const errors = [];
  
    if (!reminderId || typeof reminderId !== 'string') {
      errors.push('Reminder ID is required and must be a string.');
    }
  
    // Add more validation for other fields as needed
  
    return errors;
  };
  
  // Create a new medication reminder
  const createReminder = async (req, res) => {
    try {
      const { medicationName, dosage, frequency, time, email, phone } = req.body;
  
      // Validate input data
      const validationErrors = validateCreateReminderData(req.body);
  
      if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }
  
      // Create a new reminder
      const newReminder = new Reminder({
        userId: req.user.id,
        medicationName,
        dosage,
        frequency,
        time,
        email,
        phone,
      });
  
      await newReminder.save();
  
      // Schedule the reminder at the specified time
      scheduleReminder(newReminder);
  
      res.status(201).json({ message: 'Medication reminder created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Update a medication reminder's custom notification time
  const updateReminder = async (req, res) => {
    try {
      const { reminderId, customNotificationTime } = req.body;
  
      // Validate input data
      const validationErrors = validateUpdateReminderData(req.body);
  
      if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }
  
      // Find the reminder by ID
      const reminder = await Reminder.findById(reminderId);
  
      if (!reminder) {
        return res.status(404).json({ message: 'Reminder not found' });
      }
  
      // Update the reminder's custom notification time
      reminder.customNotificationTime = customNotificationTime;
  
      await reminder.save();
  
      // Reschedule the reminder with the updated custom time
      scheduleReminder(reminder);
  
      res.status(200).json({ message: 'Reminder updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  // Function to schedule a reminder
const scheduleReminder = (reminder) => {
    // Use custom time if set, otherwise default to 5 minutes before the medication time
    const reminderTime = reminder.customNotificationTime || new Date(reminder.time.getTime() - 5 * 60 * 1000);
  
    schedule.scheduleJob(reminderTime, () => {
      // Send reminder notification
      sendReminderNotification(reminder);
    });
  };
  
  // Function to send the reminder notification via email and SMS
  const sendReminderNotification = async (reminder) => {
    try {
      // Create a nodemailer transporter for sending emails
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'your-email@gmail.com', // Replace with your Gmail email address
          pass: 'your-email-password', // Replace with your Gmail app password
        },
      });
  
      // Create the email message
      const mailOptions = {
        from: 'your-email@gmail.com', // Replace with your Gmail email address
        to: reminder.email,
        subject: 'Medication Reminder',
        text: `It's time to take your medication (${reminder.medicationName}).`,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
  
      // Use Twilio to send SMS
      const twilioClient = new twilio.Twilio('your-twilio-account-sid', 'your-twilio-auth-token');
      const smsMessage = `It's time to take your medication (${reminder.medicationName}).`;
      await twilioClient.messages.create({
        body: smsMessage,
        to: reminder.phone,
        from: 'your-twilio-phone-number', // Replace with your Twilio phone number
      });
  
      console.log(`Reminder sent to ${reminder.email} and ${reminder.phone}`);
    } catch (error) {
      console.error('Error sending reminder:', error);
    }
  };
  
  module.exports = {
    createReminder,
    updateReminder,
  };

  module.exports = {
    createReminder,
    updateReminder,
  };