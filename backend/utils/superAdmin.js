import userModel from "../models/userModel.js";
import { hashPassword } from "./encryptPassword.js";

async function createSuperAdmin() {
  const superAdmin = await userModel.findOne({ email: "superadmin@gmail.com" });

  if (!superAdmin) {
    userModel.create({
      fname: "super",
      lname: "admin",
      role: "admin",
      email: "superadmin@gmail.com",
      password: hashPassword("superadmin"),
    });
  } else {
    console.log("superAdmin already exists");
  }
}

export default createSuperAdmin;
