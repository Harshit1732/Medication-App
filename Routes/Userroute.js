const express =  require ('express');
const path = require('path');
const { signup, login, updateProfile } = require(path.join(__dirname, '../controllers/userController'));

const authMiddleware = require('../middleware/auth'); // Import authentication middleware

const router = express.Router();


router.post('/signup', signup);


router.post('/login', login);

router.use(authMiddleware);

router.put('/profile', updateProfile);

module.exports= router