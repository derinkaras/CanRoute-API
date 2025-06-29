import express from "express";
import cookieParser from "cookie-parser";
import {PORT} from "./config/env.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import canRouter from "./routes/can.routes.js";
import serviceLogRouter from "./routes/serviceLog.routes.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import job from "./cron.js";

job.start()

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware)

app.get('/', (req, res) => {
    res.send('Welcome to the CanRoute API!')
})

app.use("/api/v1/users", authRouter)
app.use("/api/v1/cans", canRouter);
app.use("/api/v1/serviceLogs", serviceLogRouter);
app.use(errorMiddleware) // Always want to use your error middleware after your routes

app.listen(PORT, async () => {
    console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);
    await connectToDatabase();
})

export default app;
