import { Router } from "express";

import adminMedicineRouter from "./admin/adminMedicineRouter.js";
import {
  authMiddleware,
  isSuperAdminMiddleware,
} from "../../utils/jwtTokens.js";
import { errorResponse } from "../../utils/serverResponse.js";
import adminUserRouter from "./admin/adminUserRouter.js";
import userRouter from "./user/userRouter.js";

const protectedMiddlewareRouter = Router();

//api routes for the user
protectedMiddlewareRouter.use("/user", authMiddleware, userRouter);

//api routes for the admin
protectedMiddlewareRouter.use(
  "/medicines",
  authMiddleware,
  isSuperAdminMiddleware,
  adminMedicineRouter
);
//api routes of admin related to user
protectedMiddlewareRouter.use(
  "/admin-user",
  authMiddleware,
  isSuperAdminMiddleware,
  adminUserRouter
);

//redirect path
protectedMiddlewareRouter.get("/redirect", redirectController);

export default protectedMiddlewareRouter;

//recirect controller
async function redirectController(req, res) {
  try {
    const role = res.locals.role;
    const path = `role${role}`;
    res.redirect(path);
  } catch (error) {
    return errorResponse(res, "not redirect");
  }
}
