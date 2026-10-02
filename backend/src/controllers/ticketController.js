import prisma from "../config/prisma.js";

export const createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }
    console.log("Authenticated user:", req.user);

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        customerId: req.user.userId,
      },
    });

    return res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.error("Create ticket error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        customerId: req.user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      tickets,
    });
  } catch (error) {
    console.error("Get my tickets error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticketId = Number(req.params.id);

    if (Number.isNaN(ticketId)) {
      return res.status(400).json({
        message: "Invalid ticket ID",
      });
    }

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    if (req.user.role === "CUSTOMER" && ticket.customerId !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to access this ticket",
      });
    }

    return res.status(200).json({
      ticket,
    });
  } catch (error) {
    console.error("Get ticket error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const ticketId = Number(req.params.id);

    if (Number.isNaN(ticketId)) {
      return res.status(400).json({
        message: "Invalid ticket ID",
      });
    }

    const { title, description, priority } = req.body;

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    //Customer can only update their own ticket
    if (req.user.role === "CUSTOMER" && ticket.customerId !== req.user.userId) {
      return res.status(403).json({
        message: "You must not allowed to update this ticket",
      });
    }

    const updatedTicket = await prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(priority !== undefined && { priority }),
      },
    });

    return res.status(200).json({
      message: "Ticket updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Update ticket error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const ticketId = Number(req.params.id);

    if (Number.isNaN(ticketId)) {
      return res.status(400).json({
        message: "Invalid ticket ID",
      });
    }

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    if (req.user.role === "CUSTOMER" && ticket.customerId !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to delete this ticket",
      });
    }

    await prisma.ticket.delete({
      where: {
        id: ticketId,
      },
    });

    return res.status(200).json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.error("Delete ticket error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
