import {Router} from "express";
import {authorize} from "../middlewares/auth.middleware.js";
import {acceptTransfer, addTransfer, deleteTransfer, getTransfers} from "../controllers/transfer.controller.js";

const transferRouter = Router()


transferRouter.post("/", authorize, addTransfer);
transferRouter.get("/:id", authorize, getTransfers);
transferRouter.delete("/:id", authorize, deleteTransfer);
transferRouter.post("/accept/:id", authorize, acceptTransfer);

export default transferRouter;