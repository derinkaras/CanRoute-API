import {Router} from "express";
import {addPayrollNumber} from "../controllers/payroll.controller.js";


const payrollRouter = Router()

payrollRouter.post("/", addPayrollNumber)

export default payrollRouter;