import {Router} from "express";
import {
    addCan,
    deleteCan,
    editCan,
    getCan,
    getCans,
    getCrewMemberCans
} from "../controllers/can.controller.js";
import {authorize} from "../middlewares/auth.middleware.js";


const canRouter = Router();

canRouter.get("/", authorize, getCans )
canRouter.get("/crew/:id", authorize, getCrewMemberCans) //
canRouter.get("/:id", authorize, getCan )
canRouter.post('/', authorize, addCan)
canRouter.patch('/:id', authorize, editCan)
canRouter.delete('/:id', authorize, deleteCan)

export default canRouter;