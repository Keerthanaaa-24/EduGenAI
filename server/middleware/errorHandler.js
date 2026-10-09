const logger =
  require("../utils/logger");

const errorHandler = (
  err,
  req,
  res,
  next
) => {
  logger.error(
    err.stack
  );

  const statusCode = err.message === "Not allowed by CORS" ? 403 : (res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    message:
      err.message ||
      "Server Error",
  });
};

module.exports =
  errorHandler;
