import { connect } from "mongoose";
import { DB_URL } from "./serverConfig.js";

async function dbConnect() {
  try {
    await connect(DB_URL, {
      timeoutMS: 10000,
    });
    console.log("dbConnect successfully!!!");
  } catch (error) {
    throw error;
  }
}

export default dbConnect;
