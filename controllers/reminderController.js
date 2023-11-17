const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const Reminder = require("../models/Reminder");

// Validate input data for creating a new reminder
const validateCreateReminderData = (data) => {
  const { medicationName, dosage, frequency, time, email, phone } = data;
  const errors = [];

  if (!medicationName || typeof medicationName !== "string") {
    errors.push("Medication name is required and must be a string.");
  }

  if (!dosage || typeof dosage !== "string") {
    errors.push("Dosage is required and must be a string.");
  }
  if (!frequency || typeof frequency !== "string") {
    errors.push("Medication name is required and must be a string.");
  }

  if (!email || typeof email !== "string") {
    errors.push("Dosage is required and must be a string.");
  }
  // if (!time || typeof time !== "string") {
  //   errors.push("Medication name is required and must be a string.");
  // }

  if (!phone || typeof phone !== "string") {
    errors.push("Dosage is required and must be a string.");
  }

  return errors;
};

// Validate input data for updating a reminder
const validateUpdateReminderData = (data) => {
  const { reminderId, customNotificationTime } = data;
  const errors = [];

  if (!reminderId || typeof reminderId !== "string") {
    errors.push("Reminder ID is required and must be a string.");
  }

  return errors;
};

// Create a new medication reminder
const createReminder = async (req, res) => {
  try {
    const {medicationName, dosage, frequency, time, email, phone,frequencyType } = req.body;
    
    const validationErrors = validateCreateReminderData(req.body);

    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    // Create a new reminder
    const newReminder = new Reminder({
      // userId: req.user._id,
      medicationName,
      dosage,
      frequency,
      frequencyType,
      time,
      email,
      phone,
    });

    await newReminder.save();

    // Schedule the reminder at the specified time
    await fetchingReminders();

    res
      .status(201)
      .json({ message: "Medication reminder created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a medication reminder's custom notification time
const updateReminder = async (req, res) => {
  try {
    const { reminderId, customTime } = req.body;

    // Validate input data
    const validationErrors = validateUpdateReminderData(req.body);

    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    // Find the reminder by ID
    const reminder = await Reminder.findById(reminderId);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    // Update the reminder's custom notification time
    reminder.time= customTime;
    // reminder.customNotificationTime = customNotificationTime;

    await reminder.save();

    // Reschedule the reminder with the updated custom time
    scheduleReminder(reminder);

    res.status(200).json({ message: "Reminder updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const fetchingReminders= async()=>{

  try{
  const reminders=  await Reminder.find()
  console.log(reminders)
  reminders.forEach(reminder=>{
    scheduleReminder(reminder)
  })
  schedule.scheduleJob('0 0 * * *', () => {
    // Schedule the daily reminders
    fetchingReminders();
  });
}catch(error){
  console.log("error while fetching reminders")
}

}





const scheduleReminder = (reminder) => {


  if (reminder.frequencyType=== "EveryDay" && Array.isArray(reminder.time)) {
    reminder.time.forEach(time => {
      const timeComponents = time.split(":"); 
      const hours = parseInt(timeComponents[0], 10);
      const minutes = parseInt(timeComponents[1], 10);

      console.log(reminder)
      const reminderTime = new Date(); 
      reminderTime.setHours(hours); 
      reminderTime.setMinutes(minutes - 5); 

      schedule.scheduleJob(reminderTime, () => {
        // Send reminder notification
        sendReminderNotification(reminder);
      });
    });
  } else if (reminder.frequencyType === "Interval-based") {
    const intervalHours = 3; // Replace this with your desired interval in hours

    const timeComponents = reminder.time[0].split(":"); // Split the time string into hours and minutes
    const startHours = parseInt(timeComponents[0], 10);
    const startMinutes = parseInt(timeComponents[1], 10);

    const startingTime = new Date(); // Get the current date and time
    startingTime.setHours(startHours); // Set the starting hours
    startingTime.setMinutes(startMinutes); // Set the starting minutes

    schedule.scheduleJob(startingTime, () => {
      sendReminderNotification(reminder);
      schedule.scheduleJob({ start: startingTime, rule: `0 */${intervalHours} * * *` }, () => {
        sendReminderNotification(reminder);
      });
    });
};

   schedule.scheduleJob('0 0 * * *', () => {
  // Schedule the daily reminders
   scheduleDailyReminders();
});
}




// Function to send the reminder notification via email and SMS
const sendReminderNotification = async (reminder) => {
  console.log("email sending");
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "harshitgupta1732000@gmail.com",
        pass: "yadnhcqegkqlblqf",
      },
    });

    // Create the email message
    const mailOptions = {
      from: "harshitgupta1732000@gmail.com", // Replace with your Gmail email address
      to: reminder.email,
      subject: "Medication Reminder",
      text: `It's time to take your medication (${reminder.medicationName}).`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Use Twilio to send SMS
    const twilioClient = new twilio.Twilio(
      "ACd8c17d9345d9e26720e3ce7ea7597a52",
      "04f5b3d8f6528aec843e575e03cf3ae8"
    );
    const smsMessage = `It's time to take your medication (${reminder.medicationName}).`;
    await twilioClient.messages.create({
      body: smsMessage,
      to: reminder.phone,
      from: "+12512548801", // Replace with your Twilio phone number
    });

    console.log(`Reminder sent to ${reminder.email} and ${reminder.phone}`);
  } catch (error) {
    console.error("Error sending reminder:", error);
  }
};




module.exports = {
  createReminder,
  updateReminder,
};