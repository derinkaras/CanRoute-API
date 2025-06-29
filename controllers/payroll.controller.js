import Payroll from "../models/payroll.model.js";


export const addPayrollNumber = async (req, res, next) => {
    const {userId, payrollNumber} = req.body;

    try {
        const payroll = await Payroll.create([{
            userId,
            payrollNumber,
        }])
        return res.status(200).json({
            success: true,
            data: payroll,
        })

    } catch (error) {
        next(error)
    }

}