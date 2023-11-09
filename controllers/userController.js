const userModel = require( "../Modals/User");
const bcrypt = require("bcrypt")
const jwt  = require("jsonwebtoken")

// Implement user signup logic
 const signup = async (req, res) => {
    try {
        let data = await userModel.find({ email: req.body.email });
        console.log(data, "data from signup");
    
        if (data.length > 0) {
          res.status(200).send({ msg: "User Already Exists" });
        } else {
          bcrypt.hash(req.body.password, 4, async (err, hash) => {
            if (err) {
              res.status(500).send({ msg: "SOMETHING WENT WRONG!" });
            }
            req.body.password = hash;
            req.body.administration = false;
            await UserModel.create(req.body);
            res.status(200).send({ msg: "User registered Successfully" });
          });
        }
      } catch (err) {
        console.log(err.message);
        res.status(404).send({ msg: "Failed to create a new user" });
      }
};

// Implement user login logic
const login = async (req, res) => {
    try {
        let data = await userModel.find({ email:req.body.email });
        if (data.length <= 0) {
          res.status(200).send({ msg: "User not found" });
        } else {
          bcrypt.compare(
            req.body.password,
            data[0].password,
             (err, result)=> {
              
              if (err) {
                res.status(500).send({ msg: "Something went wrong !" });
              } else if (result) {
                jwt.sign(
                  { userID: data[0]._id },
                  process.env.secreatkey,
                  (err, token) => {
                    res
                      .status(200)
                      .send({ msg: "User login Successfully", token: token,displayName:data[0].name,administration: data[0].administration});
                  }
                );
              }
              else{
                  res.status(200).send({msg:"Wrong password"})
              }
            }
          );
        }
      } catch (e) {
        console.log(e);
        res.status(404).send({ msg: "Failed to login" });
      }
};

// Update user profile information
 const updateProfile =async (req, res) => {
    const { username, email, phone } = req.body;
    const userId = req.user.id; // Extract the authenticated user's ID from the token
  
    try {
      // Find the user by ID
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user profile information
      user.username = username;
      user.email = email;
      user.phone = phone;
  
      await user.save();
  
      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports ={signup,login, updateProfile}