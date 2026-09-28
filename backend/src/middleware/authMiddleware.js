import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    //Get JWT from Http-only cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    //Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Store decoded user info in request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
