import {Request, Response} from 'express'
const router = require('express').Router()
const User = require('../models/userModel')
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/register', async function (req: Request, res: Response) {

    const {email, password, name} = req.body

  try{
    const userExists = await User.findOne({email})
    if(userExists) {
        return res
          .status(409)
          .send({ success: false, message: "User already exists" });
    }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({name: name, email: email, password: hashedPassword})
        await newUser.save()

         return res.status(201).send({
           success: true,
           message: "User created",
         });


  } catch(err) {
    console.error(err)
    res.status(500).send({
      success: false,
      message: 'Server error',
    });
  }
})


router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({success: false, message: "Invalid email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({success: false, message: "Invalid password" });
    }

    
    const token = jwt.sign({userId: user._id}, process.env.jwt_secret as string, {expiresIn: "1h"})
    res.status(200).send({success: true, message: "User succesfully logged in", accessToken: token})
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get('/get-current-user', authMiddleware, async (req: Request, res: Response) => {

  try {
    const user = await User.findById(req.body.userId)
    res.status(200).send({ success: true, message: "User fetched succesfully", data: user });
  } catch (err) {
    res.send({
      success: false,
      message: (err as Error).message
    })
  }
})

router.get("/get-all-users", authMiddleware, async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res
      .status(200)
      .send({
        success: true,
        message: "All users fetched successfully",
        data: users,
      });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error fetching all users: " + (err as Error).message,
    });
  }
});

router.put(
  "/update-user-status/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { status },
      );
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "User not found." });
      }
      return res.status(200).json({
        success: true,
        message: "User status updated successfully.",
        data: user,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error updating user status: " + (err as Error).message,
      });
    }
  }
);


module.exports = router