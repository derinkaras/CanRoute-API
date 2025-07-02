import {Router} from "express";
import {
    addServiceLog,
    deleteServiceLog,
    editServiceLog,
    getCansServicedByUser, getSpecificUserCanOnDay
} from "../controllers/serviceLog.controller.js";
import {authorize} from "../middlewares/auth.middleware.js";


const serviceLogRouter = Router()

serviceLogRouter.post("/", authorize, addServiceLog)
serviceLogRouter.get("/specific/:userId/:canId/:weekOf", authorize, getSpecificUserCanOnDay)
serviceLogRouter.patch("/:userId/:canId/:weekOf", authorize, editServiceLog)
serviceLogRouter.delete("/:id", authorize, deleteServiceLog)
serviceLogRouter.get("/:id", authorize, getCansServicedByUser)


export default serviceLogRouter;