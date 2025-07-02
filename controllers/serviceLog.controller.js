import ServiceLog from "../models/serviceLog.model.js";


export const addServiceLog = async (req, res, next) => {
    try {
        const { canId, userId, weekOf, status, servicedAt, illegalDumping, notes} = req.body;
        const serviceLogs = await ServiceLog.create([{canId, userId, weekOf, status, servicedAt, illegalDumping, notes}])
        const serviceLog = serviceLogs[0]
        return res.status(200).json({
            success: true,
            data: serviceLog
        })
    } catch (e) {
        next(e)
    }
}

export const deleteServiceLog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const isDeleted = await ServiceLog.findByIdAndDelete(id)
        if (!isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Service log does not exist'
            })
        }
        return res.status(200).json({
            success: true,
            data: isDeleted
        })
    } catch(e){
        next(e)
    }

}

export const editServiceLog = async (req, res, next) => {
    try {
        const { userId, canId, weekOf } = req.params;
        const date = new Date(weekOf);
        const updates = req.body;
        const updatedServiceLog = await ServiceLog.findOneAndUpdate({
            userId,
            canId,
            weekOf: date,
        }, updates, {
            new: true,
            runValidators: true
        })
        return res.status(200).json({
            success: true,
            data: updatedServiceLog
        })
    } catch (e) {
        next(e)
    }
}

export const getCansServicedByUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userServiceLogs = await ServiceLog.find({
            userId: id
        })
        return res.status(200).json({
            success: true,
            data: userServiceLogs
        })
    } catch (e) {
        next(e);
    }
}

export const getUserServiceLogForCanAndWeek = async (req, res, next) => {
    // Gets the specific service of a can for that week
    // Need to change later to account for same can being service M and F for same week
    try {
        const { userId, canId, weekOf } = req.params;
        const date = new Date(weekOf);
        const userServiceLogs = await ServiceLog.find({
            userId,
            canId,
            weekOf: date
        })
        return res.status(200).json({
            success: true,
            data: userServiceLogs
        })
    } catch (e) {
        next(e);
    }
}

export const getUserServiceLogsForAllCansOfWeek = async (req, res, next) => {
    try {
        const {userId, weekOf} = req.params;
        const date = new Date(weekOf);
        const userServiceLogs = await ServiceLog.find({
            userId,
            weekOf: date
        })
        return res.status(200).json({
            success: true,
            data: userServiceLogs
        })

    } catch (error) {
        next(error)
    }
}