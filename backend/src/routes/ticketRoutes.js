import express from "express";

import { createTicket } from "../controllers/ticketController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("CUSTOMER"), createTicket);
