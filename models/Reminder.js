const  mongoose = require( "mongoose");

const reminderSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  medicationName: String,
  dosage: String,
  frequency: String,
  email: String,
  phone:Number,
  time: Date,
  customNotificationTime: Number, 
 
});

const userReminder = mongoose.model('Reminder', reminderSchema);
module.exports  = userReminder
