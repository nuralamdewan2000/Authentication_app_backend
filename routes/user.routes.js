const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer'); 
const path = require('path');
const { UserModel } = require('../model/user.model');
const {auth} =require('../middleware/user.auth')
require('dotenv').config();

const userRouter = express.Router();

// POST /api/register
// This endpoint should allow users to register. Hash the password before storing.
userRouter.post('/register', async (req, res) => {
    const { profilePicture,name,bio,phone, email, password } = req.body;
    
    try {
        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'User already exists' });
        }

        // Hash the password
        bcrypt.hash(password,8,async(err,hash) =>{
            if(err){
                res.status(200).send({"error":err})
            }else{
                const user = new UserModel({profilePicture,name,bio,phone, email, password:hash})
                await user.save()
                res.status(201).send({msg:"New user has benn added successfully"})
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
});

// POST /api/login
// This endpoint should allow users to login. Return JWT token on login.
userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        bcrypt.compare(password,user.password,(err,result) =>{
            if(result){
                const token =jwt.sign({userid:user._id},process.env.SecretKey,{expiresIn:"7d"})
              
                res.status(201).send({"msg":"login successfully!",token})
            }else{ 
                res.status(404).send({msg:"Invalid credintial for user login","error":err})
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
});


userRouter.get('/getProfile',auth,async(req,res) =>{
     try{
        const user =req.body
        res.status(200).send({msg:"details of user is",user})


     }catch(error){
        console.log(error);
        res.status(500).send({msg:"error in getting the profile details",error})
     }
})


// Multer storage configuration for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile_pictures'); // Destination folder for profile pictures
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with original extension
    }
});

// Multer file upload middleware
const upload = multer({ storage: storage });

// Endpoint to handle profile updates
userRouter.patch('/editProfile', auth, upload.single('profilePicture'), async (req, res) => {
    try {
        const userId = req.body.user._id;

        // Extract updated user details from request body
        const { name, bio, phone, email, password } = req.body;

        // Find the user by ID and update their details
        let updatedFields = {};
        if (name) updatedFields.name = name;
        if (bio) updatedFields.bio = bio;
        if (phone) updatedFields.phone = phone;
        if (email) updatedFields.email = email;
        if (password) updatedFields.password = password;

        // Handle profile picture upload if provided
        if (req.file) {
            updatedFields.profilePicture = req.file.path; // Save the path to the profile picture in the database
        }

        // Update the user record
        const updatedUser = await User.findByIdAndUpdate(userId, { $set: updatedFields }, { new: true });

        // Send response with updated user details
        res.status(200).send(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Error in edit profile", error });
    }
});
  

module.exports ={
    userRouter
}