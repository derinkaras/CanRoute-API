import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";
import Payroll from "../models/payroll.model.js";
import * as trace_events from "node:trace_events";


export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const { name, email, password, payrollNumber, role} = req.body;
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

        // The payroll number being unique makes it so if someone has already created an account with the payroll number trying to do it again
        // would create an error which is caught and passed to our error handling middleware
        const isValidPayrollNumber = await Payroll.findOne({
            payrollNumber
        })

        if (!isValidPayrollNumber) {
            return res.status(400).send({
                success: false,
                error: "Invalid Payroll Number"
            })
        }
        let newUsers;
        if (role) {
            newUsers = await User.create([ {name, email, password: hashedPassword, role, payrollNumber}], {session})
        } else {
            newUsers = await User.create([ {name, email, password: hashedPassword, payrollNumber}], {session})

        }
        const newUser = newUsers[0]

        const token = jwt.sign({userId: newUser._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN})
        await session.commitTransaction();
        await session.endSession()
        return res.status(201).json({
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

export const adminSignIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error("User doesn't exist");
            error.status = 404;
            throw error;
        }

        if (user.role === "crew") {
            const error = new Error("Crew members are not allowed to access admin portal");
            error.status = 403;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error("Invalid password");
            error.status = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({
            success: true,
            message: "Admin signed in successfully!",
            data: {
                token,
                user: userObj,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const userExists = async function (req, res, next) {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });
        return res.status(200).json({
            success: !!user,
            data: user
        });
    } catch (error) {
        next(error);
    }
}

