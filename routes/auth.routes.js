import {Router} from "express";
import {signIn, signOut, signUp, userExists} from "../controllers/auth.controller.js";
import {authorize} from "../middlewares/auth.middleware.js";


const authRouter = Router()

authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);
authRouter.get('/:email', authorize, userExists) // Checks if the user by that meail exists

export default authRouter;

