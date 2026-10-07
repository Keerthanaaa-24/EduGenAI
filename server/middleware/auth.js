const jwt = require("jsonwebtoken");

const auth = (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message:
          "No token provided",
      });
    }

    const token =
      authHeader.split(
        " "
      )[1];

    const jwtSecret =
      process.env.JWT_SECRET ||
      "edugen_default_jwt_secret_key";

    const decoded =
      jwt.verify(
        token,
        jwtSecret
      );

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message:
        "Unauthorized",
    });
  }
};

module.exports = auth;
