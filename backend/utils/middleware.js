//middleware

export async function authMiddleware(req, res, next) {
  console.log("middleware");
  next();
}
