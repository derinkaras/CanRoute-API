import {Router} from "express";
import {
    addServiceLog,
    deleteServiceLog,
    editServiceLog, getCanServicedByUser,
    getCansServicedByUser, getSpecificUserCanOnDay
} from "../controllers/serviceLog.controller.js";
import {authorize} from "../middlewares/auth.middleware.js";


const serviceLogRouter = Router()

serviceLogRouter.post("/", authorize, addServiceLog)
serviceLogRouter.get("/specific/:userId/:canId/:weekOf", authorize, getSpecificUserCanOnDay)
serviceLogRouter.delete("/:id", authorize, deleteServiceLog)
serviceLogRouter.patch("/:id", authorize, editServiceLog)
serviceLogRouter.get("/:id", authorize, getCansServicedByUser)


export default serviceLogRouter;