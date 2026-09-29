import express from "express";
import {
  register,
  login,
  getMe,
  logout,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.post("/logout", logout);
router.get(
  "/customer-test",
  authMiddleware,
  roleMiddleware("CUSTOMER"),
  (req, res) => {
    res.json({
      message: "Customer access granted",
      user: req.user,
    });
  },
);

router.get(
  "/agent-test",
  authMiddleware,
  roleMiddleware("AGENT"),
  (req, res) => {
    res.json({
      message: "Agent access granted",
      user: req.user,
    });
  },
);

router.get(
  "/admin-test",
  authMiddleware,
  roleMiddleware("ADMIN"),
  (req, res) => {
    res.json({
      message: "Admin access granted",
      user: req.user,
    });
  },
);

export default router;
