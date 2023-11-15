const express =  require ('express');
const path = require('path');
const { createReminder,updateReminder} = require(path.join(__dirname, "../controllers/reminderController.js"));

 // Import authentication middleware

const router = express.Router();


router.post('/createReminder', createReminder);


router.put('/updateReminder/:id', updateReminder);

module.exports= router