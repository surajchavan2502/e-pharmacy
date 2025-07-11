import bcrypt from "bcrypt";

//create hash password
export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

//compare password
export function comparePassword(password, hashPassword) {
  return bcrypt.compareSync(password, hashPassword);
}
