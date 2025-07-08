import {Router} from "express";
import {authorize} from "../middlewares/auth.middleware.js";
import {addTransfer, getTransfer} from "../controllers/transfer.controller.js";

const transferRouter = Router()


transferRouter.post("/", authorize, addTransfer);
transferRouter.get("/:id", authorize, getTransfer);

export default transferRouter;