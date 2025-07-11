import jwt from "jsonwebtoken";
import crypto from "crypto";
import { errorResponse } from "./serverResponse.js";

//
const key = crypto.randomBytes(32).toString("hex");

//function for generate token
export function generateToken(payload) {
  //create token
  const accessToken = jwt.sign(payload, key, {
    expiresIn: "30m",
  });

  //create refre token
  const refreshToken = jwt.sign(payload, key, {
    expiresIn: "2h",
  });

  return { accessToken, refreshToken };
}

//function for verify token
export function verifyToken(accessToken) {
  try {
    return jwt.verify(accessToken, key);
  } catch (error) {
    console.log("error", error.message);
    return null;
  }
}

//function for middleware
export async function authMiddleware(req, res, next) {
  try {
    const bearertoken = req.headers.authorization || req.headers.Authorization;

    if (!bearertoken) {
      return errorResponse(res, 401, "Authorization header is missing");
    }
    const tokendata = bearertoken.split(" ");

    if (!tokendata || tokendata?.length !== 2 || tokendata[0] !== "Bearer") {
      return errorResponse(res, 401, "invalid token");
    }
    const payload = verifyToken(tokendata[1]);
    if (!payload) {
      return errorResponse(res, 401, "Token is Invalid");
    }

    //declare locals
    res.locals.userId = payload.userId;
    res.locals.role = payload.role;
    next();
  } catch (error) {
    console.log(error);
    return errorResponse(res, "Internal server error");
  }
}

//function for super admin

export async function isSuperAdminMiddleware(req, res, next) {
  try {
    const role = res.locals.role;
    console.log(role);

    if (!role || role !== "admin") {
      return errorResponse(res, 401, "not authorized");
    }
    next();
  } catch (error) {
    console.log(error);
    return errorResponse(res, "Internal server error");
  }
}
