const  mongoose = require( "mongoose");

const reminderSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  medicationName: String,
  scheduledTime: Date,
  customNotificationTime: Number, 
 
});

const userReminder = mongoose.model('Reminder', reminderSchema);
module.exports  = userReminder
