const  mongoose = require( "mongoose");

const reminderSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  medicationName: String,
  dosage: String,
  frequency: String,
  frequencyType: String,
  email: String,
  phone:Number,
  time: [String],
 
});

const userReminder = mongoose.model('Reminder', reminderSchema);
module.exports  = userReminder
