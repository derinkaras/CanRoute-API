import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";


export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const { name, email, password } = req.body;
        const isExistingUser = await User.findOne({email});

        // If the user exists, throw an error
        if (isExistingUser) {
            console.log(isExistingUser);
            const error = new Error("User already exists")
            error.status = 409;
            throw error;
        }

        // User doesn't exist so continue creating
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([ {name, email, password: hashedPassword, role: "crew"}], {session})
        const newUser = newUsers[0]

        const token = jwt.sign({userId: newUser._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN})
        await session.commitTransaction();
        await session.endSession()
        res.status(201).json({
            success: true,
            message: "User successfully created!",
            data: {
                token,
                user: newUser,
            }
        })

    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        next(error)
    }

}


export const signIn = async (req, res, next) => {
    // Implement sign in logic here
    try {
        const { email, password } = req.body;
        // Search the users collection and return the first document where the email key equals this email value.
        const user = await User.findOne({email})
        if (!user) {
            const error = new Error("Users doesn't exist");
            error.status = 404;
            throw error;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            const error = new Error("Invalid password");
            error.status = 401;
            throw error;
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(200).json({
            success: true,
            message: "User signed in successfully!",
            data: {
                token,
                user,
            }
        })
    } catch (error) {
        // This forwards the error to our error handling middleware
        next(error)
    }
}


export const signOut = async function (req, res) {}