import {Router} from "express";
import {
    addServiceLog,
    deleteServiceLog,
    editServiceLog,
    getCansServicedByUser, getUserServiceLogForCanAndWeek, getUserServiceLogsForAllCansOfWeek
} from "../controllers/serviceLog.controller.js";
import {authorize} from "../middlewares/auth.middleware.js";


const serviceLogRouter = Router()

serviceLogRouter.post("/", authorize, addServiceLog)
serviceLogRouter.get("/specific/:userId/:canId/:weekOf", authorize, getUserServiceLogForCanAndWeek)
serviceLogRouter.get("/specific/:userId/:weekOf", authorize, getUserServiceLogsForAllCansOfWeek)

serviceLogRouter.patch("/:userId/:canId/:weekOf", authorize, editServiceLog)
serviceLogRouter.delete("/:id", authorize, deleteServiceLog)
serviceLogRouter.get("/:id", authorize, getCansServicedByUser)


export default serviceLogRouter;