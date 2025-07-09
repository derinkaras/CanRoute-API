import {Router} from "express";
import {authorize} from "../middlewares/auth.middleware.js";
import {addTransfer, deleteTransfer, getTransfer} from "../controllers/transfer.controller.js";

const transferRouter = Router()


transferRouter.post("/", authorize, addTransfer);
transferRouter.get("/:id", authorize, getTransfer);
transferRouter.delete("/:id", authorize, deleteTransfer);

export default transferRouter;