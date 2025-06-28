import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config/env.js";
import User from "../models/user.model.js";

export const authorize = async (req, res, next) => {
    // Makes sure a user is authenticated before making a request, will also add user field to the req dict
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token) return res.status(401).json({message: 'Unauthorized'});
        // Since we added an expiry to the token if its past the expiry this decoded will actaully just throw and error
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId)
        if (!user) return res.status(401).json({message: 'Unauthorized'});
        // This will populate the req.user which the interfaces of controllers also use
        req.user = user;
        next()
    } catch (error) {
        res.status(401).json({message: "Unauthorized", error: error.message});
    }
}