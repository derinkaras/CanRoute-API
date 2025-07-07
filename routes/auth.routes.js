import {Router} from "express";
import {signIn, signUp, userExists} from "../controllers/auth.controller.js";
import {authorize} from "../middlewares/auth.middleware.js";


const authRouter = Router()

authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);
authRouter.get('/user-exists/:email', authorize,userExists) // Checks if the user by that meail exists

export default authRouter;

