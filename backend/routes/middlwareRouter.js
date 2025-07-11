import { Router } from "express";
import authRouter from "./public/authRouter.js";
import protectedMiddlewareRouter from "./protected/protectedMiddlewareRouter.js";

const middlewareRouter = Router();

//api for  public
middlewareRouter.use("/auth", authRouter);

//api for admin
middlewareRouter.use("/admin", protectedMiddlewareRouter);

export default middlewareRouter;
