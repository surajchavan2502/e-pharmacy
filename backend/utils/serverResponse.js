//sucess response

export async function successResponse(res, message = "", data = null) {
  return res.status(200).json({
    status: 200,
    error: false,
    message,
    data,
  });
}

//error response
export async function errorResponse(res, status, message = "") {
  return res.status(status).json({
    status,
    error: true,
    message,
    data: null,
  });
}

//error response handler
export async function errorResponseHandler(req, res) {
  return res.status(403).json({ message: "not found" });
}
