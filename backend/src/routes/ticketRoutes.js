import express from "express";

import {
  createTicket,
  getMyTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("CUSTOMER"), createTicket);
router.get("/my", authMiddleware, roleMiddleware("CUSTOMER"), getMyTickets);
router.get("/:id", authMiddleware, roleMiddleware("CUSTOMER"), getTicketById);
router.patch("/:id", authMiddleware, roleMiddleware("CUSTOMER"), updateTicket);
router.delete("/:id", authMiddleware, roleMiddleware("CUSTOMER"), deleteTicket);

export default router;
