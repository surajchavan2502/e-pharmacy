import { Router } from "express";
import userMedicineRouter from "./userMedicineRouter.js";
import userProfile from "./userProfile.js";

const userRouter = Router();

userRouter.use("/medicines", userMedicineRouter);
userRouter.use("/profile", userProfile);
export default userRouter;
