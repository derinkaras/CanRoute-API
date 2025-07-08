import {Router} from "express";
import {authorize} from "../middlewares/auth.middleware.js";
import {addTransfer} from "../controllers/transfer.controller.js";

const transferRouter = Router()


transferRouter.post("/", authorize, addTransfer);

export default transferRouter;