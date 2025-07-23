import Can from "../models/can.model.js";
import mongoose from "mongoose";
import csvParser from "csv-parser";
import { Readable } from "stream";
import { generateCanQrUrl } from "../utils/qr.js";

export const getCans = async (req, res, next) => {
    try {
        const cans = await Can.find()
        res.status(200).json({
            success: true,
            cans,
        })
    } catch (e) {
        next(e);
    }
}

export const getCan = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404).json({
                success: false,
                message: `Can with id: ${id} could not be found`,
            })
        }
        const can = await Can.findById(id)
        if (!can) {
            return res.status(404).json({
                success: false,
                message: `Can with id: ${id} could not be found`
            })
        }
        return res.status(200).json({
            success: true,
            data: can
        })
    } catch (e) {
        next(e);
    }
}

export const getCrewMemberCans = async (req, res, next) => {
    // This can be changed in the future to make sure the authorized user is the one thats requesting the data on their cans
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: `Can with id: ${id} does not exist`
            })
        }
        const cans = await Can.find({
            crewId: id
        })
        if (cans.length === 0) {
            return res.status(404).json({
                success: true,
                message: `Crew member with id: ${id} has no assigned cans`,
                data: []
            })
        }
        return res.status(200).json({
            success: true,
            data: cans
        })
    } catch (e) {
        next(e);
    }
}
export const addCan = async (req, res, next) => {
    try {
        const { location } = req.body;

        const canExists = await Can.findOne({
            "location.latitude": location.latitude,
            "location.longitude": location.longitude,
            assignedDay: req.body.assignedDay,
        });

        if (canExists) {
            return res.status(400).json({
                success: false,
                message: "Can at that specific location and date already exists",
            });
        }

        const newCan = await Can.create({
            ...req.body,
            location: {
                latitude: Number(location.latitude.toFixed(4)),
                longitude: Number(location.longitude.toFixed(4)),
            },
        });

        // ✅ Use short QR code URL, not a base64 string
        const qrCode = generateCanQrUrl(newCan._id);
        newCan.qrCode = qrCode;
        await newCan.save();

        return res.status(201).json({
            success: true,
            data: newCan,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCan = async (req, res, next) => {
    try {
        const { id } = req.params;
        const canExists = await Can.findById(id)
        if (!canExists) {
            return res.status(400).json({
                success: false,
                message: `The can id: ${id} does not exist`
            })
        }
        await Can.findByIdAndDelete({"_id":id})
        return res.status(200).json({
            success: true,
            message: "Can deleted successfully"
        })
    } catch (e) {
        next(e);
    }
}

export const editCan = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const canExists = await Can.findById(id)
        if (!canExists) {
            return res.status(400).json({
                success: false,
                message: `Can't edit can with id: ${id} because it does not exist`
            })
        }

        if (updates?.location) {
            updates.location.latitude = Number(updates.location.latitude.toFixed(4))
            updates.location.longitude = Number(updates.location.longitude.toFixed(4))
        }

        const updatedCan = await Can.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        })

        return res.status(200).json({
            success: true,
            message: "Can edited can successfully!",
            data: updatedCan
        })

    } catch (e) {
        next(e);
    }
}


export const updateCan = async (req, res, next) => {
    try {
        const { updates, newDay } = req.body;

        console.log("This is the new day: ", newDay);
        console.log("This is the updates: ", JSON.stringify(updates, null, 2));

        for (const [canId] of Object.entries(updates)) {
            if (!mongoose.Types.ObjectId.isValid(canId)) {
                continue;
            }

            await Can.findByIdAndUpdate(
                canId,
                { assignedDay: newDay },
                { new: true, runValidators: true }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Cans updated successfully"
        });
    } catch (e) {
        console.error("The error happened in the update can controller function", e);
        next(e);
    }
}


export const uploadCansFromCSV = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const validCans = [];
        const invalidCans = [];
        const stream = Readable.from(req.file.buffer);

        stream
            .pipe(csvParser())
            .on("data", (row) => {
                const { crewId, label, latitude, longitude, assignedDay } = row;

                const errors = [];
                if (!crewId || !mongoose.Types.ObjectId.isValid(crewId)) errors.push("Invalid or missing crewId");
                if (!label) errors.push("Missing label");
                if (isNaN(Number(latitude))) errors.push("Invalid latitude");
                if (isNaN(Number(longitude))) errors.push("Invalid longitude");
                if (
                    !["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].includes(
                        assignedDay?.toLowerCase()
                    )
                ) {
                    errors.push("Invalid assignedDay");
                }

                if (errors.length > 0) {
                    invalidCans.push({ row, error: errors.join("; ") });
                } else {
                    validCans.push({
                        crewId,
                        label,
                        assignedDay: assignedDay.toLowerCase(),
                        location: {
                            latitude: Number(Number(latitude).toFixed(4)),
                            longitude: Number(Number(longitude).toFixed(4)),
                        },
                    });
                }
            })
            .on("end", async () => {
                try {
                    const inserted = await Can.insertMany(validCans, { ordered: false });

                    // ✅ Attach QR code URL to each inserted can
                    for (const can of inserted) {
                        try {
                            const qrCode = generateCanQrUrl(can._id);
                            can.qrCode = qrCode;
                            await can.save();
                        } catch (qrErr) {
                            console.error(`Failed to generate QR for can ${can._id}:`, qrErr);
                        }
                    }

                    return res.status(201).json({
                        success: true,
                        message: `${inserted.length} cans added. ${invalidCans.length} rows skipped.`,
                        insertedCount: inserted.length,
                        validCans: inserted,
                        invalidRows: invalidCans,
                    });
                } catch (insertErr) {
                    return next(insertErr);
                }
            })
            .on("error", (parseErr) => {
                return next(parseErr);
            });
    } catch (e) {
        return next(e);
    }
};